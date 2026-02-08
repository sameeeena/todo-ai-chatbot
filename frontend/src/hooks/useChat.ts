import { useState } from 'react';
import { chatApi } from '@/lib/chat-api';

interface UseChatReturn {
  sendMessage: (message: string, userId: string, conversationId?: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export const useChat = (): UseChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, userId: string, conversationId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(userId, message, conversationId);
      return response;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error
  };
};