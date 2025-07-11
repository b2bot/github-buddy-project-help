
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Send, FileText, Bot, User, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChatHistory } from "@/hooks/useChatHistory";
import { generateContent, type ChatMessage } from "@/integrations/openai";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

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

interface GeneratedContent {
  title: string;
  slug: string;
  metaDescription: string;
  altText: string;
  excerpt: string;
  content: string;
  category?: string;
  keyword?: string;
}

export default function Chat() {
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [shouldGenerateContent, setShouldGenerateContent] = useState(false);
  const [collectedData, setCollectedData] = useState({
    keyword: "",
    category: "geral",
    tone: "profissional",
    objective: "",
    persona: "",
    bigIdea: "",
    emotion: "",
    structure: "",
    cta: ""
  });
  
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');

  const { chatHistories, loadChatHistories, createNewChat, updateChat, deleteChat, setChatHistories } = useChatHistory();
  const { toast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('[Clarencio][Chat.tsx] Componente montado, carregando histórico');
    loadChatHistories();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRenameChat = (chatId: string) => {
    if (!newChatTitle.trim()) return;

    console.log('[Clarencio][Chat.tsx] Renomeando chat:', chatId, 'para:', newChatTitle);

    const updatedChats = chatHistories.map((chat) =>
      chat.id === chatId ? { ...chat, title: newChatTitle.trim() } : chat
    );

    setChatHistories(updatedChats);

    if (currentChat?.id === chatId) {
      setCurrentChat({ ...currentChat, title: newChatTitle.trim() });
    }

    setEditingChatId(null);
    setNewChatTitle('');
  };

  const handleNewChat = async () => {
    console.log('[Clarencio][Chat.tsx] Criando novo chat');
    
    const newChat = await createNewChat("Novo chat com Clarêncio");
    if (newChat) {
      setCurrentChat(newChat);
      setGeneratedContent(null);
      setShouldGenerateContent(false);
      setCollectedData({
        keyword: "",
        category: "geral",
        tone: "profissional",
        objective: "",
        persona: "",
        bigIdea: "",
        emotion: "",
        structure: "",
        cta: ""
      });
      
      // Iniciar conversa automaticamente
      await startInitialChat(newChat);
    }
  };

  const startInitialChat = async (chat: ChatHistory) => {
    try {
      console.log('[Clarencio][Chat.tsx] Iniciando conversa inicial');
      setIsLoading(true);

      // Chamar API do Clarêncio para primeira mensagem
      const response = await callClarencioAPI([]);

      if (response.success) {
        const welcomeMessage: Message = {
          role: 'assistant',
          content: response.message,
          created_at: new Date().toISOString()
        };
        
        const updatedMessages = [...chat.messages, welcomeMessage];
        await updateChat(chat.id, updatedMessages);
        setCurrentChat({ ...chat, messages: updatedMessages });
      }
    } catch (error) {
      console.error('[Clarencio][Chat.tsx] Erro ao iniciar conversa:', error);
      toast({
        title: "Erro na conversa",
        description: "Não foi possível iniciar a conversa com o Clarêncio.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const callClarencioAPI = async (messages: ChatMessage[]) => {
    const response = await fetch('/api/chat-clarencio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  };

  const handleSelectChat = (chat: ChatHistory) => {
    console.log('[Clarencio][Chat.tsx] Selecionando chat:', chat.id);
    setCurrentChat(chat);
    setGeneratedContent(null);
    setShouldGenerateContent(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    console.log('[Clarencio][Chat.tsx] Deletando chat:', chatId);
    await deleteChat(chatId);
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const extractDataFromMessages = (messages: Message[]) => {
    // Tentar extrair dados das mensagens do usuário
    const userMessages = messages.filter(m => m.role === 'user');
    
    if (userMessages.length > 0) {
      const data = { ...collectedData };
      
      // Lógica simples para extrair dados das mensagens
      userMessages.forEach((msg, index) => {
        switch (index) {
          case 0:
            data.keyword = msg.content;
            break;
          case 1:
            data.objective = msg.content;
            break;
          case 2:
            data.persona = msg.content;
            break;
          case 3:
            data.bigIdea = msg.content;
            break;
          case 4:
            data.emotion = msg.content;
            break;
          case 5:
            data.structure = msg.content;
            break;
          case 6:
            data.cta = msg.content;
            break;
        }
      });
      
      return data;
    }
    
    return collectedData;
  };

  const generateFinalContent = async () => {
    try {
      console.log('[Clarencio][Chat.tsx] Gerando conteúdo final');
      setIsLoading(true);
      
      const data = extractDataFromMessages(currentChat?.messages || []);
      
      const prompt = `
        Gere um conteúdo completo seguindo o Framework Leadclinic:
        - Palavra-chave: ${data.keyword}
        - Objetivo: ${data.objective}
        - Persona: ${data.persona}
        - Big Idea: ${data.bigIdea}
        - Emoção: ${data.emotion}
        - Estrutura: ${data.structure}
        - CTA: ${data.cta}
      `;

      const response = await generateContent({
        keyword: data.keyword || 'conteúdo',
        category: data.category || 'geral',
        tone: data.tone || 'profissional',
        method: 'manual',
        sourceInput: prompt
      });

      if (response.success && response.content && response.seoData) {
        const content: GeneratedContent = {
          title: response.seoData.title || `Guia sobre ${data.keyword}`,
          slug: response.seoData.slug || (data.keyword || 'artigo').toLowerCase().replace(/\s+/g, '-'),
          metaDescription: response.seoData.metaDescription || `Aprenda tudo sobre ${data.keyword}`,
          altText: response.seoData.altText || `Imagem sobre ${data.keyword}`,
          excerpt: response.seoData.excerpt || `Conteúdo completo sobre ${data.keyword}`,
          content: response.content,
          category: data.category || 'geral',
          keyword: data.keyword
        };
        
        setGeneratedContent(content);
        setShouldGenerateContent(false);
        
        // Adicionar mensagem final
        const finalMessage: Message = {
          role: 'assistant',
          content: `🎉 **Conteúdo gerado com sucesso!**\n\n**Título:** ${content.title}\n\n**Preview:** ${content.excerpt}\n\n🔥 Esse conteúdo vai bombar! Use o botão "Enviar para o Editor" para importar tudo automaticamente.\n\n✨ Vamos que vamos!`,
          created_at: new Date().toISOString()
        };
        
        if (currentChat) {
          const updatedMessages = [...currentChat.messages, finalMessage];
          await updateChat(currentChat.id, updatedMessages);
          setCurrentChat({ ...currentChat, messages: updatedMessages });
        }
      }
    } catch (error) {
      console.error('[Clarencio][Chat.tsx] Erro ao gerar conteúdo:', error);
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o conteúdo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    if (!currentChat) {
      console.log('[Clarencio][Chat.tsx] Criando novo chat antes de enviar mensagem');
      await handleNewChat();
      return;
    }

    try {
      console.log('[Clarencio][Chat.tsx] Enviando mensagem:', inputMessage);
      setIsLoading(true);

      const userMessage: Message = {
        role: 'user',
        content: inputMessage,
        created_at: new Date().toISOString()
      };

      const updatedMessages = [...currentChat.messages, userMessage];
      await updateChat(currentChat.id, updatedMessages);
      setCurrentChat({ ...currentChat, messages: updatedMessages });

      // Preparar mensagens para API (excluir system)
      const chatMessages: ChatMessage[] = updatedMessages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

      setInputMessage("");

      // Chamar API do Clarêncio
      const response = await callClarencioAPI(chatMessages);

      if (response.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.message,
          created_at: new Date().toISOString()
        };
        
        const newMessages = [...updatedMessages, assistantMessage];
        await updateChat(currentChat.id, newMessages);
        setCurrentChat({ ...currentChat, messages: newMessages });

        // Verificar se deve gerar conteúdo
        if (response.shouldGenerateContent) {
          console.log('[Clarencio][Chat.tsx] Marcado para gerar conteúdo');
          setShouldGenerateContent(true);
        }
      }
    } catch (error) {
      console.error('[Clarencio][Chat.tsx] Erro ao enviar mensagem:', error);
      toast({
        title: "Erro na conversa",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToEditor = () => {
    if (!generatedContent) return;
    
    console.log('[Clarencio][Chat.tsx] Enviando conteúdo para o editor');
    
    // Store the generated content in localStorage to be picked up by the Manual page
    localStorage.setItem('clarencio_generated_content', JSON.stringify({
      content: generatedContent.content,
      seoData: {
        keyword: generatedContent.keyword,
        slug: generatedContent.slug,
        metaDescription: generatedContent.metaDescription,
        altText: generatedContent.altText,
        excerpt: generatedContent.excerpt,
        category: generatedContent.category,
        title: generatedContent.title
      }
    }));
    
    toast({
      title: "Conteúdo enviado!",
      description: "O conteúdo foi enviado para o editor. Redirecionando...",
    });
    
    navigate('/manual');
  };

  const handleGenerateContent = async () => {
    if (shouldGenerateContent) {
      await generateFinalContent();
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
            <Button
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Chat
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {chatHistories.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentChat?.id === chat.id
                      ? 'bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600'
                      : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
                  }`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="flex-1 min-w-0">
                    {editingChatId === chat.id ? (
                      <input
                        type="text"
                        value={newChatTitle}
                        onChange={(e) => setNewChatTitle(e.target.value)}
                        onBlur={() => handleRenameChat(chat.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameChat(chat.id)}
                        autoFocus
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent border-b border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {chat.title.length > 30 ? chat.title.substring(0, 30) + '...' : chat.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chat.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editingChatId !== chat.id) {
                          setEditingChatId(chat.id);
                          setNewChatTitle(chat.title);
                        }
                      }}
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto w-full">
                  {currentChat.messages
                    .filter(m => m.role !== 'system') // Não exibir mensagens system
                    .map((message, index) => (
                    <div
                      key={index}
                      className={`w-full flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-10 animate-fade-in`}
                    >
                      <div
                        className={`flex items-start w-full ${
                          message.role === 'user'
                            ? 'flex-row-reverse ml-auto max-w-[60%]'
                            : 'flex-row mr-auto max-w-[99%]'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                            message.role === 'user' ? 'bg-transparent ml-3' : 'bg-purple-500 mr-3'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="w-0 h-0 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {message.role === 'user' ? (
                          <div className="px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded-lg rounded-br-none text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                        ) : (
                          <div className="flex-1 mt-[8px]">
                            <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed">
                              {message.content}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 mr-3">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-gray-900 dark:text-gray-100 rounded-lg rounded-bl-none px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700">
                <div className="max-w-4xl mx-auto">
                  {/* Botões de ação */}
                  <div className="mb-4 flex gap-2">
                    {shouldGenerateContent && (
                      <Button
                        onClick={handleGenerateContent}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90 transition-all duration-200 hover:scale-105"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Gerar Conteúdo
                      </Button>
                    )}
                    {generatedContent && (
                      <Button
                        onClick={handleSendToEditor}
                        className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90 transition-all duration-200 hover:scale-105"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Enviar para o Editor
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isLoading}
                      className="flex-1 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-96 glass dark:bg-zinc-800 dark:text-white">
                <CardContent className="p-8 text-center">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <h2 className="text-2xl font-bold mb-2">Chat com Clarêncio</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Inicie uma conversa com o Clarêncio para criar conteúdos otimizados para SEO
                  </p>
                  <Button
                    onClick={handleNewChat}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Começar Novo Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
