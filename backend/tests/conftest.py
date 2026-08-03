import os
from collections.abc import AsyncIterator, Callable, Coroutine
from typing import Any
from uuid import uuid4

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text

from app.core.database import AsyncSessionFactory, engine
from app.main import app


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as test_client:
        yield test_client


@pytest.fixture
def postgres_required() -> None:
    if os.getenv("RUN_POSTGRES_TESTS") != "1":
        pytest.skip("Set RUN_POSTGRES_TESTS=1 with an isolated migrated PostgreSQL database")


@pytest.fixture
async def clean_database(postgres_required: None) -> AsyncIterator[None]:
    async with engine.begin() as connection:
        await connection.execute(
            text(
                "TRUNCATE verification_attempts, github_deliveries, tasks, repositories, "
                "github_connections, users RESTART IDENTITY CASCADE"
            )
        )
        await connection.execute(text("ALTER SEQUENCE task_code_seq RESTART WITH 1"))
    yield


@pytest.fixture
def register_user(
    client: AsyncClient,
) -> Callable[..., Coroutine[Any, Any, dict[str, Any]]]:
    async def register(**overrides: str) -> dict[str, Any]:
        data = {
            "name": "Test User",
            "email": f"{uuid4()}@example.com",
            "password": "correct-horse-battery-staple",
            **overrides,
        }
        response = await client.post("/api/v1/auth/register", json=data)
        assert response.status_code == 201, response.text
        return response.json()

    return register


@pytest.fixture
def database_session_factory() -> type:
    return AsyncSessionFactory
