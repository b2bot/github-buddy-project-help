import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateContent, type GenerateContentResponse } from "@/integrations/openai";

interface SEOData {
  keyword: string;
  slug: string;
  metaDescription: string;
  altText: string;
  excerpt: string;
  category: string;
  title?: string;
}

interface CreatePostWizardProps {
  onImport: (content: string, seoData?: SEOData) => void;
}

export function CreatePostWizard({ onImport }: CreatePostWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("profissional");
  const [method, setMethod] = useState("manual");
  const [audienceInterests, setAudienceInterests] = useState("");
  const [sourceInput, setSourceInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GenerateContentResponse | null>(null);
  const { toast } = useToast();

  const generatePost = async () => {
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
      console.log('🚀 Iniciando geração com parâmetros:', {
        keyword,
        category: category || 'geral',
        tone,
        method,
        sourceInput: method === 'public_interest' ? audienceInterests : sourceInput
      });

      const response = await generateContent({
        keyword,
        category: category || 'geral',
        tone,
        method,
        sourceInput: method === 'public_interest' ? audienceInterests : sourceInput
      });

      console.log('✅ Resposta recebida:', {
        success: response.success,
        source: response.source,
        hasContent: !!response.content,
        hasSeoData: !!response.seoData
      });

      if (response.success && response.content && response.seoData) {
        setGeneratedContent(response);
        setCurrentStep(2);
        
        toast({
          title: "Conteúdo gerado com sucesso!",
          description: `Artigo criado via ${response.source === 'assistant' ? 'Assistant Clarencio' : 'Framework Leadclinic'}`,
        });
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('❌ Erro na geração:', error);
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o conteúdo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportContent = () => {
    if (!generatedContent || !generatedContent.seoData) {
      toast({
        title: "Nenhum conteúdo gerado",
        description: "Gere o conteúdo primeiro antes de importar.",
        variant: "destructive"
      });
      return;
    }

    console.log('📋 Importando conteúdo e dados SEO:', {
      hasContent: !!generatedContent.content,
      seoData: generatedContent.seoData
    });

    // Garantir que todos os campos SEO estão preenchidos
    const seoData: SEOData = {
      keyword: generatedContent.seoData.keyword || keyword,
      slug: generatedContent.seoData.slug || keyword.toLowerCase().replace(/\s+/g, '-'),
      metaDescription: generatedContent.seoData.metaDescription || `Artigo sobre ${keyword}`,
      altText: generatedContent.seoData.altText || `Imagem sobre ${keyword}`,
      excerpt: generatedContent.seoData.excerpt || `Conteúdo sobre ${keyword}`,
      category: generatedContent.seoData.category || category || 'geral',
      title: generatedContent.seoData.title || `Artigo sobre ${keyword}`
    };

    console.log('✅ Dados SEO preparados:', seoData);

    // Chamar função de importação do componente pai
    onImport(generatedContent.content, seoData);
    setCurrentStep(3);
    
    toast({
      title: "Conteúdo importado com sucesso!",
      description: "O artigo e todos os dados de SEO foram carregados no editor.",
    });
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setKeyword("");
    setCategory("");
    setTone("profissional");
    setMethod("manual");
    setAudienceInterests("");
    setSourceInput("");
    setGeneratedContent(null);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Configuração */}
      {currentStep === 1 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Criar Conteúdo com IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyword">Palavra-chave Principal *</Label>
              <Input
                id="keyword"
                placeholder="Ex: marketing digital, SEO, vendas online..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: marketing, vendas, tecnologia..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tone">Tom do Conteúdo</Label>
              <Select value={tone} onValueChange={(value) => setTone(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="técnico">Técnico</SelectItem>
                  <SelectItem value="educativo">Educativo</SelectItem>
                  <SelectItem value="persuasivo">Persuasivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="method">Método de Geração</Label>
              <Select value={method} onValueChange={(value: any) => setMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual (baseado na palavra-chave)</SelectItem>
                  <SelectItem value="public_interest">Interesses do Público</SelectItem>
                  <SelectItem value="youtube">Transcrição do YouTube</SelectItem>
                  <SelectItem value="url">Conteúdo de URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {method === 'public_interest' && (
              <div>
                <Label htmlFor="audience">Interesses do Público</Label>
                <Textarea
                  id="audience"
                  placeholder="Descreva os interesses, problemas e necessidades do seu público-alvo..."
                  value={audienceInterests}
                  onChange={(e) => setAudienceInterests(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {(method === 'youtube' || method === 'url') && (
              <div>
                <Label htmlFor="source">
                  {method === 'youtube' ? 'Transcrição do YouTube' : 'URL ou Conteúdo Base'}
                </Label>
                <Textarea
                  id="source"
                  placeholder={
                    method === 'youtube' 
                      ? "Cole aqui a transcrição do vídeo do YouTube..."
                      : "Cole aqui a URL ou o conteúdo que servirá de base..."
                  }
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  rows={6}
                />
              </div>
            )}

            <Button 
              onClick={generatePost} 
              disabled={isGenerating || !keyword.trim()}
              className="w-full gradient-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando conteúdo com IA...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Conteúdo com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Revisão */}
      {currentStep === 2 && generatedContent && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Revisão do Conteúdo Gerado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Título</Label>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  {generatedContent.seoData?.title || 'Título não gerado'}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Slug</Label>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  {generatedContent.seoData?.slug || 'Slug não gerado'}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Meta Description</Label>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  {generatedContent.seoData?.metaDescription || 'Meta description não gerada'}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Alt Text da Imagem</Label>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  {generatedContent.seoData?.altText || 'Alt text não gerado'}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Excerpt</Label>
              <div className="text-sm bg-gray-50 p-2 rounded">
                {generatedContent.seoData?.excerpt || 'Excerpt não gerado'}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Prévia do Conteúdo</Label>
              <div 
                className="text-sm bg-gray-50 p-4 rounded max-h-60 overflow-y-auto"
                dangerouslySetInnerHTML={{ 
                  __html: generatedContent.content ? 
                    (generatedContent.content.length > 500 ? 
                      generatedContent.content.substring(0, 500) + '...' : 
                      generatedContent.content
                    ) : 'Conteúdo não gerado'
                }}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Fonte:</strong> {
                  generatedContent.source === 'assistant' ? 'Assistant Clarencio (OpenAI)' :
                  generatedContent.source === 'framework_leadclinic' ? 'Framework Leadclinic' :
                  'Fallback'
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button 
                onClick={handleImportContent}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90"
              >
                Importar para Editor
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Sucesso */}
      {currentStep === 3 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-center text-green-600 flex items-center justify-center space-x-2">
              <CheckCircle className="h-6 w-6" />
              <span>Conteúdo Importado com Sucesso!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              O artigo e todos os dados de SEO foram carregados no editor. 
              Você pode agora editar o conteúdo e ajustar as configurações conforme necessário.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Campos preenchidos automaticamente:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ Conteúdo do artigo</li>
                <li>✅ Palavra-chave principal</li>
                <li>✅ Slug da URL</li>
                <li>✅ Meta description</li>
                <li>✅ Alt text da imagem</li>
                <li>✅ Excerpt/resumo</li>
              </ul>
            </div>
            
            <Button 
              onClick={resetWizard}
              variant="outline"
              className="w-full"
            >
              Criar Novo Conteúdo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
