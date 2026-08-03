from datetime import date
from uuid import UUID

from sqlalchemy import Sequence, delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Repository, Task, TaskStatus, TaskType, VerificationMode
from app.schemas.task import TaskCreate, TaskUpdate


async def owned_repository(
    session: AsyncSession, repository_id: UUID | None, user_id: UUID
) -> Repository | None:
    if repository_id is None:
        return None
    repository = await session.scalar(
        select(Repository).where(Repository.id == repository_id, Repository.user_id == user_id)
    )
    return repository


async def create_task(session: AsyncSession, user_id: UUID, data: TaskCreate) -> Task:
    repository = await owned_repository(session, data.repository_id, user_id)
    if data.repository_id and not repository:
        raise LookupError("Repository not found")
    sequence_value = await session.scalar(select(Sequence("task_code_seq").next_value()))
    if sequence_value is None:
        raise RuntimeError("Unable to generate task code")
    task = Task(
        task_number=sequence_value,
        task_code=f"TASK-{sequence_value:04d}",
        title=data.title.strip(),
        description=data.description.strip(),
        task_type=data.task_type,
        task_date=data.task_date,
        verification_mode=data.verification_mode,
        repository_id=data.repository_id,
        required_branch=data.required_branch or (repository.default_branch if repository else None),
        user_id=user_id,
    )
    session.add(task)
    await session.commit()
    return await get_task(session, task.id, user_id)


async def get_task(session: AsyncSession, task_id: UUID, user_id: UUID) -> Task:
    task = await session.scalar(
        select(Task)
        .options(selectinload(Task.repository))
        .where(Task.id == task_id, Task.user_id == user_id)
    )
    if not task:
        raise LookupError("Task not found")
    return task


async def list_tasks(
    session: AsyncSession, user_id: UUID, task_date: date | None = None
) -> list[Task]:
    query = (
        select(Task)
        .options(selectinload(Task.repository))
        .where(Task.user_id == user_id)
        .order_by(Task.task_date.desc(), Task.created_at.desc())
    )
    if task_date:
        query = query.where(Task.task_date == task_date)
    return list((await session.scalars(query)).all())


async def update_task(session: AsyncSession, task: Task, data: TaskUpdate, user_id: UUID) -> Task:
    if task.status in {TaskStatus.VERIFYING, TaskStatus.COMPLETED}:
        raise ValueError("A verifying or completed task cannot be edited")
    changes = data.model_dump(exclude_unset=True)
    if "repository_id" in changes:
        repository = await owned_repository(session, changes["repository_id"], user_id)
        if changes["repository_id"] and not repository:
            raise LookupError("Repository not found")
    mode = changes.get("verification_mode", task.verification_mode)
    if task.task_type in {TaskType.CODING, TaskType.BUG_FIX} and mode == VerificationMode.MANUAL:
        raise ValueError("Coding tasks cannot use manual verification")
    for field, value in changes.items():
        setattr(task, field, value)
    await session.commit()
    return await get_task(session, task.id, user_id)


async def delete_task(session: AsyncSession, task: Task) -> None:
    if task.status in {TaskStatus.VERIFYING, TaskStatus.COMPLETED}:
        raise ValueError("A verifying or completed task cannot be deleted")
    await session.execute(delete(Task).where(Task.id == task.id))
    await session.commit()
