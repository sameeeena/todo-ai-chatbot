"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatWindow: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id) return;

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await sendMessage(content, session.user.id);

      // Add assistant response to UI
      const assistantMessage: Message = {
        id: Date.now().toString(),
        sender: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Show error message to user
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'assistant',
        content: 'Sorry, I encountered an error processing your request. The task update/complete operation may have failed. Please make sure you have tasks to update and try rephrasing your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border-2 border-indigo-200">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-xl">
        <div className="flex items-center">
          <div className="bg-white/20 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <h2 className="text-base font-black text-white">AI Todo Assistant</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 bg-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-indigo-800 p-4">
            <div className="mb-4">
              <div className="bg-gradient-to-br from-indigo-200 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  <line x1="9" y1="16" x2="9.01" y2="16"/>
                  <line x1="15" y1="16" x2="15.01" y2="16"/>
                </svg>
              </div>
              <h3 className="font-black text-xl text-indigo-900">How May I Help You?</h3>
            </div>
            <div className="text-sm bg-indigo-50 rounded-lg p-4 w-full border-2 border-indigo-200 font-medium">
              <p className="font-black text-indigo-700 mb-2">Try these commands:</p>
              <ul className="space-y-1 text-indigo-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 text-sm font-bold">•</span>
                  <span className="text-sm font-medium">&quot;Add buy groceries&quot;</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 text-sm font-bold">•</span>
                  <span className="text-sm font-medium">&quot;Show my tasks&quot;</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 text-sm font-bold">•</span>
                  <span className="text-sm font-medium">&quot;Complete task #1&quot;</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                sender={message.sender}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <ChatMessage
                sender="assistant"
                content="Thinking..."
                timestamp={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t-2 border-indigo-200 p-3 bg-white">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!session?.user?.id || isLoading}
        />
      </div>
    </div>
  );
};

export default ChatWindow;