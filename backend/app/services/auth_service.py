from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password
from app.models import User
from app.schemas.auth import RegisterRequest


async def register_user(session: AsyncSession, data: RegisterRequest) -> User:
    email = data.email.lower()
    existing = await session.scalar(select(User.id).where(User.email == email))
    if existing:
        raise ValueError("An account with this email already exists")
    user = User(name=data.name.strip(), email=email, password_hash=hash_password(data.password))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> User | None:
    user = await session.scalar(select(User).where(User.email == email.lower()))
    if not user or not verify_password(password, user.password_hash):
        return None
    return user
