
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export function useChatHistory() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadChatHistories = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      const { data, error } = await supabase
        .from('chat_histories')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setChatHistories(data || []);
    } catch (error) {
      console.error('Error loading chat histories:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de conversas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async (title: string): Promise<ChatHistory | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Usuário não autenticado",
          description: "Você precisa estar logado para usar o chat.",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('chat_histories')
        .insert([
          {
            user_id: user.id,
            title: title,
            messages: []
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newChat = data as ChatHistory;
      setChatHistories(prev => [newChat, ...prev]);
      
      return newChat;
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast({
        title: "Erro ao criar chat",
        description: "Não foi possível criar um novo chat.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateChat = async (chatId: string, messages: Message[]) => {
    try {
      const { error } = await supabase
        .from('chat_histories')
        .update({ 
          messages: messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (error) {
        throw error;
      }

      // Update local state
      setChatHistories(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages, updated_at: new Date().toISOString() }
            : chat
        )
      );
    } catch (error) {
      console.error('Error updating chat:', error);
      toast({
        title: "Erro ao salvar conversa",
        description: "Não foi possível salvar a conversa.",
        variant: "destructive"
      });
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chat_histories')
        .delete()
        .eq('id', chatId);

      if (error) {
        throw error;
      }

      setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
      
      toast({
        title: "Chat excluído",
        description: "A conversa foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a conversa.",
        variant: "destructive"
      });
    }
  };

  return {
    chatHistories,
    isLoading,
    loadChatHistories,
    createNewChat,
    updateChat,
    deleteChat
  };
}