from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.models import GitHubDelivery, Task, TaskStatus
from app.services.verification_service import Evidence, parse_evidence, verify_evidence


async def _check_event_evidence(
    session: AsyncSession, event_name: str, payload: dict[str, Any]
) -> list[Evidence]:
    check = payload.get("check_run") or payload.get("check_suite") or {}
    suite = check.get("check_suite") or check
    sha = suite.get("head_sha")
    if not sha:
        return []
    tasks = (
        await session.scalars(
            select(Task).where(
                Task.commit_sha == sha,
                Task.status.in_([TaskStatus.FAILED, TaskStatus.VERIFYING]),
            )
        )
    ).all()
    occurred_value = check.get("completed_at") or check.get("updated_at")
    occurred = (
        datetime.fromisoformat(occurred_value.replace("Z", "+00:00"))
        if occurred_value
        else datetime.now(UTC)
    )
    repository = payload.get("repository", {}).get("full_name", "")
    return [
        Evidence(
            event_name="pull_request",
            code=task.task_code,
            repository=repository,
            actor_id=task.github_author_id or 0,
            occurred_at=occurred,
            branch=task.required_branch or "",
            sha=sha,
            commit_url=task.commit_url,
            pr_number=task.pull_request_number,
            pr_url=task.pull_request_url,
            merged=True,
        )
        for task in tasks
    ]


async def process_webhook(
    session: AsyncSession,
    delivery_id: str,
    event_name: str,
    payload_hash: str,
    payload: dict[str, Any],
    settings: Settings,
) -> tuple[bool, str]:
    existing = await session.scalar(
        select(GitHubDelivery).where(GitHubDelivery.delivery_id == delivery_id)
    )
    if existing:
        return True, existing.processing_result or "Duplicate delivery"
    delivery = GitHubDelivery(
        delivery_id=delivery_id,
        event_name=event_name,
        action=payload.get("action"),
        repository_full_name=payload.get("repository", {}).get("full_name"),
        payload_hash=payload_hash,
    )
    session.add(delivery)
    try:
        await session.flush()
    except IntegrityError:
        await session.rollback()
        return True, "Duplicate delivery"
    evidence = (
        await _check_event_evidence(session, event_name, payload)
        if event_name in {"check_run", "check_suite"}
        else parse_evidence(event_name, payload)
    )
    results = [await verify_evidence(session, item, settings) for item in evidence]
    result = "; ".join(results) if results else "No matching task code or supported event"
    delivery.processed = True
    delivery.processing_result = result
    delivery.processed_at = datetime.now(UTC)
    await session.commit()
    return False, result
