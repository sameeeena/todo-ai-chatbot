"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onCreateNew: () => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  onSelectConversation,
  onCreateNew
}) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-lg">Conversations</CardTitle>
        <Button onClick={onCreateNew} className="w-full">
          New Chat
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-500">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <Button
                key={conv.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => onSelectConversation(conv.id)}
              >
                {conv.title || `Chat ${new Date(conv.created_at).toLocaleDateString()}`}
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationHistory;