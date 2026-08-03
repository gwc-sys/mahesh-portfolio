import hashlib
import hmac
import json

import pytest
from httpx import AsyncClient

from app.core.config import get_settings

pytestmark = pytest.mark.usefixtures("clean_database")


def signed_headers(body: bytes, delivery: str = "delivery-1") -> dict[str, str]:
    secret = get_settings().github_webhook_secret
    signature = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return {
        "X-Hub-Signature-256": f"sha256={signature}",
        "X-GitHub-Event": "push",
        "X-GitHub-Delivery": delivery,
        "Content-Type": "application/json",
    }


async def test_invalid_webhook_is_rejected_before_json_parse(client: AsyncClient) -> None:
    response = await client.post(
        "/api/webhooks/github",
        content=b"not json",
        headers={
            "X-Hub-Signature-256": "sha256=invalid",
            "X-GitHub-Event": "push",
            "X-GitHub-Delivery": "invalid",
        },
    )
    assert response.status_code == 401


async def test_duplicate_delivery_is_idempotent(client: AsyncClient) -> None:
    body = json.dumps({"repository": {"full_name": "owner/repo"}}).encode()
    first = await client.post("/api/webhooks/github", content=body, headers=signed_headers(body))
    second = await client.post("/api/webhooks/github", content=body, headers=signed_headers(body))
    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json()["duplicate"] is True
