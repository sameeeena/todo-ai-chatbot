# Database Models Specification: Todo AI Chatbot

This document defines the data layer for the Todo AI Chatbot using **SQLModel** (SQLAlchemy + Pydantic) for a **PostgreSQL** backend.

---

## 1. Conversation Model
**Purpose:** Represents a single chat session between a user and the AI. It groups messages together to maintain context.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Unique identifier for the session. |
| `user_id` | `String` | Foreign key or identifier for the user. |
| `created_at` | `DateTime` | Timestamp when the session started. |
| `updated_at` | `DateTime` | Timestamp of the last interaction. |

### Relationships
- **Messages:** One-to-Many (`Conversation` -> `Message`).

### Indexing Considerations
- Index on `user_id` for fast retrieval of a user's chat history.
- Index on `updated_at` for sorting sessions by recency.

---

## 2. Message Model
**Purpose:** Stores individual turns in a conversation (both User and Assistant).

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `Integer` (PK) | Auto-incrementing ID. |
| `conversation_id` | `UUID` (FK) | Reference to the `Conversation`. |
| `role` | `String` | "user", "assistant", or "system". |
| `content` | `Text` | The actual message text. |
| `created_at` | `DateTime` | Timestamp of the message. |

### Relationships
- **Conversation:** Many-to-One (`Message` -> `Conversation`).

### Indexing Considerations
- Composite index on `(conversation_id, created_at)` to allow rapid fetching of a session's history in chronological order.

---

## 3. Task Model
**Purpose:** Represents the actual todo items managed by the user via the chatbot or UI.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Unique identifier for the task. |
| `user_id` | `String` | Owner of the task. |
| `title` | `String` | Task description. |
| `priority` | `String` | "low", "medium", "high", etc. |
| `status` | `String` | "pending" or "completed". |
| `due_date` | `Date` | Optional deadline. |
| `created_at` | `DateTime` | Record creation time. |

### Indexing Considerations
- Index on `user_id` is critical for performance.
- Index on `status` to filter pending vs. completed tasks quickly.
- Index on `due_date` for deadline-based queries.

---

## 4. SQLModel Implementation Snippet

```python
from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from sqlmodel import Field, Relationship, SQLModel

class Conversation(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    messages: List["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str # "user" | "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    conversation_id: UUID = Field(foreign_key="conversation.id", index=True)
    conversation: Conversation = Relationship(back_populates="messages")

class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    priority: str = "medium"
    status: str = "pending"
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
```
