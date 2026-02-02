# Specification: AI-Powered Todo Chatbot (Phase III)

## 1. System Overview

The AI-Powered Todo Chatbot is a conversational interface that enables users to manage their todo lists through natural language interactions. The system integrates OpenAI's ChatKit for the frontend UI, leverages OpenAI Agents SDK for intelligent processing, and utilizes MCP (Model Context Protocol) SDK for task operations. The backend is built with FastAPI, uses SQLModel for ORM, and stores data in Neon PostgreSQL database with Better Auth for authentication.

The primary purpose is to provide users with an intuitive, natural language interface to create, manage, and track their todo items without requiring traditional form-based interactions.

## 2. Architecture Description

The system follows a layered architecture with clear separation of concerns:

**Client Layer (Frontend)**:
- OpenAI ChatKit provides the conversational UI interface
- Handles user input and displays AI-generated responses
- Manages authentication state and user session

**API Layer (Backend)**:
- FastAPI serves as the web framework handling HTTP requests
- Authentication middleware validates user sessions using Better Auth
- API endpoints process chat requests and route them to the agent layer

**Agent Layer (AI Logic)**:
- OpenAI Agents SDK processes natural language input
- Interprets user intents and determines appropriate actions
- Utilizes MCP tools for database operations

**MCP Tools Layer**:
- MCP SDK provides standardized interfaces for database operations
- Implements CRUD operations for tasks and conversations
- Ensures consistent interaction patterns across all data operations

**Data Layer**:
- Neon PostgreSQL database stores all persistent data
- SQLModel provides ORM capabilities for database interactions
- Contains models for Tasks, Conversations, and Messages

The data flow follows this pattern: ChatKit → API → Agent → MCP Tools → Database

## 3. Agent Behavior Rules

The AI agent must adhere to the following behavioral guidelines:

- **Intent Recognition**: Accurately interpret user intentions from natural language input, including adding, listing, updating, completing, and deleting tasks
- **Context Awareness**: Maintain conversation context across multiple exchanges to support follow-up questions and references
- **Natural Interaction**: Respond in a conversational, human-like manner that feels natural to the user
- **Error Recovery**: Gracefully handle ambiguous or malformed requests by seeking clarification from the user
- **Task Specificity**: When performing updates or deletions, confirm specific task identification when multiple potential matches exist
- **State Management**: Track conversation state to enable multi-turn interactions for complex operations
- **Security Compliance**: Respect user authentication boundaries and prevent access to other users' data

## 4. MCP Tools Definitions

The system implements the following MCP tools for database operations:

**Add Task Tool**:
- Purpose: Creates a new task in the user's todo list
- Parameters: task_description (string), priority (optional enum), due_date (optional date)
- Returns: Created task ID and confirmation message
- Error Handling: Validates input format and user permissions

**List Tasks Tool**:
- Purpose: Retrieves tasks based on filters (all, pending, completed, by date range)
- Parameters: filter_type (enum), date_range (optional), limit (optional)
- Returns: Array of task objects with ID, description, status, priority, and due date
- Error Handling: Validates filter parameters and user permissions

**Update Task Tool**:
- Purpose: Modifies existing task properties (description, status, priority, due date)
- Parameters: task_id (required), updates (object with fields to update)
- Returns: Updated task object and confirmation message
- Error Handling: Validates task existence and user ownership

**Complete Task Tool**:
- Purpose: Marks a task as completed
- Parameters: task_id (required)
- Returns: Confirmation of completion and updated task status
- Error Handling: Validates task existence and user ownership

**Delete Task Tool**:
- Purpose: Removes a task from the user's todo list
- Parameters: task_id (required)
- Returns: Confirmation of deletion
- Error Handling: Validates task existence and user ownership

## 5. Stateless Conversation Flow

The system maintains a stateless server architecture while persisting conversation context in the database:

