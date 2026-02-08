'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MessageCircle, X, Bot } from 'lucide-react';
import Link from 'next/link';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Hide the chat on certain pages like the chat page itself
  useEffect(() => {
    setIsVisible(pathname !== '/chat');
  }, [pathname]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 w-52 h-44 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 text-white flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              <span className="font-semibold text-xs">AI Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 p-3 bg-gray-50 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-700 text-center">Hello! How can I assist with your tasks today?</p>
            <Link
              href="/chat"
              onClick={() => setIsOpen(false)}
              className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors"
            >
              Start Chat
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingChat;