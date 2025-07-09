
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, Sparkles, History, Trash2 } from 'lucide-react';
import { Layout } from "@/components/layout/Layout";
import { openai } from '@/integrations/openai';
import { useToast } from "@/hooks/use-toast";
import { useChatHistory, type Message } from '@/hooks/useChatHistory-COM-SUPABASE';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      content: 'Olá! Sou seu assistente de IA especializado em SEO e marketing digital. Como posso ajudá-lo hoje?',
      created_at: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const { 
    chatHistories, 
    loading: historyLoading, 
    saveChatHistory, 
    updateChatHistory, 
    deleteChatHistory 
  } = useChatHistory();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      sender: 'user',
      content: input.trim(),
      created_at: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await openai.generateContent({
        keyword: input.trim(),
        type: 'chat',
        tone: 'helpful',
        length: 'medium'
      });

      const assistantMessage: Message = {
        sender: 'assistant',
        content: response.success ? response.content : 'Desculpe, ocorreu um erro. Tente novamente.',
        created_at: new Date()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Save or update chat history
      if (currentChatId) {
        await updateChatHistory(currentChatId, getConversationTitle(finalMessages), finalMessages);
      } else {
        const savedChat = await saveChatHistory(getConversationTitle(finalMessages), finalMessages);
        if (savedChat) {
          setCurrentChatId(savedChat.id);
        }
      }

    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        sender: 'assistant',
        content: 'Desculpe, ocorreu um erro inesperado. Tente novamente.',
        created_at: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro na conversa",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationTitle = (msgs: Message[]) => {
    const firstUserMessage = msgs.find(m => m.sender === 'user');
    return firstUserMessage ? 
      firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '') :
      'Nova Conversa';
  };

  const loadChatHistory = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  const startNewChat = () => {
    setMessages([{
      sender: 'assistant',
      content: 'Olá! Sou seu assistente de IA especializado em SEO e marketing digital. Como posso ajudá-lo hoje?',
      created_at: new Date()
    }]);
    setCurrentChatId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-120px)] gap-4">
        {/* Sidebar com histórico */}
        <div className="w-80 border-r bg-muted/30 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <History className="h-4 w-4" />
              Conversas
            </h3>
            <Button onClick={startNewChat} size="sm" variant="outline">
              Nova
            </Button>
          </div>
          
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {historyLoading ? (
                <div className="text-sm text-muted-foreground">Carregando...</div>
              ) : chatHistories.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhuma conversa ainda</div>
              ) : (
                chatHistories.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                      currentChatId === chat.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div onClick={() => loadChatHistory(chat.id)} className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {chat.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(chat.updated_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatHistory(chat.id);
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col">
          {/* Header do chat */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Assistente IA</h2>
              <Badge variant="secondary" className="ml-auto">
                <Sparkles className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>

          {/* Mensagens */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <Card className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50'
                  }`}>
                    <CardContent className="p-3">
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.created_at.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">Pensando...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Input */}
          <div className="p-4 bg-muted/30">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta sobre SEO, marketing digital ou criação de conteúdo..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
