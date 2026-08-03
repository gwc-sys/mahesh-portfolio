from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.api.dependencies import CurrentUser, SessionDep, SettingsDep, auth_rate_limit
from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, RegisterRequest, UserResponse
from app.schemas.common import Message
from app.services.auth_service import authenticate_user, register_user

router = APIRouter(prefix="/auth", tags=["authentication"])


def set_auth_cookie(response: Response, token: str, settings: SettingsDep) -> None:
    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        max_age=settings.jwt_access_token_minutes * 60,
        secure=settings.secure_cookies,
        httponly=True,
        samesite="lax",
        domain=settings.cookie_domain,
        path="/",
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(auth_rate_limit)],
)
async def register(
    data: RegisterRequest, response: Response, session: SessionDep, settings: SettingsDep
) -> UserResponse:
    try:
        user = await register_user(session, data)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    set_auth_cookie(response, create_access_token(user.id, settings), settings)
    return UserResponse.model_validate(user)


@router.post("/login", response_model=UserResponse, dependencies=[Depends(auth_rate_limit)])
async def login(
    data: LoginRequest, response: Response, session: SessionDep, settings: SettingsDep
) -> UserResponse:
    user = await authenticate_user(session, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    set_auth_cookie(response, create_access_token(user.id, settings), settings)
    return UserResponse.model_validate(user)


@router.post("/logout", response_model=Message)
async def logout(response: Response, settings: SettingsDep) -> Message:
    response.delete_cookie(
        settings.cookie_name,
        domain=settings.cookie_domain,
        path="/",
        secure=settings.secure_cookies,
        httponly=True,
        samesite="lax",
    )
    return Message(message="Logged out")


@router.get("/me", response_model=UserResponse)
async def me(user: CurrentUser) -> UserResponse:
    return UserResponse.model_validate(user)
