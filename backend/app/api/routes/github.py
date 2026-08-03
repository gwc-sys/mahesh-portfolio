from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import APIRouter, Cookie, HTTPException, Query, Request
from fastapi.responses import RedirectResponse
from sqlalchemy import delete, select

from app.api.dependencies import CurrentUser, SessionDep, SettingsDep
from app.core.security import csrf_state, encrypt_secret
from app.models import GitHubConnection, Repository
from app.schemas.common import Message
from app.schemas.github import (
    GitHubRepository,
    GitHubStatus,
    RepositoryConnect,
    RepositoryResponse,
)
from app.services.github_service import (
    authorization_url,
    exchange_code,
    installation_repositories,
    user_and_installation,
)

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/connect")
async def connect(user: CurrentUser, settings: SettingsDep) -> RedirectResponse:
    if not settings.github_client_id:
        raise HTTPException(status_code=503, detail="GitHub App is not configured")
    state = csrf_state()
    response = RedirectResponse(authorization_url(settings, state))
    response.set_cookie(
        "github_oauth_state",
        state,
        max_age=600,
        secure=settings.secure_cookies,
        httponly=True,
        samesite="lax",
    )
    return response


@router.get("/callback")
async def callback(
    request: Request,
    user: CurrentUser,
    session: SessionDep,
    settings: SettingsDep,
    code: str = Query(),
    state: str = Query(),
    saved_state: str | None = Cookie(default=None, alias="github_oauth_state"),
) -> RedirectResponse:
    if not saved_state or state != saved_state:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")
    try:
        tokens = await exchange_code(settings, code)
        github_user, installation = await user_and_installation(tokens["access_token"])
    except Exception as exc:
        raise HTTPException(status_code=502, detail="GitHub authorization failed") from exc
    connection = await session.scalar(
        select(GitHubConnection).where(GitHubConnection.user_id == user.id)
    )
    expires = tokens.get("expires_in")
    values = {
        "github_installation_id": installation["id"],
        "github_user_id": github_user["id"],
        "github_username": github_user["login"],
        "access_token_encrypted": encrypt_secret(tokens["access_token"], settings),
        "refresh_token_encrypted": (
            encrypt_secret(tokens["refresh_token"], settings)
            if tokens.get("refresh_token")
            else None
        ),
        "token_expires_at": datetime.now(UTC) + timedelta(seconds=expires) if expires else None,
    }
    if connection:
        for key, value in values.items():
            setattr(connection, key, value)
    else:
        session.add(GitHubConnection(user_id=user.id, **values))
    user.github_user_id = github_user["id"]
    user.github_username = github_user["login"]
    user.github_avatar_url = github_user.get("avatar_url")
    await session.commit()
    response = RedirectResponse(f"{settings.frontend_url}/tasks?github=connected")
    response.delete_cookie("github_oauth_state")
    return response


@router.get("/status", response_model=GitHubStatus)
async def github_status(user: CurrentUser, session: SessionDep) -> GitHubStatus:
    connection = await session.scalar(
        select(GitHubConnection).where(GitHubConnection.user_id == user.id)
    )
    return GitHubStatus(
        connected=connection is not None,
        username=connection.github_username if connection else None,
        installation_id=connection.github_installation_id if connection else None,
    )


async def _available_repositories(
    user: CurrentUser, session: SessionDep, settings: SettingsDep
) -> tuple[GitHubConnection, list[dict[str, Any]]]:
    connection = await session.scalar(
        select(GitHubConnection).where(GitHubConnection.user_id == user.id)
    )
    if not connection:
        raise HTTPException(status_code=409, detail="GitHub is not connected")
    from app.core.security import decrypt_secret

    token = decrypt_secret(connection.access_token_encrypted, settings)
    try:
        repositories = await installation_repositories(token, connection.github_installation_id)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Unable to load GitHub repositories") from exc
    return connection, repositories


@router.get("/repositories", response_model=list[GitHubRepository])
async def repositories(
    user: CurrentUser, session: SessionDep, settings: SettingsDep
) -> list[GitHubRepository]:
    _, available = await _available_repositories(user, session, settings)
    connected = {
        repository.github_repository_id: repository.id
        for repository in (
            await session.scalars(select(Repository).where(Repository.user_id == user.id))
        ).all()
    }
    return [
        GitHubRepository(
            id=int(repo["id"]),
            owner=str(dict(repo["owner"])["login"]),
            name=str(repo["name"]),
            full_name=str(repo["full_name"]),
            default_branch=str(repo["default_branch"]),
            private=bool(repo["private"]),
            connected_id=connected.get(int(repo["id"])),
        )
        for repo in available
    ]


@router.post("/repositories", response_model=RepositoryResponse, status_code=201)
async def select_repository(
    data: RepositoryConnect,
    user: CurrentUser,
    session: SessionDep,
    settings: SettingsDep,
) -> RepositoryResponse:
    connection, available = await _available_repositories(user, session, settings)
    selected = next((repo for repo in available if repo["id"] == data.github_repository_id), None)
    if not selected:
        raise HTTPException(
            status_code=404, detail="Repository is not authorized for this installation"
        )
    existing = await session.scalar(
        select(Repository).where(
            Repository.user_id == user.id,
            Repository.github_repository_id == data.github_repository_id,
        )
    )
    if existing:
        return RepositoryResponse.model_validate(existing)
    repo = Repository(
        user_id=user.id,
        github_repository_id=int(selected["id"]),
        owner=str(dict(selected["owner"])["login"]),
        name=str(selected["name"]),
        full_name=str(selected["full_name"]),
        default_branch=str(selected["default_branch"]),
        is_private=bool(selected["private"]),
        installation_id=connection.github_installation_id,
    )
    session.add(repo)
    await session.commit()
    await session.refresh(repo)
    return RepositoryResponse.model_validate(repo)


@router.delete("/disconnect", response_model=Message)
async def disconnect(user: CurrentUser, session: SessionDep) -> Message:
    await session.execute(delete(GitHubConnection).where(GitHubConnection.user_id == user.id))
    user.github_user_id = None
    user.github_username = None
    user.github_avatar_url = None
    await session.commit()
    return Message(message="GitHub disconnected")
