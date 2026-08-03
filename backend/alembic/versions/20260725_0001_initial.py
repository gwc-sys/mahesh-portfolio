"""Create initial task tracker schema."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260725_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

task_type = postgresql.ENUM(
    "CODING", "BUG_FIX", "DOCUMENTATION", "DESIGN", "RESEARCH", "PERSONAL",
    name="task_type",
    create_type=False,
)
task_status = postgresql.ENUM(
    "PENDING", "IN_PROGRESS", "VERIFYING", "COMPLETED", "FAILED",
    name="task_status",
    create_type=False,
)
verification_mode = postgresql.ENUM(
    "PUSH", "MERGED_PULL_REQUEST", "MERGED_PULL_REQUEST_WITH_TESTS", "MANUAL",
    name="verification_mode",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    task_type.create(bind, checkfirst=True)
    task_status.create(bind, checkfirst=True)
    verification_mode.create(bind, checkfirst=True)
    op.execute("CREATE SEQUENCE task_code_seq START WITH 1")
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column("github_user_id", sa.BigInteger()),
        sa.Column("github_username", sa.String(100)),
        sa.Column("github_avatar_url", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("github_user_id"),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_table(
        "github_connections",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("github_installation_id", sa.BigInteger(), nullable=False, unique=True),
        sa.Column("github_user_id", sa.BigInteger(), nullable=False),
        sa.Column("github_username", sa.String(100), nullable=False),
        sa.Column("access_token_encrypted", sa.Text(), nullable=False),
        sa.Column("refresh_token_encrypted", sa.Text()),
        sa.Column("token_expires_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index("ix_github_connections_user_id", "github_connections", ["user_id"])
    op.create_index("ix_github_connections_github_user_id", "github_connections", ["github_user_id"])
    op.create_table(
        "repositories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("github_repository_id", sa.BigInteger(), nullable=False),
        sa.Column("owner", sa.String(100), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("default_branch", sa.String(255), nullable=False),
        sa.Column("is_private", sa.Boolean(), nullable=False),
        sa.Column("installation_id", sa.BigInteger(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "github_repository_id", name="uq_repository_user_github_id"),
        sa.UniqueConstraint("user_id", "full_name", name="uq_repository_user_full_name"),
    )
    op.create_index("ix_repositories_user_id", "repositories", ["user_id"])
    op.create_index("ix_repositories_full_name", "repositories", ["full_name"])
    op.create_table(
        "tasks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("task_number", sa.Integer(), server_default=sa.text("nextval('task_code_seq')"), nullable=False, unique=True),
        sa.Column("task_code", sa.String(32), nullable=False, unique=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("task_type", task_type, nullable=False),
        sa.Column("task_date", sa.Date(), nullable=False),
        sa.Column("status", task_status, nullable=False),
        sa.Column("verification_mode", verification_mode, nullable=False),
        sa.Column("repository_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("repositories.id", ondelete="RESTRICT")),
        sa.Column("required_branch", sa.String(255)),
        sa.Column("commit_sha", sa.String(64)),
        sa.Column("commit_url", sa.Text()),
        sa.Column("pull_request_number", sa.Integer()),
        sa.Column("pull_request_url", sa.Text()),
        sa.Column("github_author_id", sa.BigInteger()),
        sa.Column("tests_passed", sa.Boolean()),
        sa.Column("verification_message", sa.Text()),
        sa.Column("completion_source", sa.String(32)),
        sa.Column("verified_at", sa.DateTime(timezone=True)),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_tasks_task_code", "tasks", ["task_code"])
    op.create_index("ix_tasks_task_date", "tasks", ["task_date"])
    op.create_index("ix_tasks_status", "tasks", ["status"])
    op.create_index("ix_tasks_user_id", "tasks", ["user_id"])
    op.create_index("ix_tasks_user_date", "tasks", ["user_id", "task_date"])
    op.create_table(
        "github_deliveries",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("delivery_id", sa.String(100), nullable=False, unique=True),
        sa.Column("event_name", sa.String(100), nullable=False),
        sa.Column("action", sa.String(100)),
        sa.Column("repository_full_name", sa.String(255)),
        sa.Column("payload_hash", sa.String(64), nullable=False),
        sa.Column("processed", sa.Boolean(), nullable=False),
        sa.Column("processing_result", sa.Text()),
        sa.Column("received_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("processed_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_github_deliveries_delivery_id", "github_deliveries", ["delivery_id"])
    op.create_table(
        "verification_attempts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("task_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("event_name", sa.String(100), nullable=False),
        sa.Column("commit_sha", sa.String(64)),
        sa.Column("pull_request_number", sa.Integer()),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("metadata", postgresql.JSONB(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_verification_attempts_task_id", "verification_attempts", ["task_id"])


def downgrade() -> None:
    op.drop_table("verification_attempts")
    op.drop_table("github_deliveries")
    op.drop_table("tasks")
    op.drop_table("repositories")
    op.drop_table("github_connections")
    op.drop_table("users")
    op.execute("DROP SEQUENCE task_code_seq")
    verification_mode.drop(op.get_bind(), checkfirst=True)
    task_status.drop(op.get_bind(), checkfirst=True)
    task_type.drop(op.get_bind(), checkfirst=True)
