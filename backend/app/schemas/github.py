from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class GitHubStatus(BaseModel):
    connected: bool
    username: str | None = None
    installation_id: int | None = None


class GitHubRepository(BaseModel):
    id: int
    owner: str
    name: str
    full_name: str
    default_branch: str
    private: bool
    connected_id: UUID | None = None


class RepositoryConnect(BaseModel):
    github_repository_id: int


class RepositoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    github_repository_id: int
    owner: str
    name: str
    full_name: str
    default_branch: str
    is_private: bool
    installation_id: int
    created_at: datetime
