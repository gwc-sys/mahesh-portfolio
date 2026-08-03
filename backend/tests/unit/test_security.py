import hashlib
import hmac
from uuid import uuid4

import jwt

from app.core.config import Settings
from app.core.security import (
    create_access_token,
    decrypt_secret,
    encrypt_secret,
    hash_password,
    verify_github_signature,
    verify_password,
)


def settings() -> Settings:
    return Settings(
        app_env="test",
        jwt_secret="test-secret-that-is-longer-than-thirty-two-characters",
    )


def test_argon2_password_round_trip() -> None:
    password_hash = hash_password("a strong password")
    assert password_hash != "a strong password"
    assert verify_password("a strong password", password_hash)
    assert not verify_password("wrong password", password_hash)


def test_jwt_contains_user_subject() -> None:
    user_id = uuid4()
    token = create_access_token(user_id, settings())
    payload = jwt.decode(token, settings().jwt_secret, algorithms=["HS256"])
    assert payload["sub"] == str(user_id)
    assert payload["type"] == "access"


def test_encrypted_tokens_are_not_plaintext() -> None:
    encrypted = encrypt_secret("github-secret-token", settings())
    assert encrypted != "github-secret-token"
    assert decrypt_secret(encrypted, settings()) == "github-secret-token"


def test_github_signature_validation() -> None:
    body = b'{"zen":"secure"}'
    digest = hmac.new(b"webhook-secret", body, hashlib.sha256).hexdigest()
    assert verify_github_signature(body, f"sha256={digest}", "webhook-secret")
    assert not verify_github_signature(body, "sha256=bad", "webhook-secret")
    assert not verify_github_signature(body, None, "webhook-secret")
