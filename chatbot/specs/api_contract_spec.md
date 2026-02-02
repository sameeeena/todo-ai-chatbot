# API Contract Specification: Chat Endpoint

This document defines the interface for the AI Chatbot backend.

## 1. Endpoint Overview
- **Path:** `/api/{user_id}/chat`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authentication:** Bearer Token (JWT) recommended.

---

## 2. Request Schema

### Path Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `user_id` | `string` | The unique identifier of the authenticated user. |

### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | Yes | The user's natural language input. |
| `session_id` | `string` | No | UUID for the chat session. If omitted, a new session is created. |

**Example Request Body:**
```json
{
  "message": "Add a task to buy coffee tomorrow morning",
  "session_id": "sess_8822-abcd-1234"
}
```

---

## 3. Response Schema

### Success Response (200 OK)
| Field | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | The natural language response from the assistant. |
| `session_id` | `string` | The session identifier used for this interaction. |
| `status` | `string` | Execution status (e.g., "success"). |

**Example Success Response:**
```json
{
  "message": "Got it! I've added 'Buy coffee' to your list for tomorrow.",
  "session_id": "sess_8822-abcd-1234",
  "status": "success"
}
```

---

## 4. Error Responses

### 400 Bad Request
Occurs if the JSON payload is malformed or missing required fields.
```json
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 401 Unauthorized
Occurs if a valid authentication token is not provided.
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
Occurs if the `user_id` provided in the path does not exist in the system.
```json
{
  "detail": "User not found"
}
```

### 500 Internal Server Error
Occurs if there is an unhandled exception or an issue communicating with the AI model/MCP tools.
```json
{
  "detail": "Internal Server Error: AI Model unreachable"
}
```

---

## 5. Implementation Notes (FastAPI)
The backend should use Pydantic models for validation:

Frontend Integration:
- The frontend uses OpenAI ChatKit to render the chat UI.
- ChatKit sends user messages to the backend via POST /api/{user_id}/chat.
- The backend is UI-agnostic and does not depend on ChatKit-specific logic.
- Responses are returned in a ChatKit-compatible format.



```python
from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    session_id: str
    status: str = "success"
```
