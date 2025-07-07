
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openai } from "@/integrations/openai";

interface CreatePostWizardProps {
  onImport: (content: string) => void;
}

interface GeneratedTitle {
  title: string;
  description: string;
  selected: boolean;
}

interface GeneratedParagraph {
  content: string;
  selected: boolean;
}

export function CreatePostWizard({ onImport }: CreatePostWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [audienceInterests, setAudienceInterests] = useState("");
  const [generatedTitles, setGeneratedTitles] = useState<GeneratedTitle[]>([]);
  const [generatedParagraphs, setGeneratedParagraphs] = useState<GeneratedParagraph[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateTitles = async () => {
    if (!keyword.trim() || !audienceInterests.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a palavra-chave e os interesses do público.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const titles = await openai.generateTitles(keyword, 7);
      const titlesWithDescription = titles.map(title => ({
        title,
        description: `Artigo otimizado para "${keyword}" focado nos interesses do público-alvo.`,
        selected: false
      }));
      
      setGeneratedTitles(titlesWithDescription);
      setCurrentStep(2);
      
      toast({
        title: "Títulos gerados!",
        description: "Selecione os títulos que deseja usar."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar títulos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateParagraphs = async () => {
    const selectedTitles = generatedTitles.filter(t => t.selected);
    
    if (selectedTitles.length === 0) {
      toast({
        title: "Selecione títulos",
        description: "Selecione pelo menos um título para gerar parágrafos.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const paragraphs: GeneratedParagraph[] = [];
      
      for (const title of selectedTitles) {
        // Generate 2-3 paragraphs per title
        for (let i = 0; i < 3; i++) {
          const paragraph = await openai.generateParagraph(`${title.title} - ${audienceInterests}`);
          paragraphs.push({
            content: paragraph,
            selected: false
          });
        }
      }
      
      setGeneratedParagraphs(paragraphs);
      setCurrentStep(3);
      
      toast({
        title: "Parágrafos gerados!",
        description: "Selecione os parágrafos que deseja usar."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar parágrafos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalizeContent = () => {
    const selectedTitles = generatedTitles.filter(t => t.selected);
    const selectedParagraphs = generatedParagraphs.filter(p => p.selected);
    
    if (selectedTitles.length === 0 || selectedParagraphs.length === 0) {
      toast({
        title: "Selecione conteúdo",
        description: "Selecione pelo menos um título e um parágrafo.",
        variant: "destructive"
      });
      return;
    }

    // Build final content
    let finalContent = "";
    
    // Add main title
    finalContent += `<h1>${selectedTitles[0].title}</h1>`;
    
    // Add paragraphs
    selectedParagraphs.forEach(paragraph => {
      finalContent += `<p>${paragraph.content}</p>`;
    });
    
    // Add other titles as H2s
    selectedTitles.slice(1).forEach(title => {
      finalContent += `<h2>${title.title}</h2>`;
      finalContent += `<p>Desenvolva este tópico aqui...</p>`;
    });

    onImport(finalContent);
    setCurrentStep(4);
    
    toast({
      title: "Conteúdo carregado!",
      description: "O rascunho foi carregado no editor."
    });
  };

  const toggleTitleSelection = (index: number) => {
    setGeneratedTitles(prev => 
      prev.map((title, i) => 
        i === index ? { ...title, selected: !title.selected } : title
      )
    );
  };

  const toggleParagraphSelection = (index: number) => {
    setGeneratedParagraphs(prev => 
      prev.map((paragraph, i) => 
        i === index ? { ...paragraph, selected: !paragraph.selected } : paragraph
      )
    );
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setKeyword("");
    setAudienceInterests("");
    setGeneratedTitles([]);
    setGeneratedParagraphs([]);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep ? 'bg-primary text-white' :
              step < currentStep ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            {step < 4 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Context */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1 - Contexto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyword">Palavra-chave Principal</Label>
              <Input
                id="keyword"
                placeholder="Ex: marketing digital para pequenas empresas"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            
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
            
            <Button 
              onClick={handleGenerateTitles}
              disabled={isGenerating}
              className="w-full bg-gradient-primary text-white hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Títulos...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Títulos
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Title Selection */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2 - Seleção de Títulos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedTitles.map((title, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={title.selected}
                  onCheckedChange={() => toggleTitleSelection(index)}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{title.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{title.description}</p>
                </div>
              </div>
            ))}
            
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
                onClick={handleGenerateParagraphs}
                disabled={isGenerating}
                className="flex-1 bg-gradient-primary text-white hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    Gerar Parágrafos
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Paragraph Selection */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3 - Seleção de Parágrafos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedParagraphs.map((paragraph, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={paragraph.selected}
                  onCheckedChange={() => toggleParagraphSelection(index)}
                />
                <div className="flex-1">
                  <p className="text-sm">{paragraph.content}</p>
                </div>
              </div>
            ))}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(2)}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button 
                onClick={handleFinalizeContent}
                className="flex-1 bg-gradient-primary text-white hover:opacity-90"
              >
                Finalizar Conteúdo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Success */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Conteúdo Criado com Sucesso!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <p>Seu rascunho foi carregado no editor. Você pode continuar editando na aba "Editor".</p>
            
            <Button 
              onClick={resetWizard}
              variant="outline"
              className="w-full"
            >
              Criar Novo Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
