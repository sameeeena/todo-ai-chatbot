# Implementation Rules: AI-Powered Todo Chatbot (Phase III)

**Purpose**: Define strict implementation rules and constraints for all development work
**Scope**: Applies to all code, configuration, and documentation for this feature

## 1. Coding Principles

### Statelessness
- Do not store conversation state in memory or application variables
- All conversation context must be retrieved from the database at the beginning of each request
- All state changes must be persisted to the database before response
- Maintain stateless server architecture as specified in spec.md Section 5

### Separation of Concerns
- Database layer: Only data models and persistence operations
- MCP tools layer: Only standardized database operation interfaces
- Agent layer: Only natural language processing and intent recognition
- API layer: Only request/response handling and authentication
- Frontend layer: Only UI presentation and user interaction
- Do not mix responsibilities between layers

### Layer Isolation
- Frontend and backend logic must remain completely separated
- Database models must not contain business logic
- MCP tools must not contain UI logic
- Agent logic must not contain direct database access

## 2. What Claude is ALLOWED to do

### File Creation and Modification
- Create files in the specified project structure per plan.md
- Modify existing files to implement required functionality
- Add new files that are explicitly defined in the task breakdown
- Update configuration files for dependencies and environment

### Database Operations
- Implement SQLModel database models exactly as defined in spec.md Section 7
- Create database connection and initialization scripts
- Implement relationships and validation rules as specified
- Use only the fields and data types defined in the specification

### API Development
- Implement the API contract exactly as defined in spec.md Section 6
- Add authentication middleware using Better Auth as specified
- Include all required HTTP status codes as specified
- Add rate limiting as defined in the specification

### MCP Tool Usage
- Implement MCP tools as defined in spec.md Section 4
- Use MCP tools for all database operations (no direct SQL)
- Follow the standardized interfaces for database operations
- Include error handling as specified in spec.md Section 8

### Agent Integration
- Implement intent recognition for specified operations only
- Use MCP tools for all data operations (no direct database access)
- Maintain conversation context through database persistence
- Implement error recovery as specified in spec.md Section 8

## 3. What Claude is NOT Allowed to do

### Prohibited Actions
- Add fields to database models not defined in spec.md Section 7
- Store state in memory or application variables
- Bypass MCP tools for database operations
- Mix frontend and backend logic in the same files
- Access database directly from agent or API layers
- Implement features not defined in the specification
- Add functionality that violates non-goals in spec.md Section 9

### Prohibited Features
- Cross-user data access or modification (spec.md Section 9)
- Offline functionality or local data storage (spec.md Section 9)
- Voice recognition or speech-to-text capabilities (spec.md Section 9)
- File attachments or rich media in conversations (spec.md Section 9)
- Complex scheduling algorithms beyond simple due dates (spec.md Section 9)
- Sharing of tasks or conversations between users (spec.md Section 9)

### Architecture Violations
- Create tight coupling between layers
- Implement direct database access outside MCP tools
- Store conversation state in memory
- Bypass authentication checks
- Access data from other users

## 4. Rules for Modifying Files

### Existing Files
- Only modify files that are part of the implementation plan
- Preserve existing functionality unless explicitly changing it per tasks
- Maintain backward compatibility where specified
- Update imports and dependencies as needed for new functionality

### Code Style
- Follow the language-specific conventions for Python and TypeScript/JavaScript
- Maintain consistent naming conventions across all layers
- Use descriptive variable and function names
- Add appropriate comments for complex logic

### Error Handling
- Implement error handling as specified in spec.md Section 8
- Use appropriate HTTP status codes as defined in the specification
- Log errors appropriately for debugging and monitoring
- Provide user-friendly error messages

## 5. Rules for Adding New Files

### File Location
- Place files according to the structure defined in plan.md
- Backend files in the backend/ directory
- Frontend files in the frontend/ directory
- Shared types in the shared/ directory
- Tests in appropriate test directories

