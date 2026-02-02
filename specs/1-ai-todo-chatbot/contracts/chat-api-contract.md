# API Contract: AI-Powered Todo Chatbot

## Endpoint: POST /api/{user_id}/chat

### Description
Process a user's natural language message and return an AI-generated response with appropriate task operations.

### Path Parameters
- `user_id` (string, required): Unique identifier for the authenticated user

### Request Body
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

### Response Body
```json
{
  "response": "AI-generated response to the user",
  "conversation_id": "ID of the conversation thread",
  "action_taken": "Summary of actions performed (e.g., task added, list retrieved)",
  "next_expected_input": "Optional indication of expected follow-up input",
  "timestamp": "ISO 8601 timestamp of response"
}
```

### HTTP Status Codes
- `200`: Successful processing with AI response
- `400`: Invalid request format or parameters
- `401`: Authentication required or invalid session
- `403`: User not authorized to access this resource
- `404`: User or conversation not found
- `500`: Internal server error during processing

### Security
- Requires valid authentication token via Better Auth
- User can only access their own conversations and tasks

### Rate Limiting
- Maximum 100 requests per hour per user
- Burst limit of 10 requests per minute