import time
from collections import defaultdict, deque
from collections.abc import Callable
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models import User

SessionDep = Annotated[AsyncSession, Depends(get_db)]
SettingsDep = Annotated[Settings, Depends(get_settings)]


async def current_user(
    request: Request,
    settings: SettingsDep,
    session: SessionDep,
) -> User:
    token = request.cookies.get(settings.cookie_name)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        user_id = decode_access_token(token, settings)
    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        ) from None
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user


CurrentUser = Annotated[User, Depends(current_user)]


class InMemoryRateLimiter:
    """Single-process limiter. Use Redis or an API gateway for multi-instance deployments."""

    def __init__(self, limit: int = 10, window_seconds: int = 60) -> None:
        self.limit = limit
        self.window = window_seconds
        self.requests: dict[str, deque[float]] = defaultdict(deque)

    async def __call__(self, request: Request) -> None:
        key = request.client.host if request.client else "unknown"
        now = time.monotonic()
        bucket = self.requests[key]
        while bucket and bucket[0] < now - self.window:
            bucket.popleft()
        if len(bucket) >= self.limit:
            raise HTTPException(status_code=429, detail="Too many requests. Try again shortly.")
        bucket.append(now)


auth_rate_limit: Callable[[Request], object] = InMemoryRateLimiter()