### Naming Conventions
- Use snake_case for Python files and functions
- Use camelCase for JavaScript/TypeScript files and functions
- Use descriptive names that reflect the file's purpose
- Follow the naming patterns established in the plan.md structure

### File Content
- Each file should have a single responsibility
- Include proper imports and exports
- Add type hints where appropriate
- Include documentation for public interfaces

## 6. Rules for Error Handling

### Error Types
- Authentication errors: Return 401 Unauthorized (spec.md Section 8)
- Validation errors: Return 400 Bad Request with details (spec.md Section 8)
- Resource errors: Return 404 Not Found (spec.md Section 8)
- Permission errors: Return 403 Forbidden (spec.md Section 8)
- Service errors: Return 500 Internal Server Error (spec.md Section 8)

### Error Recovery
- Implement automatic retry for transient failures
- Provide user-friendly error messages
- Include appropriate logging for debugging
- Implement fallback responses when AI service is unavailable

### Security
- Prevent exposure of sensitive system information in error messages
- Validate all user inputs to prevent injection attacks
- Implement proper authentication checks on all protected resources
- Ensure user data isolation in all error conditions

## 7. Rules for Tool Usage (MCP-only Task Operations)

### MCP Tool Requirements
- All database operations must go through MCP tools
- MCP tools must implement the interfaces defined in spec.md Section 4
- MCP tools must include proper error handling as specified
- MCP tools must validate user permissions for all operations

### Task Operation Compliance
- Add Task tool: Must accept parameters as defined in spec.md Section 4
- List Tasks tool: Must support filters as defined in spec.md Section 4
- Update Task tool: Must validate task ownership as defined in spec.md Section 4
- Complete Task tool: Must validate task ownership as defined in spec.md Section 4
- Delete Task tool: Must validate task ownership as defined in spec.md Section 4

### MCP Tool Validation
- All MCP tools must validate user permissions
- All MCP tools must return appropriate error responses
- All MCP tools must follow the data models defined in spec.md Section 7
- All MCP tools must maintain data integrity and consistency

## 8. Validation Requirements After Implementation

### Database Layer Validation
- [ ] All models match spec.md Section 7 requirements
- [ ] All validation rules are properly implemented
- [ ] Database relationships work correctly
- [ ] UUID primary keys are properly configured

### MCP Server Layer Validation
- [ ] All MCP tools match spec.md Section 4 requirements
- [ ] Error handling works as specified in spec.md Section 8
- [ ] User permission validation works correctly
- [ ] Input validation prevents invalid data

### Agent Layer Validation
- [ ] Intent recognition works for all specified operations per spec.md Section 3
- [ ] Conversation context reconstruction works per spec.md Section 5
- [ ] Error recovery mechanisms work per spec.md Section 8
- [ ] Security compliance prevents cross-user access per spec.md Section 3

### API Layer Validation
- [ ] API contract matches spec.md Section 6 exactly
- [ ] All HTTP status codes work per spec.md Section 6
- [ ] Authentication protects user data per spec.md Section 2
- [ ] Rate limiting works per spec.md Section 6

### Frontend Layer Validation
- [ ] ChatKit integration works per plan.md
- [ ] API communication handles all response types per spec.md Section 6
- [ ] Authentication state is properly managed per plan.md
- [ ] Responsive design works across devices per plan.md

### Security and Non-Goals Validation
- [ ] Perform security validation per spec.md Section 8
- [ ] Test stateless architecture behavior per spec.md Section 5
- [ ] Validate conversation continuity across requests per spec.md Section 5
- [ ] Verify all non-goals are properly prevented per spec.md Section 9
- [ ] Test user isolation and data security per spec.md Section 9

### Performance Validation
- [ ] Response times meet performance goals (<2s for chat interactions)
- [ ] API responses meet latency requirements (<500ms p95)
- [ ] System supports specified scale (1000 concurrent users)
- [ ] Database queries perform adequately for conversation history