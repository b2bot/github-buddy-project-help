
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  sender: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useChatHistory() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadChatHistories = async () => {
    if (!user) {
      setChatHistories([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_histories')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface with proper type casting
      const transformedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        messages: Array.isArray(item.messages) ? (item.messages as unknown as Message[]) : [],
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_id: item.user_id
      }));

      setChatHistories(transformedData);
    } catch (error) {
      console.error('Error loading chat histories:', error);
      setChatHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const saveChatHistory = async (title: string, messages: Message[]) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_histories')
        .insert({
          title,
          messages: JSON.stringify(messages),
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newHistory: ChatHistory = {
        id: data.id,
        title: data.title,
        messages: Array.isArray(data.messages) ? (data.messages as unknown as Message[]) : JSON.parse(data.messages as string),
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id
      };

      setChatHistories(prev => [newHistory, ...prev]);
      return newHistory;
    } catch (error) {
      console.error('Error saving chat history:', error);
      return null;
    }
  };

  const updateChatHistory = async (id: string, title: string, messages: Message[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_histories')
        .update({
          title,
          messages: JSON.stringify(messages),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setChatHistories(prev =>
        prev.map(chat =>
          chat.id === id
            ? { ...chat, title, messages, updated_at: new Date().toISOString() }
            : chat
        )
      );
    } catch (error) {
      console.error('Error updating chat history:', error);
    }
  };

  const deleteChatHistory = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_histories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setChatHistories(prev => prev.filter(chat => chat.id !== id));
    } catch (error) {
      console.error('Error deleting chat history:', error);
    }
  };

  useEffect(() => {
    loadChatHistories();
  }, [user]);

  return {
    chatHistories,
    loading,
    saveChatHistory,
    updateChatHistory,
    deleteChatHistory,
    loadChatHistories
  };
}
