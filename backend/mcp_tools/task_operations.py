from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime
import uuid

from models.task import Task, TaskStatus, TaskPriority

def add_task(session: Session, user_id: str, title: str, description: Optional[str] = None,
             priority: TaskPriority = TaskPriority.medium, due_date: Optional[datetime] = None) -> Task:
    task = Task(
        user_id=user_id,
        title=title,
        description=description,
        priority=priority,
        due_date=due_date
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def list_tasks(session: Session, user_id: str, status: Optional[TaskStatus] = None) -> List[Task]:
    query = select(Task).where(Task.user_id == user_id)
    if status:
        query = query.where(Task.status == status)
    query = query.order_by(Task.created_at.desc())
    return session.exec(query).all()

def update_task(session: Session, user_id: str, task_id: str, title: Optional[str] = None,
                description: Optional[str] = None, status: Optional[TaskStatus] = None,
                priority: Optional[TaskPriority] = None) -> Optional[Task]:
    try:
        uuid_id = uuid.UUID(task_id) if isinstance(task_id, str) else task_id
    except:
        return None
    
    task = session.exec(
        select(Task).where(Task.id == uuid_id).where(Task.user_id == user_id)
    ).first()
    
    if not task:
        return None
    
    if title: task.title = title
    if description: task.description = description
    if status: task.status = status
    if priority: task.priority = priority
    
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def complete_task(session: Session, user_id: str, task_id: str) -> Optional[Task]:
    try:
        uuid_id = uuid.UUID(task_id) if isinstance(task_id, str) else task_id
    except:
        return None
    
    task = session.exec(
        select(Task).where(Task.id == uuid_id).where(Task.user_id == user_id)
    ).first()
    
    if not task:
        return None
        
    task.status = TaskStatus.completed
    task.completed_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def delete_task(session: Session, user_id: str, task_id: str) -> bool:
    try:
        uuid_id = uuid.UUID(task_id) if isinstance(task_id, str) else task_id
    except:
        return False
        
    task = session.exec(
        select(Task).where(Task.id == uuid_id).where(Task.user_id == user_id)
    ).first()
    
    if not task:
        return False
        
    session.delete(task)
    session.commit()
    return True
