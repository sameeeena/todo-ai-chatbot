# MCP Tools Specification: Todo Management

This document defines the interface for the Model Context Protocol (MCP) tools used by the `TodoChatAgent`.

---

## 1. add_task
**Purpose:** Creates a new task for a specific user.

### Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | Yes | The unique identifier for the user. |
| `title` | `string` | Yes | The text description of the task. |
| `priority` | `string` | No | Priority level (e.g., "low", "medium", "high"). Defaults to "medium". |
| `due_date` | `string` | No | ISO 8601 formatted date string (YYYY-MM-DD). |

### Return Values
- `task`: Object containing `id`, `title`, `priority`, `due_date`, and `status`.

### Example
**Input:**
```json
{
  "user_id": "user_123",
  "title": "Buy groceries",
  "priority": "high",
  "due_date": "2026-02-05"
}
```
**Output:**
```json
{
  "success": true,
  "task": {
    "id": "task_abc123",
    "title": "Buy groceries",
    "priority": "high",
    "due_date": "2026-02-05",
    "status": "pending"
  }
}
```

### Error Cases
- **Missing Title:** Returns error if `title` is empty or null.
- **Invalid Date:** Returns error if `due_date` format is incorrect.

---

## 2. list_tasks
**Purpose:** Retrieves a list of tasks for a specific user.

### Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | Yes | The unique identifier for the user. |
| `status` | `string` | No | Filter by "pending" or "completed". |

### Return Values
- `tasks`: Array of task objects.

### Example
**Input:**
```json
{
  "user_id": "user_123",
  "status": "pending"
}
```
**Output:**
```json
{
  "success": true,
  "tasks": [
    { "id": "task_1", "title": "Finish report", "status": "pending" },
    { "id": "task_2", "title": "Call mom", "status": "pending" }
  ]
}
```

---

## 3. update_task
**Purpose:** Modifies an existing task's properties.

### Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | Yes | The unique identifier for the user. |
| `task_id` | `string` | Yes | The unique identifier for the task. |
| `title` | `string` | No | New description. |
| `priority` | `string` | No | New priority level. |
| `due_date` | `string` | No | New due date. |

### Example
**Input:**
```json
{
  "user_id": "user_123",
  "task_id": "task_1",
  "priority": "high"
}
```
**Output:**
```json
{
  "success": true,
  "task": { "id": "task_1", "title": "Finish report", "priority": "high", "status": "pending" }
}
```

### Error Cases
- **Task Not Found:** Returns error if `task_id` does not exist for the `user_id`.

---

## 4. complete_task
**Purpose:** Marks a task as completed.

### Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | Yes | The unique identifier for the user. |
| `task_id` | `string` | Yes | The unique identifier for the task. |

### Example
**Input:**
```json
{
  "user_id": "user_123",
  "task_id": "task_1"
}
```
**Output:**
```json
{
  "success": true,
  "message": "Task 'task_1' marked as completed."
}
```

---

## 5. delete_task
**Purpose:** Permanently removes a task.

### Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | Yes | The unique identifier for the user. |
| `task_id` | `string` | Yes | The unique identifier for the task. |

### Example
**Input:**
```json
{
  "user_id": "user_123",
  "task_id": "task_1"
}
```
**Output:**
```json
{
  "success": true,
  "message": "Task 'task_1' successfully deleted."
}
```
