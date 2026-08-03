from datetime import UTC, datetime

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.usefixtures("clean_database")


async def test_registration_sets_http_only_cookie(
    client: AsyncClient, register_user: object
) -> None:
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "name": "Mahesh",
            "email": "mahesh@example.com",
            "password": "long-secure-password",
        },
    )
    assert response.status_code == 201
    assert "HttpOnly" in response.headers["set-cookie"]
    assert "task_tracker_session" in response.headers["set-cookie"]


async def test_login_logout_and_protected_endpoint(client: AsyncClient) -> None:
    await client.post(
        "/api/v1/auth/register",
        json={"name": "User", "email": "user@example.com", "password": "secure-password-123"},
    )
    await client.post("/api/v1/auth/logout")
    assert (await client.get("/api/v1/auth/me")).status_code == 401
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "secure-password-123"},
    )
    assert login.status_code == 200
    assert (await client.get("/api/v1/auth/me")).status_code == 200


async def test_invalid_login_is_generic(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "missing@example.com", "password": "wrong"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


async def test_manual_task_creation_and_completion(
    client: AsyncClient, register_user: object
) -> None:
    await register_user()  # type: ignore[operator]
    created = await client.post(
        "/api/v1/tasks",
        json={
            "title": "Read API documentation",
            "description": "Review FastAPI security guidance",
            "task_type": "RESEARCH",
            "task_date": datetime.now(UTC).date().isoformat(),
            "verification_mode": "MANUAL",
        },
    )
    assert created.status_code == 201
    assert created.json()["task_code"] == "TASK-0001"
    completed = await client.post(f"/api/v1/tasks/{created.json()['id']}/manual-complete")
    assert completed.json()["status"] == "COMPLETED"
    assert completed.json()["completion_source"] == "MANUAL"


async def test_coding_task_rejects_manual_completion(
    client: AsyncClient, register_user: object
) -> None:
    await register_user()  # type: ignore[operator]
    response = await client.post(
        "/api/v1/tasks",
        json={
            "title": "Implement login",
            "task_type": "CODING",
            "task_date": datetime.now(UTC).date().isoformat(),
            "verification_mode": "MANUAL",
        },
    )
    assert response.status_code == 422


async def test_task_ownership_is_enforced(client: AsyncClient, register_user: object) -> None:
    await register_user(email="first@example.com")  # type: ignore[operator]
    task = await client.post(
        "/api/v1/tasks",
        json={
            "title": "Private task",
            "task_type": "PERSONAL",
            "task_date": datetime.now(UTC).date().isoformat(),
            "verification_mode": "MANUAL",
        },
    )
    task_id = task.json()["id"]
    await client.post("/api/v1/auth/logout")
    await register_user(email="second@example.com")  # type: ignore[operator]
    assert (await client.get(f"/api/v1/tasks/{task_id}")).status_code == 404
