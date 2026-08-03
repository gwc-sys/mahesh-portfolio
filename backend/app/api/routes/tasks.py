from datetime import UTC, date, datetime
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Response, status
from sqlalchemy import select

from app.api.dependencies import CurrentUser, SessionDep, SettingsDep
from app.core.security import decrypt_secret
from app.models import GitHubConnection, TaskStatus, TaskType, VerificationMode
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.github_service import GitHubClient
from app.services.task_service import (
    create_task,
    delete_task,
    get_task,
    list_tasks,
    update_task,
)
from app.services.verification_service import parse_evidence, verify_evidence

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create(data: TaskCreate, user: CurrentUser, session: SessionDep) -> TaskResponse:
    try:
        task = await create_task(session, user.id, data)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return TaskResponse.model_validate(task)


@router.get("", response_model=list[TaskResponse])
async def all_tasks(
    user: CurrentUser,
    session: SessionDep,
    task_date: date | None = Query(default=None),
) -> list[TaskResponse]:
    return [
        TaskResponse.model_validate(task) for task in await list_tasks(session, user.id, task_date)
    ]


@router.get("/today", response_model=list[TaskResponse])
async def today(user: CurrentUser, session: SessionDep) -> list[TaskResponse]:
    return [
        TaskResponse.model_validate(task)
        for task in await list_tasks(session, user.id, datetime.now(UTC).date())
    ]


@router.get("/{task_id}", response_model=TaskResponse)
async def one(task_id: UUID, user: CurrentUser, session: SessionDep) -> TaskResponse:
    try:
        return TaskResponse.model_validate(await get_task(session, task_id, user.id))
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.patch("/{task_id}", response_model=TaskResponse)
async def edit(
    task_id: UUID, data: TaskUpdate, user: CurrentUser, session: SessionDep
) -> TaskResponse:
    try:
        task = await get_task(session, task_id, user.id)
        return TaskResponse.model_validate(await update_task(session, task, data, user.id))
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.patch("/{task_id}/start", response_model=TaskResponse)
async def start(task_id: UUID, user: CurrentUser, session: SessionDep) -> TaskResponse:
    try:
        task = await get_task(session, task_id, user.id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    if task.status not in {TaskStatus.PENDING, TaskStatus.FAILED}:
        raise HTTPException(status_code=409, detail="Only pending or failed tasks can be started")
    task.status = TaskStatus.IN_PROGRESS
    task.verification_message = None
    await session.commit()
    return TaskResponse.model_validate(await get_task(session, task.id, user.id))


@router.post("/{task_id}/verify", response_model=TaskResponse)
async def verify(
    task_id: UUID,
    user: CurrentUser,
    session: SessionDep,
    settings: SettingsDep,
) -> TaskResponse:
    try:
        task = await get_task(session, task_id, user.id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    if task.verification_mode == VerificationMode.MANUAL:
        raise HTTPException(status_code=409, detail="Manual tasks do not use GitHub verification")
    if not task.repository:
        raise HTTPException(status_code=409, detail="Task has no repository")
    connection = await session.scalar(
        select(GitHubConnection).where(GitHubConnection.user_id == user.id)
    )
    if not connection:
        raise HTTPException(status_code=409, detail="GitHub is not connected")
    token = decrypt_secret(connection.access_token_encrypted, settings)
    try:
        async with GitHubClient(token) as github:
            query = f'repo:{task.repository.full_name} "{task.task_code}" is:pr'
            result = await github.get(
                f"/search/issues?q={query}&sort=updated&order=desc&per_page=5"
            )
            for item in result.get("items", []):
                pr = await github.get(
                    item["pull_request"]["url"].removeprefix("https://api.github.com")
                )
                payload = {
                    "action": "closed",
                    "sender": {"id": connection.github_user_id},
                    "repository": {"full_name": task.repository.full_name},
                    "pull_request": pr,
                }
                evidence_items = parse_evidence("pull_request", payload)
                evidence = next((e for e in evidence_items if e.code == task.task_code), None)
                if evidence:
                    await verify_evidence(session, evidence, settings)
                    break
            else:
                task.status = TaskStatus.FAILED
                task.verification_message = "No matching pull request was found on GitHub"
                await session.commit()
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail="GitHub verification is temporarily unavailable"
        ) from exc
    return TaskResponse.model_validate(await get_task(session, task.id, user.id))


@router.post("/{task_id}/manual-complete", response_model=TaskResponse)
async def manual_complete(task_id: UUID, user: CurrentUser, session: SessionDep) -> TaskResponse:
    try:
        task = await get_task(session, task_id, user.id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    if (
        task.task_type in {TaskType.CODING, TaskType.BUG_FIX}
        or task.verification_mode != VerificationMode.MANUAL
    ):
        raise HTTPException(status_code=403, detail="This task requires GitHub verification")
    now = datetime.now(UTC)
    task.status = TaskStatus.COMPLETED
    task.completion_source = "MANUAL"
    task.verification_message = "Completed — Manual"
    task.completed_at = now
    await session.commit()
    return TaskResponse.model_validate(await get_task(session, task.id, user.id))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove(task_id: UUID, user: CurrentUser, session: SessionDep) -> Response:
    try:
        task = await get_task(session, task_id, user.id)
        await delete_task(session, task)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)
