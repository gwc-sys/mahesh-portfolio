import uuid
from datetime import date, datetime
from enum import StrEnum
from typing import Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Sequence,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TaskType(StrEnum):
    CODING = "CODING"
    BUG_FIX = "BUG_FIX"
    DOCUMENTATION = "DOCUMENTATION"
    DESIGN = "DESIGN"
    RESEARCH = "RESEARCH"
    PERSONAL = "PERSONAL"


class TaskStatus(StrEnum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    VERIFYING = "VERIFYING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class VerificationMode(StrEnum):
    PUSH = "PUSH"
    MERGED_PULL_REQUEST = "MERGED_PULL_REQUEST"
    MERGED_PULL_REQUEST_WITH_TESTS = "MERGED_PULL_REQUEST_WITH_TESTS"
    MANUAL = "MANUAL"


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(Text)
    github_user_id: Mapped[int | None] = mapped_column(BigInteger, unique=True)
    github_username: Mapped[str | None] = mapped_column(String(100))
    github_avatar_url: Mapped[str | None] = mapped_column(Text)

    tasks: Mapped[list["Task"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    repositories: Mapped[list["Repository"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    github_connection: Mapped["GitHubConnection | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )


class GitHubConnection(TimestampMixin, Base):
    __tablename__ = "github_connections"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True
    )
    github_installation_id: Mapped[int] = mapped_column(BigInteger, unique=True)
    github_user_id: Mapped[int] = mapped_column(BigInteger, index=True)
    github_username: Mapped[str] = mapped_column(String(100))
    access_token_encrypted: Mapped[str] = mapped_column(Text)
    refresh_token_encrypted: Mapped[str | None] = mapped_column(Text)
    token_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped[User] = relationship(back_populates="github_connection")


class Repository(TimestampMixin, Base):
    __tablename__ = "repositories"
    __table_args__ = (
        UniqueConstraint("user_id", "github_repository_id", name="uq_repository_user_github_id"),
        UniqueConstraint("user_id", "full_name", name="uq_repository_user_full_name"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    github_repository_id: Mapped[int] = mapped_column(BigInteger)
    owner: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(100))
    full_name: Mapped[str] = mapped_column(String(255), index=True)
    default_branch: Mapped[str] = mapped_column(String(255), default="main")
    is_private: Mapped[bool] = mapped_column(Boolean, default=False)
    installation_id: Mapped[int] = mapped_column(BigInteger)

    user: Mapped[User] = relationship(back_populates="repositories")
    tasks: Mapped[list["Task"]] = relationship(back_populates="repository")


task_code_sequence = Sequence("task_code_seq", start=1)


class Task(TimestampMixin, Base):
    __tablename__ = "tasks"
    __table_args__ = (Index("ix_tasks_user_date", "user_id", "task_date"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_number: Mapped[int] = mapped_column(
        Integer, task_code_sequence, server_default=task_code_sequence.next_value(), unique=True
    )
    task_code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    task_type: Mapped[TaskType] = mapped_column(Enum(TaskType, name="task_type"))
    task_date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status"), default=TaskStatus.PENDING, index=True
    )
    verification_mode: Mapped[VerificationMode] = mapped_column(
        Enum(VerificationMode, name="verification_mode")
    )
    repository_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("repositories.id", ondelete="RESTRICT")
    )
    required_branch: Mapped[str | None] = mapped_column(String(255))
    commit_sha: Mapped[str | None] = mapped_column(String(64))
    commit_url: Mapped[str | None] = mapped_column(Text)
    pull_request_number: Mapped[int | None] = mapped_column(Integer)
    pull_request_url: Mapped[str | None] = mapped_column(Text)
    github_author_id: Mapped[int | None] = mapped_column(BigInteger)
    tests_passed: Mapped[bool | None] = mapped_column(Boolean)
    verification_message: Mapped[str | None] = mapped_column(Text)
    completion_source: Mapped[str | None] = mapped_column(String(32))
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    user: Mapped[User] = relationship(back_populates="tasks")
    repository: Mapped[Repository | None] = relationship(back_populates="tasks")
    verification_attempts: Mapped[list["VerificationAttempt"]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )


class GitHubDelivery(Base):
    __tablename__ = "github_deliveries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    delivery_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    event_name: Mapped[str] = mapped_column(String(100))
    action: Mapped[str | None] = mapped_column(String(100))
    repository_full_name: Mapped[str | None] = mapped_column(String(255))
    payload_hash: Mapped[str] = mapped_column(String(64))
    processed: Mapped[bool] = mapped_column(Boolean, default=False)
    processing_result: Mapped[str | None] = mapped_column(Text)
    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class VerificationAttempt(Base):
    __tablename__ = "verification_attempts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), index=True
    )
    event_name: Mapped[str] = mapped_column(String(100))
    commit_sha: Mapped[str | None] = mapped_column(String(64))
    pull_request_number: Mapped[int | None] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(32))
    reason: Mapped[str] = mapped_column(Text)
    metadata_: Mapped[dict[str, Any]] = mapped_column("metadata", JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    task: Mapped[Task] = relationship(back_populates="verification_attempts")
