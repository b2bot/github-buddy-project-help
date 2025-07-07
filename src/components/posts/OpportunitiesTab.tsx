import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openai } from "@/integrations/openai";

interface SuggestedPost {
  title: string;
  estimatedWords: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

export function OpportunitiesTab() {
  const [keyword, setKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedPost[]>([]);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma palavra-chave para gerar sugestões.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const titles = await openai.generateTitles(keyword, 6);
      
      const newSuggestions: SuggestedPost[] = titles.map(title => ({
        title,
        estimatedWords: Math.floor(Math.random() * (1500 - 800) + 800),
        difficulty: ['Fácil', 'Médio', 'Difícil'][Math.floor(Math.random() * 3)] as any
      }));
      
      setSuggestions(newSuggestions);
      
      toast({
        title: "Sugestões geradas!",
        description: `${titles.length} oportunidades de conteúdo criadas.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar sugestões. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addToQueue = (suggestion: SuggestedPost) => {
    toast({
      title: "Adicionado à fila!",
      description: `"${suggestion.title}" foi adicionado à fila de geração.`
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'Médio': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Difícil': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Gerar Oportunidades de Conteúdo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="keyword">Palavra-chave</Label>
              <Input
                id="keyword"
                placeholder="Ex: marketing digital, SEO, vendas online..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateSuggestions()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={generateSuggestions} 
                disabled={isGenerating}
                className="gradient-primary"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Sugestões via IA
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Oportunidades Sugeridas ({suggestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{suggestion.title}</h4>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <span>~{suggestion.estimatedWords} palavras</span>
                      <Badge className={getDifficultyColor(suggestion.difficulty)}>
                        {suggestion.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addToQueue(suggestion)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar à Fila
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {suggestions.length === 0 && !isGenerating && (
        <Card className="glass">
          <CardContent className="text-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Descubra Novas Oportunidades</h3>
            <p className="text-muted-foreground mb-4">
              Use nossa IA para descobrir tópicos relevantes e gerar ideias de conteúdo baseadas em palavras-chave.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}