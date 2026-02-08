'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ChatPage = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirect effect will handle this
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-900">AI Todo Assistant</h1>
          <p className="text-indigo-600 text-sm mt-1">Manage tasks with natural language</p>
        </div>
        <div className="h-[500px] flex flex-col">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;