- **Request Initiation**: Each chat request contains user context (user_id) and message content
- **Context Reconstruction**: The system retrieves relevant conversation history from the database to establish context
- **Processing**: The agent processes the current message with reconstructed context
- **Response Generation**: The system generates an appropriate response based on the conversation state
- **State Persistence**: Conversation state, including messages and context, is saved to the database
- **Response Delivery**: The response is returned to the client for display

This approach allows horizontal scaling while maintaining conversation continuity across requests.

## 6. API Contract for POST /api/{user_id}/chat

**Endpoint**: `POST /api/{user_id}/chat`

**Path Parameters**:
- `user_id` (string): Unique identifier for the authenticated user

**Request Body**:
```json
{
  "message": "User's natural language input",
  "conversation_id": "Optional ID for continuing existing conversation",
  "metadata": {
    "timestamp": "ISO 8601 timestamp",
    "client_info": "Optional client information"
  }
}
```

**Response Body**:
```json
{
  "response": "AI-generated response to the user",
  "conversation_id": "ID of the conversation thread",
  "action_taken": "Summary of actions performed (e.g., task added, list retrieved)",
  "next_expected_input": "Optional indication of expected follow-up input",
  "timestamp": "ISO 8601 timestamp of response"
}
```

**HTTP Status Codes**:
- `200`: Successful processing with AI response
- `400`: Invalid request format or parameters
- `401`: Authentication required or invalid session
- `403`: User not authorized to access this resource
- `404`: User or conversation not found
- `500`: Internal server error during processing

## 7. Database Models

**Task Model**:
- `id` (UUID): Primary key for the task
- `user_id` (UUID): Foreign key linking to the user who owns the task
- `description` (Text): The task description in plain text
- `status` (Enum): Current status (pending, in_progress, completed, cancelled)
- `priority` (Enum): Priority level (low, medium, high, urgent)
- `due_date` (DateTime, optional): Deadline for task completion
- `created_at` (DateTime): Timestamp of task creation
- `updated_at` (DateTime): Timestamp of last update
- `completed_at` (DateTime, optional): Timestamp when task was completed

**Conversation Model**:
- `id` (UUID): Primary key for the conversation
- `user_id` (UUID): Foreign key linking to the user who initiated the conversation
- `title` (String, optional): Auto-generated title for the conversation
- `created_at` (DateTime): Timestamp of conversation creation
- `updated_at` (DateTime): Timestamp of last activity
- `is_active` (Boolean): Indicates if the conversation is currently active

**Message Model**:
- `id` (UUID): Primary key for the message
- `conversation_id` (UUID): Foreign key linking to the conversation
- `sender_type` (Enum): Type of sender (user, agent)
- `content` (Text): The actual message content
- `timestamp` (DateTime): When the message was sent
- `metadata` (JSON, optional): Additional metadata about the message

## 8. Error Handling Expectations

The system handles various error scenarios with appropriate responses:

**Authentication Errors**:
- Invalid or expired tokens return 401 Unauthorized
- Clear error messages guide users to re-authenticate

**Validation Errors**:
- Malformed requests return 400 Bad Request with specific validation failure details
- User input that violates business rules receives appropriate feedback

**Resource Errors**:
- Attempts to access non-existent resources return 404 Not Found
- Permission violations return 403 Forbidden

**Service Errors**:
- Database connection failures return 500 Internal Server Error with graceful degradation
- AI service unavailability returns appropriate fallback responses

**Recovery Mechanisms**:
- Automatic retry for transient failures
- User-friendly error messages that explain what went wrong and suggest corrective actions
- Logging of errors for debugging and monitoring purposes

## 9. Non-goals

The system must NOT:

- Store or process any personally identifiable information beyond what's necessary for authentication and task management
- Allow cross-user data access or modification
- Implement complex scheduling algorithms beyond simple due dates
- Integrate with external calendar systems or third-party applications
- Support offline functionality or local data storage
- Provide advanced analytics or reporting features beyond basic task statistics
- Allow sharing of tasks or conversations between users
- Implement voice recognition or speech-to-text capabilities
- Support file attachments or rich media in conversations
- Provide email notifications or reminders outside of the chat interface