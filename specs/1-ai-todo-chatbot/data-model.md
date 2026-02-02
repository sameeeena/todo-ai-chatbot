# Data Model: AI-Powered Todo Chatbot

## Entity: Task
**Fields:**
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to user
- description (Text) - Task description
- status (Enum: pending, in_progress, completed, cancelled) - Current status
- priority (Enum: low, medium, high, urgent) - Priority level
- due_date (DateTime, optional) - Deadline for completion
- created_at (DateTime) - Creation timestamp
- updated_at (DateTime) - Last update timestamp
- completed_at (DateTime, optional) - Completion timestamp

**Validation Rules:**
- user_id must reference valid user
- description must not be empty
- status must be one of allowed values
- priority must be one of allowed values
- due_date must be in the future if provided

**State Transitions:**
- pending → in_progress → completed
- pending → cancelled
- in_progress → pending
- in_progress → completed
- in_progress → cancelled

## Entity: Conversation
**Fields:**
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to user
- title (String, optional) - Auto-generated title
- created_at (DateTime) - Creation timestamp
- updated_at (DateTime) - Last activity timestamp
- is_active (Boolean) - Active conversation indicator

**Validation Rules:**
- user_id must reference valid user
- title length limited to 200 characters if provided

## Entity: Message
**Fields:**
- id (UUID) - Primary key
- conversation_id (UUID) - Foreign key to conversation
- sender_type (Enum: user, agent) - Sender classification
- content (Text) - Message content
- timestamp (DateTime) - Send timestamp
- metadata (JSON, optional) - Additional metadata

**Validation Rules:**
- conversation_id must reference valid conversation
- sender_type must be user or agent
- content must not be empty
- metadata must be valid JSON if provided

## Relationships:
- User (1) → Conversation (*): One user can have many conversations
- Conversation (1) → Message (*): One conversation can have many messages
- User (1) → Task (*): One user can have many tasks