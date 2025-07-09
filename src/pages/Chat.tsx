import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message as MessageType } from '@/hooks/useChatHistory-COM-SUPABASE';
import { useChatHistory } from '@/hooks/useChatHistory-COM-SUPABASE';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react';
import { openai } from '@/integrations/openai';

interface Message extends MessageType {
  id: string;
  timestamp: Date;
}

export default function Chat() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { chatHistories, saveChatHistory, updateChatHistory, loading } = useChatHistory();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    if (chatHistories.length > 0) {
      setSelectedChat(chatHistories[0].id);
      setMessages(chatHistories[0].messages as Message[]);
    }
  }, [chatHistories]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      created_at: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await openai.generateContent({
        keyword: inputValue,
        tone: 'conversational',
        length: 'medium'
      });

      if (response.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          sender: 'assistant',
          created_at: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Erro ao gerar resposta');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        sender: 'assistant',
        created_at: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (selectedChat) {
        updateChatHistory(selectedChat, 'Chat Title', messages);
      } else {
        saveChatHistory('Chat Title', messages);
      }
    }
  }, [messages, selectedChat, updateChatHistory, saveChatHistory]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="space-y-1">
            {chatHistories.map(chat => (
              <button
                key={chat.id}
                className={`flex items-center space-x-2 p-3 w-full hover:bg-gray-100 rounded-md ${selectedChat === chat.id ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  setSelectedChat(chat.id);
                  setMessages(chat.messages as Message[]);
                }}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{chat.title}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-xl px-4 py-2 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-2 bg-gray-200 text-gray-800">
                    Carregando...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}><Send className="h-4 w-4"/></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
