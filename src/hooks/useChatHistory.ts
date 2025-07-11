
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'system' | 'user' | 'assistant';
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
      console.log('[Clarencio][useChatHistory] Carregando histórico de conversas');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[Clarencio][useChatHistory] Usuário não encontrado');
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

      console.log('[Clarencio][useChatHistory] Histórico carregado:', data?.length || 0, 'conversas');
      setChatHistories(data || []);
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao carregar histórico:', error);
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
      console.log('[Clarencio][useChatHistory] Criando novo chat:', title);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Usuário não autenticado",
          description: "Você precisa estar logado para usar o chat.",
          variant: "destructive"
        });
        return null;
      }

      // Criar chat com mensagem system inicial
      const initialMessages: Message[] = [
        {
          role: 'system',
          content: 'System prompt do Clarêncio (será injetado na API)',
          created_at: new Date().toISOString()
        }
      ];

      const { data, error } = await supabase
        .from('chat_histories')
        .insert([
          {
            user_id: user.id,
            title: title,
            messages: initialMessages
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newChat = data as ChatHistory;
      setChatHistories(prev => [newChat, ...prev]);
      
      console.log('[Clarencio][useChatHistory] Novo chat criado:', newChat.id);
      return newChat;
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao criar chat:', error);
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
      console.log('[Clarencio][useChatHistory] Atualizando chat:', chatId, 'com', messages.length, 'mensagens');
      
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
      
      console.log('[Clarencio][useChatHistory] Chat atualizado com sucesso');
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao atualizar chat:', error);
      toast({
        title: "Erro ao salvar conversa",
        description: "Não foi possível salvar a conversa.",
        variant: "destructive"
      });
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      console.log('[Clarencio][useChatHistory] Deletando chat:', chatId);
      
      const { error } = await supabase
        .from('chat_histories')
        .delete()
        .eq('id', chatId);

      if (error) {
        throw error;
      }

      setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
      
      console.log('[Clarencio][useChatHistory] Chat deletado com sucesso');
      toast({
        title: "Chat excluído",
        description: "A conversa foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao deletar chat:', error);
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
    deleteChat,
    setChatHistories
  };
}
