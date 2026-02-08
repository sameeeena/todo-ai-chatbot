from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime
from uuid import UUID

from models.conversation import Conversation
from models.message import Message, SenderType

def create_conversation(session: Session, user_id: str, title: Optional[str] = None) -> Conversation:
    conversation = Conversation(user_id=user_id, title=title)
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation

def get_conversation(session: Session, conversation_id: UUID, user_id: str) -> Optional[Conversation]:
    return session.exec(
        select(Conversation)
        .where(Conversation.id == conversation_id)
        .where(Conversation.user_id == user_id)
    ).first()

def get_user_conversations(session: Session, user_id: str) -> List[Conversation]:
    return session.exec(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()

def add_message(session: Session, conversation_id: UUID, sender_type: SenderType, content: str) -> Message:
    message = Message(
        conversation_id=conversation_id,
        sender_type=sender_type,
        content=content
    )
    session.add(message)
    session.commit()
    session.refresh(message)
    return message
