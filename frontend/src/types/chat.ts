export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  action_taken: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}