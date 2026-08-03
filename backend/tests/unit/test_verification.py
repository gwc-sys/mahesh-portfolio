from datetime import UTC, datetime

from app.services.verification_service import parse_evidence, task_codes


def test_detects_task_codes_in_supported_text() -> None:
    assert task_codes("feature/TASK-0102-login", "Completes task-0007") == {
        "TASK-0102",
        "TASK-0007",
    }


def test_missing_task_code_returns_empty_set() -> None:
    assert task_codes("ordinary commit message", None) == set()


def test_parses_push_evidence_without_using_commit_email() -> None:
    now = datetime.now(UTC).isoformat()
    evidence = parse_evidence(
        "push",
        {
            "ref": "refs/heads/feature/TASK-0001",
            "after": "abc123",
            "sender": {"id": 42},
            "repository": {"full_name": "owner/repo"},
            "commits": [{"message": "TASK-0001 implement endpoint"}],
            "head_commit": {"timestamp": now, "url": "https://github.test/commit/abc123"},
        },
    )
    assert len(evidence) == 1
    assert evidence[0].actor_id == 42
    assert evidence[0].repository == "owner/repo"
    assert evidence[0].branch == "feature/TASK-0001"


def test_parses_merged_pull_request_evidence() -> None:
    evidence = parse_evidence(
        "pull_request",
        {
            "sender": {"id": 42},
            "repository": {"full_name": "owner/repo"},
            "pull_request": {
                "number": 8,
                "title": "TASK-0008 secure cookies",
                "body": "",
                "merged": True,
                "merged_at": "2026-07-25T12:00:00Z",
                "merge_commit_sha": "def456",
                "html_url": "https://github.test/pull/8",
                "head": {"ref": "feature/task-0008", "sha": "headsha"},
                "base": {"ref": "main"},
            },
        },
    )
    assert evidence[0].merged
    assert evidence[0].branch == "main"
    assert evidence[0].pr_number == 8
