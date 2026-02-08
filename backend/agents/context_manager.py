from typing import Dict, Any, Optional
from sqlmodel import Session
from uuid import UUID

from mcp_tools.conversation_operations import get_conversation, create_conversation

class ContextManager:
    def __init__(self, session: Session):
        self.session = session

    def get_or_create_conversation(self, user_id: str, conversation_id: Optional[str] = None, title: Optional[str] = None) -> UUID:
        if conversation_id:
            try:
                existing_conv = get_conversation(
                    session=self.session,
                    conversation_id=UUID(conversation_id),
                    user_id=user_id
                )
                if existing_conv:
                    return UUID(conversation_id)
            except:
                pass

        new_conversation = create_conversation(
            session=self.session,
            user_id=user_id,
            title=title
        )
        return new_conversation.id
