from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
from uuid import UUID
from pydantic import BaseModel
import json

from core.database import get_session
from core.security import get_current_user
from agents.todo_chat_agent import TodoChatAgent
from agents.context_manager import ContextManager
from mcp_tools.conversation_operations import get_conversation, get_user_conversations

router = APIRouter(tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    metadata: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    action_taken: str
    timestamp: str

@router.post("/{user_id}/chat")
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    current_user_id: str = Depends(get_current_user),
    db_session: Session = Depends(get_session)
):
    try:
        if user_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only access your own chat"
            )

        message = request.message
        if not message or not isinstance(message, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="message field is required"
            )

        conversation_id = request.conversation_id
        context_manager = ContextManager(session=db_session)
        actual_conversation_id = context_manager.get_or_create_conversation(
            user_id=user_id,
            conversation_id=conversation_id
        )

        agent = TodoChatAgent(session=db_session)
        result = agent.process_message(
            user_id=user_id,
            conversation_id=str(actual_conversation_id),
            user_message=message
        )

        return {
            "response": result["response"],
            "conversation_id": str(actual_conversation_id),
            "action_taken": result["action_taken"],
            "timestamp": result["timestamp"]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(e)}"
        )

@router.get("/{user_id}/conversations")
async def list_conversations(
    user_id: str,
    db_session: Session = Depends(get_session)
):
    conversations = get_user_conversations(db_session, user_id)
    return {
        "conversations": [
            {
                "id": str(conv.id),
                "title": conv.title,
                "created_at": conv.created_at.isoformat() if conv.created_at else None,
                "is_active": conv.is_active
            }
            for conv in conversations
        ]
    }
