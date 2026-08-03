from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models import TaskStatus, TaskType, VerificationMode


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(default="", max_length=5000)
    task_type: TaskType
    task_date: date
    verification_mode: VerificationMode | None = None
    repository_id: UUID | None = None
    required_branch: str | None = Field(default=None, max_length=255)

    @model_validator(mode="after")
    def validate_verification(self) -> "TaskCreate":
        coding = self.task_type in {TaskType.CODING, TaskType.BUG_FIX}
        mode = self.verification_mode or (
            VerificationMode.MERGED_PULL_REQUEST_WITH_TESTS if coding else VerificationMode.MANUAL
        )
        self.verification_mode = mode
        if coding and mode == VerificationMode.MANUAL:
            raise ValueError("Coding tasks cannot use manual verification")
        if mode != VerificationMode.MANUAL and not self.repository_id:
            raise ValueError("A repository is required for GitHub verification")
        return self


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=5000)
    task_date: date | None = None
    repository_id: UUID | None = None
    required_branch: str | None = Field(default=None, max_length=255)
    verification_mode: VerificationMode | None = None


class RepositorySummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    full_name: str
    default_branch: str


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    task_code: str
    title: str
    description: str
    task_type: TaskType
    task_date: date
    status: TaskStatus
    verification_mode: VerificationMode
    repository_id: UUID | None
    required_branch: str | None
    commit_sha: str | None
    commit_url: str | None
    pull_request_number: int | None
    pull_request_url: str | None
    tests_passed: bool | None
    verification_message: str | None
    completion_source: str | None
    verified_at: datetime | None
    completed_at: datetime | None
    created_at: datetime
    repository: RepositorySummary | None
