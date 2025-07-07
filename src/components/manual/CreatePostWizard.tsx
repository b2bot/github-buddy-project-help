import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, ChevronRight, ChevronLeft, CheckCircle, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openai, GenerateContentRequest } from "@/integrations/openai";

interface CreatePostWizardProps {
  onImport: (content: string, seoData?: SEOData) => void;
}

interface SEOData {
  keyword: string;
  slug: string;
  metaDescription: string;
  altText: string;
  excerpt: string;
  category: string;
}

export function CreatePostWizard({ onImport }: CreatePostWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("profissional");
  const [method, setMethod] = useState<'manual' | 'public_interest' | 'youtube' | 'url'>('manual');
  const [sourceInput, setSourceInput] = useState("");
  const [audienceInterests, setAudienceInterests] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerateContent = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha a palavra-chave principal.",
        variant: "destructive"
      });
      return;
    }

    if (method === 'youtube' && !sourceInput.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Forneça a transcrição do vídeo do YouTube.",
        variant: "destructive"
      });
      return;
    }

    if (method === 'url' && !sourceInput.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Forneça a URL ou conteúdo base.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const request: GenerateContentRequest = {
        keyword: keyword.trim(),
        category: category || 'Geral',
        tone,
        method,
        sourceInput: method === 'public_interest' ? audienceInterests : sourceInput
      };

      console.log('Enviando requisição para gerar conteúdo:', request);
      
      const result = await openai.generateContent(request);
      
      console.log('Conteúdo gerado:', result);
      
      setGeneratedContent(result);
      setCurrentStep(2);
      
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: "Revise o conteúdo e os dados de SEO antes de importar.",
      });
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      toast({
        title: "Erro ao gerar conteúdo",
        description: error instanceof Error ? error.message : "Erro desconhecido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportContent = () => {
    if (!generatedContent) {
      toast({
        title: "Nenhum conteúdo gerado",
        description: "Gere o conteúdo primeiro antes de importar.",
        variant: "destructive"
      });
      return;
    }

    const seoData: SEOData = {
      keyword: keyword,
      slug: generatedContent.slug,
      metaDescription: generatedContent.metaDescription,
      altText: generatedContent.altText,
      excerpt: generatedContent.excerpt,
      category: category || 'Geral'
    };

    onImport(generatedContent.content, seoData);
    setCurrentStep(3);
    
    toast({
      title: "Conteúdo importado!",
      description: "O artigo e os dados de SEO foram carregados no editor.",
    });
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setKeyword("");
    setCategory("");
    setTone("profissional");
    setMethod('manual');
    setSourceInput("");
    setAudienceInterests("");
    setGeneratedContent(null);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep ? 'bg-primary text-white' :
              step < currentStep ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            {step < 3 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Configuração */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Configuração do Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyword">Palavra-chave Principal *</Label>
              <Input
                id="keyword"
                placeholder="Ex: marketing digital para pequenas empresas"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: Marketing Digital, SEO, Redes Sociais"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tone">Tom do Conteúdo</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="otimista">Otimista</SelectItem>
                  <SelectItem value="técnico">Técnico</SelectItem>
                  <SelectItem value="educativo">Educativo</SelectItem>
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
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Conteúdo...
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

      {/* Step 2: Revisão do Conteúdo */}
      {currentStep === 2 && generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Revisão do Conteúdo Gerado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Título</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{generatedContent.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Slug</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{generatedContent.slug}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">Meta Description</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{generatedContent.metaDescription}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Alt Text da Imagem</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{generatedContent.altText}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Excerpt</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{generatedContent.excerpt}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Prévia do Conteúdo</Label>
              <div 
                className="text-sm bg-gray-50 p-4 rounded max-h-60 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: generatedContent.content.substring(0, 500) + '...' }}
              />
            </div>

            {generatedContent.internalLinks && generatedContent.internalLinks.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Links Internos Sugeridos</Label>
                <ul className="text-sm bg-gray-50 p-2 rounded">
                  {generatedContent.internalLinks.map((link: string, index: number) => (
                    <li key={index} className="text-blue-600 hover:underline">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
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
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Conteúdo Importado com Sucesso!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <p>Seu artigo foi carregado no editor com todos os dados de SEO preenchidos automaticamente.</p>
            <p className="text-sm text-gray-600">
              Você pode continuar editando na aba "Editor" e verificar a pontuação de SEO na barra lateral.
            </p>
            
            <Button 
              onClick={resetWizard}
              variant="outline"
              className="w-full"
            >
              Criar Novo Artigo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

