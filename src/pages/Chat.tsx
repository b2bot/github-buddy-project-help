import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Send, FileText, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useChatHistory } from "@/hooks/useChatHistory";
import { generateContent } from "@/integrations/openai";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Pencil } from "lucide-react";


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
  const [chatStep, setChatStep] = useState<'initial' | 'collecting' | 'generating' | 'complete'>('initial');
  const [collectedData, setCollectedData] = useState({
    keyword: "",
    category: "",
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

  function handleRenameChat(chatId: string) {
    if (!newChatTitle.trim()) return;

    const updatedChats = chatHistories.map((chat) =>
      chat.id === chatId ? { ...chat, title: newChatTitle.trim() } : chat
    );

    setChatHistories(updatedChats);

    if (currentChat?.id === chatId) {
      setCurrentChat({ ...currentChat, title: newChatTitle.trim() });
    }

    setEditingChatId(null);
    setNewChatTitle('');
  }
  
  
  const { chatHistories, loadChatHistories, createNewChat, updateChat, deleteChat } = useChatHistory();
  const { toast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistories();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewChat = async () => {
    const newChat = await createNewChat("Novo chat");
    if (newChat) {
      setCurrentChat(newChat);
      setGeneratedContent(null);
      setChatStep('initial');
      setCollectedData({
        keyword: "",
        category: "",
        tone: "profissional",
        objective: "",
        persona: "",
        bigIdea: "",
        emotion: "",
        structure: "",
        cta: ""
      });
    }
  };

  const handleSelectChat = (chat: ChatHistory) => {
    setCurrentChat(chat);
    setGeneratedContent(null);
    setChatStep('initial');
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const getNextQuestion = () => {
    if (!collectedData.keyword) {
      return "Olá! Sou o Clarencio, seu assistente especialista em SEO e conteúdo. Vou te ajudar a criar um conteúdo incrível! 🚀\n\nPara começar, qual é a **palavra-chave principal** que você quer trabalhar?";
    }
    if (!collectedData.objective) {
      return `Perfeita escolha com "${collectedData.keyword}"! 🎯\n\nAgora me conta: **qual é o objetivo** deste conteúdo? (Ex: gerar leads, educar sobre o tema, aumentar vendas, etc.)`;
    }
    if (!collectedData.persona) {
      return "Ótimo! Agora vamos definir a **persona**. Para quem você está escrevendo? Descreva seu público-alvo ideal (idade, interesses, problemas que enfrentam, etc.)";
    }
    if (!collectedData.bigIdea) {
      return "Perfeito! Agora preciso saber da **big idea** - qual é a ideia central, o conceito principal que você quer transmitir neste conteúdo?";
    }
    if (!collectedData.emotion) {
      return "Excelente! Que **emoção** você quer despertar no seu leitor? (curiosidade, urgência, confiança, inspiração, etc.)";
    }
    if (!collectedData.structure) {
      return "Ótimo! Que **estrutura** você prefere para o conteúdo? (lista, passo a passo, comparação, storytelling, etc.)";
    }
    if (!collectedData.cta) {
      return "Última pergunta! Qual **call-to-action (CTA)** você quer incluir no final? O que o leitor deve fazer depois de ler o conteúdo?";
    }
    return null;
  };

  const processUserResponse = (message: string) => {
    const newData = { ...collectedData };
    
    if (!collectedData.keyword) {
      newData.keyword = message;
    } else if (!collectedData.objective) {
      newData.objective = message;
    } else if (!collectedData.persona) {
      newData.persona = message;
    } else if (!collectedData.bigIdea) {
      newData.bigIdea = message;
    } else if (!collectedData.emotion) {
      newData.emotion = message;
    } else if (!collectedData.structure) {
      newData.structure = message;
    } else if (!collectedData.cta) {
      newData.cta = message;
    }
    
    setCollectedData(newData);
    
    // Check if we have all data needed
    if (newData.keyword && newData.objective && newData.persona && newData.bigIdea && 
        newData.emotion && newData.structure && newData.cta) {
      setChatStep('generating');
      return true;
    }
    
    setChatStep('collecting');
    return false;
  };

  const generateFinalContent = async () => {
    try {
      setIsLoading(true);
      
      const prompt = `
        Gere um conteúdo completo seguindo o Framework Leadclinic:
        - Palavra-chave: ${collectedData.keyword}
        - Objetivo: ${collectedData.objective}
        - Persona: ${collectedData.persona}
        - Big Idea: ${collectedData.bigIdea}
        - Emoção: ${collectedData.emotion}
        - Estrutura: ${collectedData.structure}
        - CTA: ${collectedData.cta}
      `;

      const response = await generateContent({
        keyword: collectedData.keyword,
        category: collectedData.category || 'geral',
        tone: collectedData.tone,
        method: 'manual',
        sourceInput: prompt
      });

      if (response.success && response.content && response.seoData) {
        const content: GeneratedContent = {
          title: response.seoData.title || `Guia sobre ${collectedData.keyword}`,
          slug: response.seoData.slug || collectedData.keyword.toLowerCase().replace(/\s+/g, '-'),
          metaDescription: response.seoData.metaDescription || `Aprenda tudo sobre ${collectedData.keyword}`,
          altText: response.seoData.altText || `Imagem sobre ${collectedData.keyword}`,
          excerpt: response.seoData.excerpt || `Conteúdo completo sobre ${collectedData.keyword}`,
          content: response.content,
          category: collectedData.category || 'geral',
          keyword: collectedData.keyword
        };
        
        setGeneratedContent(content);
        setChatStep('complete');
        
        // Add final message with generated content
        const finalMessage: Message = {
          sender: 'assistant',
          content: `🎉 **Conteúdo gerado com sucesso!**\n\n**Título:** ${content.title}\n\n**Preview:** ${content.excerpt}\n\nO conteúdo completo está pronto! Use o botão "Enviar para o Editor" para importar tudo automaticamente.`,
          created_at: new Date().toISOString()
        };
        
        if (currentChat) {
          const updatedMessages = [...currentChat.messages, finalMessage];
          await updateChat(currentChat.id, updatedMessages);
          setCurrentChat({ ...currentChat, messages: updatedMessages });
        }
      }
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
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
      await handleNewChat();
      return;
    }

    const userMessage: Message = {
      sender: 'user',
      content: inputMessage,
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...currentChat.messages, userMessage];
    await updateChat(currentChat.id, updatedMessages);
    setCurrentChat({ ...currentChat, messages: updatedMessages });

    const isComplete = processUserResponse(inputMessage);
    setInputMessage("");

    if (isComplete) {
      // Generate final content
      await generateFinalContent();
    } else {
      // Send next question
      const nextQuestion = getNextQuestion();
      if (nextQuestion) {
        const assistantMessage: Message = {
          sender: 'assistant',
          content: nextQuestion,
          created_at: new Date().toISOString()
        };
        
        const newMessages = [...updatedMessages, assistantMessage];
        await updateChat(currentChat.id, newMessages);
        setCurrentChat({ ...currentChat, messages: newMessages });
      }
    }
  };

  const handleSendToEditor = () => {
    if (!generatedContent) return;
    
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

  const startInitialChat = async () => {
    if (!currentChat) return;
    
    const welcomeMessage: Message = {
      sender: 'assistant',
      content: getNextQuestion() || "Olá! Como posso te ajudar hoje?",
      created_at: new Date().toISOString()
    };
    
    const updatedMessages = [...currentChat.messages, welcomeMessage];
    await updateChat(currentChat.id, updatedMessages);
    setCurrentChat({ ...currentChat, messages: updatedMessages });
    setChatStep('collecting');
  };

  useEffect(() => {
    if (currentChat && currentChat.messages.length === 0 && chatStep === 'initial') {
      startInitialChat();
    }
  }, [currentChat]);

return (
  <Layout>
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
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
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
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
                {currentChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`w-full flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-10`}
                  >
                    <div
                      className={`flex items-start w-full ${
                        message.sender === 'user'
                          ? 'flex-row-reverse ml-auto max-w-[60%]'
                          : 'flex-row mr-auto max-w-[99%]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                          message.sender === 'user' ? 'bg-transparent ml-3' : 'bg-purple-500 mr-3'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <User className="w-0 h-0 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {message.sender === 'user' ? (
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
                  <div className="flex justify-start">
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
                {generatedContent && chatStep === 'complete' && (
                  <div className="mb-4">
                    <Button
                      onClick={handleSendToEditor}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Enviar para o Editor
                    </Button>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage() }
                    disabled={isLoading}
                    className="flex-1 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-purple-800 hover:bg-blue-600 text-white dark:bg-blue-800 hover:bg-blue-600 text-white"
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
                <h2 className="text-2xl font-bold mb-2">Chat com Clarencio</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Inicie uma conversa com o Clarencio para criar conteúdos otimizados para SEO
                </p>
                <Button
                  onClick={handleNewChat}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
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
