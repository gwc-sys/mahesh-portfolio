import re
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.security import decrypt_secret
from app.models import (
    GitHubConnection,
    Repository,
    Task,
    TaskStatus,
    VerificationAttempt,
    VerificationMode,
)
from app.services.github_service import commit_has_changes, pull_request_evidence

TASK_CODE_PATTERN = re.compile(r"(?<![A-Z0-9])TASK-\d{4,}(?![A-Z0-9])", re.IGNORECASE)


@dataclass
class Evidence:
    event_name: str
    code: str
    repository: str
    actor_id: int
    occurred_at: datetime
    branch: str
    sha: str
    commit_url: str | None = None
    pr_number: int | None = None
    pr_url: str | None = None
    merged: bool = False


def task_codes(*values: str | None) -> set[str]:
    return {
        match.upper() for value in values if value for match in TASK_CODE_PATTERN.findall(value)
    }


def parse_evidence(event: str, payload: dict[str, Any]) -> list[Evidence]:
    repository = payload.get("repository", {}).get("full_name", "")
    sender = int(payload.get("sender", {}).get("id", 0))
    if event == "push":
        branch = str(payload.get("ref", "")).removeprefix("refs/heads/")
        occurred = datetime.fromisoformat(
            payload["head_commit"]["timestamp"].replace("Z", "+00:00")
        )
        codes = task_codes(
            branch, *(commit.get("message") for commit in payload.get("commits", []))
        )
        return [
            Evidence(
                event,
                code,
                repository,
                sender,
                occurred,
                branch,
                payload.get("after", ""),
                payload.get("head_commit", {}).get("url"),
            )
            for code in codes
        ]
    if event == "pull_request":
        pr = payload.get("pull_request", {})
        merged_at = pr.get("merged_at") or pr.get("updated_at")
        occurred = datetime.fromisoformat(str(merged_at).replace("Z", "+00:00"))
        codes = task_codes(pr.get("title"), pr.get("body"), pr.get("head", {}).get("ref"))
        return [
            Evidence(
                event,
                code,
                repository,
                sender,
                occurred,
                pr.get("base", {}).get("ref", ""),
                pr.get("merge_commit_sha") or pr.get("head", {}).get("sha", ""),
                pr_url=pr.get("html_url"),
                pr_number=pr.get("number"),
                merged=bool(pr.get("merged")),
            )
            for code in codes
        ]
    return []


async def _record(
    session: AsyncSession,
    task: Task,
    evidence: Evidence,
    status: str,
    reason: str,
    metadata: dict[str, Any],
) -> None:
    session.add(
        VerificationAttempt(
            task_id=task.id,
            event_name=evidence.event_name,
            commit_sha=evidence.sha or None,
            pull_request_number=evidence.pr_number,
            status=status,
            reason=reason,
            metadata_=metadata,
        )
    )


async def verify_evidence(session: AsyncSession, evidence: Evidence, settings: Settings) -> str:
    task = await session.scalar(select(Task).where(Task.task_code == evidence.code))
    if not task:
        return f"{evidence.code}: task not found"
    repository = await session.get(Repository, task.repository_id) if task.repository_id else None
    connection = await session.scalar(
        select(GitHubConnection).where(GitHubConnection.user_id == task.user_id)
    )
    reason: str | None = None
    if task.status == TaskStatus.COMPLETED:
        reason = "Task is already completed"
    elif not repository or repository.full_name.lower() != evidence.repository.lower():
        reason = "Repository does not match the selected task repository"
    elif not connection or connection.github_user_id != evidence.actor_id:
        reason = "GitHub actor does not match the connected account"
    elif evidence.occurred_at < task.created_at:
        reason = "GitHub event predates task creation"
    elif task.required_branch and evidence.branch != task.required_branch:
        reason = "Branch does not match the required branch"
    elif task.verification_mode != VerificationMode.PUSH and evidence.event_name != "pull_request":
        reason = "This task requires a merged pull request"
    elif (
        task.verification_mode
        in {
            VerificationMode.MERGED_PULL_REQUEST,
            VerificationMode.MERGED_PULL_REQUEST_WITH_TESTS,
        }
        and not evidence.merged
    ):
        reason = "Pull request is not merged"

    if reason:
        task.status = TaskStatus.FAILED
        task.verification_message = reason
        await _record(session, task, evidence, "FAILED", reason, {})
        await session.commit()
        return f"{evidence.code}: {reason}"

    task.status = TaskStatus.VERIFYING
    task.commit_sha = evidence.sha
    task.commit_url = evidence.commit_url
    task.pull_request_number = evidence.pr_number
    task.pull_request_url = evidence.pr_url
    task.github_author_id = evidence.actor_id
    await session.flush()
    assert connection is not None
    token = decrypt_secret(connection.access_token_encrypted, settings)
    files: list[dict[str, Any]]
    checks: list[dict[str, Any]] = []
    if evidence.event_name == "push":
        files = [{}] if await commit_has_changes(token, evidence.repository, evidence.sha) else []
    else:
        files, checks = await pull_request_evidence(
            token, evidence.repository, evidence.pr_number or 0, evidence.sha
        )
    if not files:
        reason = "No changed files were found"
    elif task.verification_mode == VerificationMode.MERGED_PULL_REQUEST_WITH_TESTS:
        if not checks:
            reason = "No required GitHub checks were found"
        elif any(check.get("status") != "completed" for check in checks):
            reason = "Required GitHub checks are still running"
        elif any(
            check.get("conclusion") not in {"success", "neutral", "skipped"} for check in checks
        ):
            reason = "One or more required GitHub checks failed"

    if reason:
        task.status = TaskStatus.FAILED
        task.tests_passed = False if checks else None
        task.verification_message = reason
        await _record(session, task, evidence, "FAILED", reason, {"check_count": len(checks)})
    else:
        now = datetime.now(UTC)
        task.status = TaskStatus.COMPLETED
        task.tests_passed = True if checks else None
        task.verification_message = "Completed — Verified by GitHub."
        task.completion_source = "GITHUB"
        task.verified_at = now
        task.completed_at = now
        await _record(
            session,
            task,
            evidence,
            "COMPLETED",
            task.verification_message,
            {"changed_files": len(files), "checks": len(checks)},
        )
    await session.commit()
    return f"{evidence.code}: {task.verification_message}"
