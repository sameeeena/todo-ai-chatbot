"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  sender: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, content, timestamp }) => {
  const isUser = sender === 'user';

  return (
    <div className={cn(
      "flex mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
        isUser
          ? "bg-blue-500 text-white rounded-br-none"
          : "bg-gray-200 text-gray-800 rounded-bl-none"
      )}>
        <div className="text-sm">{content}</div>
        {timestamp && (
          <div className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500"
          )}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;