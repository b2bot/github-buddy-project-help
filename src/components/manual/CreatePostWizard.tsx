
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipTapEditor } from './TipTapEditor';
import { Sparkles, Calendar, Clock, FileText, Image, Wand2 } from 'lucide-react';
import { openai } from '@/integrations/openai';
import { useToast } from '@/hooks/use-toast';

interface CreatePostWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: any) => void;
}

type AIProvider = "openai" | "fallback" | "fallback_error";

export function CreatePostWizard({ isOpen, onClose, onPostCreated }: CreatePostWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [provider, setProvider] = useState<AIProvider>("openai");
  const { toast } = useToast();
  const editorRef = useRef<any>(null);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Palavra-chave obrigatória",
        description: "Digite uma palavra-chave para gerar o conteúdo.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate title if not provided
      if (!title.trim()) {
        const titleResponse = await openai.generateTitles(keyword, 1);
        if (titleResponse.success && titleResponse.titles.length > 0) {
          setTitle(titleResponse.titles[0]);
        }
      }

      // Generate content
      const response = await openai.generateContent({
        keyword,
        type: 'post',
        tone: 'professional',
        length: 'medium'
      });

      if (response.success) {
        setContent(response.content);
        setProvider(response.provider as AIProvider);
        
        // Show provider-specific messages
        if (response.provider === "openai") {
          toast({
            title: "Conteúdo gerado com sucesso!",
            description: "Usando OpenAI GPT-4",
          });
        } else {
          toast({
            title: "Conteúdo gerado!",
            description: "Usando sistema alternativo",
          });
        }
      } else {
        throw new Error(response.error || 'Erro ao gerar conteúdo');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erro ao gerar conteúdo",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Assistente de Criação</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">
                <Wand2 className="h-4 w-4 mr-2" />
                Gerar com IA
              </TabsTrigger>
              <TabsTrigger value="manual">
                <FileText className="h-4 w-4 mr-2" />
                Criar Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Configuração da IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Palavra-chave principal *
                    </label>
                    <Input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Ex: marketing digital para pequenas empresas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Título (opcional)
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Será gerado automaticamente se vazio"
                    />
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !keyword.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Gerar Conteúdo
                      </>
                    )}
                  </Button>

                  {content && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={provider === "openai" ? "default" : "secondary"}>
                          {provider === "openai" ? "OpenAI GPT-4" : "Sistema Alternativo"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {content && (
                <Card>
                  <CardHeader>
                    <CardTitle>Conteúdo Gerado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TipTapEditor
                      ref={editorRef}
                      content={content}
                      onChange={setContent}
                      placeholder="Conteúdo será exibido aqui..."
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Criar Post Manual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Título
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Digite o título do post"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Palavra-chave
                    </label>
                    <Input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Palavra-chave principal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Conteúdo
                    </label>
                    <TipTapEditor
                      ref={editorRef}
                      content={content}
                      onChange={setContent}
                      placeholder="Digite o conteúdo do post..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 border-t bg-muted/50">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (onPostCreated) {
                  onPostCreated({
                    title,
                    content,
                    keyword,
                    provider
                  });
                }
                onClose();
              }}
              disabled={!title.trim() || !content.trim()}
            >
              Criar Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
