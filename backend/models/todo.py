from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone

class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: Optional[str] = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: str = Field(index=True)  # Reference to external auth user (Better Auth sub)

    class Config:
        arbitrary_types_allowed = True
