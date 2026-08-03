from typing import Any
from urllib.parse import urlencode

import httpx

from app.core.config import Settings

GITHUB_API = "https://api.github.com"


class GitHubClient:
    def __init__(self, token: str | None = None) -> None:
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "github-task-tracker",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self.client = httpx.AsyncClient(
            base_url=GITHUB_API,
            headers=headers,
            timeout=httpx.Timeout(10.0, connect=5.0),
        )

    async def __aenter__(self) -> "GitHubClient":
        return self

    async def __aexit__(self, *_: object) -> None:
        await self.client.aclose()

    async def get(self, path: str) -> Any:
        response = await self.client.get(path)
        response.raise_for_status()
        return response.json()


def authorization_url(settings: Settings, state: str) -> str:
    query = urlencode(
        {
            "client_id": settings.github_client_id,
            "redirect_uri": settings.github_callback_url,
            "state": state,
        }
    )
    return f"https://github.com/login/oauth/authorize?{query}"


async def exchange_code(settings: Settings, code: str) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
                "redirect_uri": settings.github_callback_url,
            },
        )
        response.raise_for_status()
        data: dict[str, Any] = response.json()
        if "access_token" not in data:
            raise ValueError("GitHub authorization did not return an access token")
        return data


async def user_and_installation(token: str) -> tuple[dict[str, Any], dict[str, Any]]:
    async with GitHubClient(token) as github:
        user = await github.get("/user")
        installations = await github.get("/user/installations?per_page=100")
    available = installations.get("installations", [])
    if not available:
        raise ValueError("Install the GitHub App on at least one repository")
    return user, available[0]


async def installation_repositories(token: str, installation_id: int) -> list[dict[str, Any]]:
    async with GitHubClient(token) as github:
        data = await github.get(f"/user/installations/{installation_id}/repositories?per_page=100")
    return list(data.get("repositories", []))


async def pull_request_evidence(
    token: str, full_name: str, number: int, sha: str
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    async with GitHubClient(token) as github:
        files = await github.get(f"/repos/{full_name}/pulls/{number}/files?per_page=100")
        checks = await github.get(f"/repos/{full_name}/commits/{sha}/check-runs?per_page=100")
    return list(files), list(checks.get("check_runs", []))


async def commit_has_changes(token: str, full_name: str, sha: str) -> bool:
    async with GitHubClient(token) as github:
        commit = await github.get(f"/repos/{full_name}/commits/{sha}")
    return bool(commit.get("files"))
