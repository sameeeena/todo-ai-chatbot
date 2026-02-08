from typing import Dict, Any, Optional
from sqlmodel import Session
import re

from mcp_tools.task_operations import add_task, list_tasks, update_task, complete_task, delete_task
from mcp_tools.conversation_operations import add_message, get_conversation_messages
from models.task import TaskStatus, TaskPriority
from models.message import SenderType
from agents.intent_recognizer import recognize_intent

class TodoChatAgent:
    def __init__(self, session: Session):
        self.session = session

    def process_message(self, user_id: str, conversation_id: str, user_message: str) -> Dict[str, Any]:
        add_message(
            session=self.session,
            conversation_id=conversation_id,
            sender_type=SenderType.user,
            content=user_message
        )

        intent_data = recognize_intent(user_message)
        response = self._handle_intent(user_id, intent_data)

        add_message(
            session=self.session,
            conversation_id=conversation_id,
            sender_type=SenderType.assistant,
            content=response
        )

        return {
            "response": response,
            "conversation_id": conversation_id,
            "action_taken": intent_data.get("action", "unknown"),
            "timestamp": "now"
        }

    def _handle_intent(self, user_id: str, intent_data: Dict[str, Any]) -> str:
        action = intent_data.get("action")
        if action == "add_task":
            return self._handle_add_task(user_id, intent_data)
        elif action == "list_tasks":
            return self._handle_list_tasks(user_id, intent_data)
        elif action == "complete_task":
            return self._handle_complete_task(user_id, intent_data)
        elif action == "delete_task":
            return self._handle_delete_task(user_id, intent_data)
        elif action == "update_task":
            return self._handle_update_task(user_id, intent_data)
        else:
            return "I'm not sure how to help with that. You can ask me to add, list, update, complete, or delete tasks."

    def _handle_add_task(self, user_id: str, intent_data: Dict[str, Any]) -> str:
        title = intent_data.get("title", intent_data.get("description", "Untitled task"))
        description = intent_data.get("description")
        priority_str = intent_data.get("priority", "medium")
        try:
            priority = TaskPriority(priority_str)
        except ValueError:
            priority = TaskPriority.medium
        due_date = intent_data.get("due_date")

        try:
            task = add_task(
                session=self.session,
                user_id=user_id,
                title=title,
                description=description,
                priority=priority,
                due_date=due_date
            )
            return f"I've added '{task.title}' to your tasks. Priority: {task.priority}."
        except Exception as e:
            return f"Sorry, I couldn't add that task. Error: {str(e)}"

    def _handle_list_tasks(self, user_id: str, intent_data: Dict[str, Any]) -> str:
        status_filter = None
        status_param = intent_data.get("status")
        if status_param:
            try:
                status_filter = TaskStatus(status_param)
            except ValueError:
                pass

        tasks = list_tasks(session=self.session, user_id=user_id, status=status_filter)
        if not tasks:
            return "You don't have any tasks right now."

        task_list = []
        for i, task in enumerate(tasks[:10], 1):
            status_icon = "✅" if task.status == TaskStatus.completed else "⏳"
            task_list.append(f"{i}. {status_icon} {task.title}")
        
        return "Here are your tasks:\n" + "\n".join(task_list)

    def _handle_complete_task(self, user_id: str, intent_data: Dict[str, Any]) -> str:
        task_num = intent_data.get("task_number")
        tasks = list_tasks(session=self.session, user_id=user_id)
        
        if task_num and 1 <= task_num <= len(tasks):
            task = tasks[task_num-1]
            complete_task(self.session, user_id, str(task.id))
            return f"I've marked '{task.title}' as completed!"
        
        return "Which task would you like to complete? Please specify the task number."

    def _handle_delete_task(self, user_id: str, intent_data: Dict[str, Any]) -> str:
        task_num = intent_data.get("task_number")
        tasks = list_tasks(session=self.session, user_id=user_id)
        
        if task_num and 1 <= task_num <= len(tasks):
            task = tasks[task_num-1]
            delete_task(self.session, user_id, str(task.id))
            return f"I've deleted '{task.title}'."
        
        return "Which task would you like to delete? Please specify the task number."

    def _handle_update_task(self, user_id: str, intent_data: Dict[str, Any]) -> str:
        task_num = intent_data.get("task_number")
        tasks = list_tasks(session=self.session, user_id=user_id)
        
        if task_num and 1 <= task_num <= len(tasks):
            task = tasks[task_num-1]
            update_task(
                self.session, 
                user_id, 
                str(task.id), 
                title=intent_data.get("title"),
                description=intent_data.get("description"),
                priority=intent_data.get("priority")
            )
            return f"I've updated '{task.title}'."
        
        return "Which task would you like to update? Please specify the task number."
