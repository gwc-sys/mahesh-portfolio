import json

from fastapi import APIRouter, Header, HTTPException, Request

from app.api.dependencies import SessionDep, SettingsDep
from app.core.security import payload_digest, verify_github_signature
from app.services.webhook_service import process_webhook

router = APIRouter(tags=["webhooks"])


@router.post("/api/webhooks/github")
async def github_webhook(
    request: Request,
    session: SessionDep,
    settings: SettingsDep,
    signature: str | None = Header(default=None, alias="X-Hub-Signature-256"),
    event_name: str | None = Header(default=None, alias="X-GitHub-Event"),
    delivery_id: str | None = Header(default=None, alias="X-GitHub-Delivery"),
) -> dict[str, object]:
    raw_body = await request.body()
    if not verify_github_signature(raw_body, signature, settings.github_webhook_secret):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    if not event_name or not delivery_id:
        raise HTTPException(status_code=400, detail="Missing GitHub event headers")
    try:
        payload = json.loads(raw_body)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid JSON payload") from exc
    duplicate, result = await process_webhook(
        session, delivery_id, event_name, payload_digest(raw_body), payload, settings
    )
    return {"accepted": True, "duplicate": duplicate, "result": result}
