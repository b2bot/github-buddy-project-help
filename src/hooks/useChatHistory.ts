
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

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const loadChatHistories = async () => {
    try {
      setIsLoading(true);
      console.log('[Clarencio][useChatHistory] Iniciando carregamento do histórico');
      
      const token = await getAuthToken();
      if (!token) {
        console.log('[Clarencio][useChatHistory] Usuário não autenticado');
        setChatHistories([]);
        return;
      }

      const response = await fetch('/api/chat-clarencio.js', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Permissão negada. Tente fazer logout e login novamente.');
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Clarencio][useChatHistory] Histórico carregado com sucesso:', data.length || 0, 'conversas');
      setChatHistories(data || []);
      
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao carregar histórico:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: error instanceof Error ? error.message : "Não foi possível carregar o histórico de conversas.",
        variant: "destructive"
      });
      setChatHistories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async (title: string): Promise<ChatHistory | null> => {
    try {
      console.log('[Clarencio][useChatHistory] Criando novo chat:', title);
      
      const token = await getAuthToken();
      if (!token) {
        console.error('[Clarencio][useChatHistory] Usuário não autenticado para criar chat');
        toast({
          title: "Usuário não autenticado",
          description: "Você precisa estar logado para usar o chat.",
          variant: "destructive"
        });
        return null;
      }

      const initialMessages: Message[] = [
        {
          role: 'system',
          content: 'System prompt do Clarêncio - Assistente especialista em SEO e conteúdo da plataforma Partner SEO',
          created_at: new Date().toISOString()
        }
      ];

      const response = await fetch('/api/chat-clarencio.js', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          title: title,
          messages: initialMessages
        })
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Permissão negada. Tente fazer logout e login novamente.');
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const newChat = await response.json();
      console.log('[Clarencio][useChatHistory] Novo chat criado com sucesso:', newChat.id);

      setChatHistories(prev => [newChat, ...prev]);
      return newChat;
      
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao criar chat:', error);
      toast({
        title: "Erro ao criar chat",
        description: error instanceof Error ? error.message : "Não foi possível criar um novo chat.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateChat = async (chatId: string, messages: Message[]) => {
    try {
      console.log('[Clarencio][useChatHistory] Atualizando chat:', chatId, 'mensagens:', messages.length);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('/api/chat-clarencio.js', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          chatId: chatId,
          messages: messages
        })
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Permissão negada. Tente fazer logout e login novamente.');
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

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
        description: error instanceof Error ? error.message : "Não foi possível salvar a conversa.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      console.log('[Clarencio][useChatHistory] Deletando chat:', chatId);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('/api/chat-clarencio.js', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: chatId
        })
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Permissão negada. Tente fazer logout e login novamente.');
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
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
        description: error instanceof Error ? error.message : "Não foi possível excluir a conversa.",
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
