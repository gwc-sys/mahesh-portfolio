from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: Literal["development", "test", "production"] = "development"
    app_name: str = "GitHub Task Tracker"
    api_v1_prefix: str = "/api/v1"
    host: str = "0.0.0.0"  # noqa: S104 - intentionally configurable server bind address
    port: int = 8000
    database_url: str = "postgresql+psycopg://postgres:password@localhost:5432/github_task_tracker"
    jwt_secret: str = Field(default="development-secret-change-me-1234567890", min_length=32)
    jwt_algorithm: str = "HS256"
    jwt_access_token_minutes: int = Field(default=15, ge=1, le=1440)
    cookie_name: str = "task_tracker_session"
    cookie_domain: str | None = None
    encryption_key: str = ""
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"
    allowed_origins: list[str] = ["http://localhost:5173"]
    github_app_id: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    github_private_key: str = ""
    github_webhook_secret: str = ""
    github_callback_url: str = "http://localhost:8000/api/v1/github/callback"

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def secure_cookies(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
