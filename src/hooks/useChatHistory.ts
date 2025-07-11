
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
      console.log('[Clarencio][useChatHistory] Iniciando carregamento do histórico');
      
      // Verificar se o usuário está autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('[Clarencio][useChatHistory] Erro ao verificar usuário:', userError);
        throw userError;
      }

      if (!user) {
        console.log('[Clarencio][useChatHistory] Usuário não autenticado');
        setChatHistories([]);
        return;
      }

      console.log('[Clarencio][useChatHistory] Usuário autenticado:', user.id);

      // Buscar histórico do usuário
      const { data, error } = await supabase
        .from('chat_histories')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('[Clarencio][useChatHistory] Erro na consulta:', error);
        throw error;
      }

      console.log('[Clarencio][useChatHistory] Histórico carregado com sucesso:', data?.length || 0, 'conversas');
      setChatHistories(data || []);
      
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao carregar histórico:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de conversas. Verifique sua conexão.",
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
      
      // Verificar se o usuário está autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('[Clarencio][useChatHistory] Erro ao verificar usuário:', userError);
        throw userError;
      }

      if (!user) {
        console.error('[Clarencio][useChatHistory] Usuário não autenticado para criar chat');
        toast({
          title: "Usuário não autenticado",
          description: "Você precisa estar logado para usar o chat.",
          variant: "destructive"
        });
        return null;
      }

      console.log('[Clarencio][useChatHistory] Criando chat para usuário:', user.id);

      // Criar mensagem system inicial
      const initialMessages: Message[] = [
        {
          role: 'system',
          content: 'System prompt do Clarêncio - Assistente especialista em SEO e conteúdo da plataforma Partner SEO',
          created_at: new Date().toISOString()
        }
      ];

      // Inserir novo chat
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
        console.error('[Clarencio][useChatHistory] Erro ao inserir chat:', error);
        throw error;
      }

      const newChat = data as ChatHistory;
      console.log('[Clarencio][useChatHistory] Novo chat criado com sucesso:', newChat.id);

      // Atualizar lista local
      setChatHistories(prev => [newChat, ...prev]);
      
      return newChat;
      
    } catch (error) {
      console.error('[Clarencio][useChatHistory] Erro ao criar chat:', error);
      toast({
        title: "Erro ao criar chat",
        description: "Não foi possível criar um novo chat. Tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateChat = async (chatId: string, messages: Message[]) => {
    try {
      console.log('[Clarencio][useChatHistory] Atualizando chat:', chatId, 'mensagens:', messages.length);
      
      const { error } = await supabase
        .from('chat_histories')
        .update({ 
          messages: messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (error) {
        console.error('[Clarencio][useChatHistory] Erro ao atualizar chat:', error);
        throw error;
      }

      // Atualizar estado local
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
        description: "Não foi possível salvar a conversa. Tente novamente.",
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
        console.error('[Clarencio][useChatHistory] Erro ao deletar chat:', error);
        throw error;
      }

      // Remover do estado local
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
        description: "Não foi possível excluir a conversa. Tente novamente.",
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
