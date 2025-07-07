// Updated useChatHistory hook for local testing without Supabase auth
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  sender: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'local_chat_histories';

export function useChatHistory() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  const persist = (data: ChatHistory[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setChatHistories(data);
  };

  const loadChatHistories = async () => {
    // Already loaded from localStorage on init
  };

  const createNewChat = async (title: string): Promise<ChatHistory> => {
    const now = new Date().toISOString();
    const newChat: ChatHistory = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      messages: [],
      created_at: now,
      updated_at: now,
    };
    const updated = [newChat, ...chatHistories];
    persist(updated);
    return newChat;
  };

  const updateChat = async (chatId: string, messages: Message[]) => {
    const updated = chatHistories.map(chat =>
      chat.id === chatId
        ? { ...chat, messages, updated_at: new Date().toISOString() }
        : chat
    );
    persist(updated);
  };

  const deleteChat = async (chatId: string) => {
    const updated = chatHistories.filter(chat => chat.id !== chatId);
    persist(updated);
    toast({
      title: 'Chat excluído',
      description: 'Conversa removida localmente.',
    });
  };

  return {
    chatHistories,
    loadChatHistories,
    createNewChat,
    updateChat,
    deleteChat,
  };
}