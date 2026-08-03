from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest

from app.core.config import Settings
from app.core.security import encrypt_secret
from app.models import TaskStatus, VerificationMode
from app.services import verification_service
from app.services.verification_service import Evidence, verify_evidence


def test_settings() -> Settings:
    return Settings(
        app_env="test",
        jwt_secret="test-secret-that-is-longer-than-thirty-two-characters",
    )


def objects() -> tuple[SimpleNamespace, SimpleNamespace, SimpleNamespace, Evidence]:
    user_id = uuid4()
    task = SimpleNamespace(
        id=uuid4(),
        task_code="TASK-0001",
        repository_id=uuid4(),
        user_id=user_id,
        status=TaskStatus.IN_PROGRESS,
        verification_mode=VerificationMode.MERGED_PULL_REQUEST_WITH_TESTS,
        required_branch="main",
        created_at=datetime.now(UTC) - timedelta(hours=1),
        commit_sha=None,
        commit_url=None,
        pull_request_number=None,
        pull_request_url=None,
        github_author_id=None,
        tests_passed=None,
        verification_message=None,
        completion_source=None,
        verified_at=None,
        completed_at=None,
    )
    repository = SimpleNamespace(full_name="owner/repo")
    connection = SimpleNamespace(
        github_user_id=42,
        access_token_encrypted=encrypt_secret("token", test_settings()),
    )
    evidence = Evidence(
        event_name="pull_request",
        code="TASK-0001",
        repository="owner/repo",
        actor_id=42,
        occurred_at=datetime.now(UTC),
        branch="main",
        sha="abc123",
        pr_number=7,
        pr_url="https://github.test/pull/7",
        merged=True,
    )
    return task, repository, connection, evidence


def session_for(
    task: SimpleNamespace, repository: SimpleNamespace, connection: SimpleNamespace
) -> MagicMock:
    session = MagicMock()
    session.scalar = AsyncMock(side_effect=[task, connection])
    session.get = AsyncMock(return_value=repository)
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    return session


async def test_wrong_repository_is_rejected() -> None:
    task, repository, connection, evidence = objects()
    evidence.repository = "attacker/repo"
    session = session_for(task, repository, connection)

    await verify_evidence(session, evidence, test_settings())

    assert task.status == TaskStatus.FAILED
    assert "Repository does not match" in task.verification_message


async def test_wrong_github_user_is_rejected() -> None:
    task, repository, connection, evidence = objects()
    evidence.actor_id = 999
    session = session_for(task, repository, connection)

    await verify_evidence(session, evidence, test_settings())

    assert task.status == TaskStatus.FAILED
    assert "actor does not match" in task.verification_message


async def test_failed_checks_do_not_complete_task(monkeypatch: pytest.MonkeyPatch) -> None:
    task, repository, connection, evidence = objects()
    session = session_for(task, repository, connection)
    monkeypatch.setattr(
        verification_service,
        "pull_request_evidence",
        AsyncMock(
            return_value=(
                [{"filename": "app.py"}],
                [{"status": "completed", "conclusion": "failure"}],
            )
        ),
    )

    await verify_evidence(session, evidence, test_settings())

    assert task.status == TaskStatus.FAILED
    assert task.tests_passed is False


async def test_successful_checks_complete_task(monkeypatch: pytest.MonkeyPatch) -> None:
    task, repository, connection, evidence = objects()
    session = session_for(task, repository, connection)
    monkeypatch.setattr(
        verification_service,
        "pull_request_evidence",
        AsyncMock(
            return_value=(
                [{"filename": "app.py"}],
                [{"status": "completed", "conclusion": "success"}],
            )
        ),
    )

    await verify_evidence(session, evidence, test_settings())

    assert task.status == TaskStatus.COMPLETED
    assert task.tests_passed is True
    assert task.completion_source == "GITHUB"
    assert task.commit_sha == "abc123"
