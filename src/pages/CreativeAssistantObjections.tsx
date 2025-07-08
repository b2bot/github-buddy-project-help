
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function CreativeAssistantObjections() {
  const [formData, setFormData] = useState<any>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `**Quebra de Objeção: ${formData.objection || "Objeção do cliente"}**\n\n**Resposta 1 - Prova Social:**\nMais de 1.000 clientes já transformaram seus resultados com ${formData.product || "nosso produto"}. Veja os depoimentos em nosso site.\n\n**Resposta 2 - Urgência:**\nEssa oferta especial é limitada. Garante já sua vaga antes que seja tarde.\n\n**Resposta 3 - Autoridade:**\nCom mais de 10 anos de experiência no mercado, sabemos exatamente como resolver esse problema.`;
      setGeneratedContent(mockContent);
      
      toast({
        title: "Quebra de objeções gerada com sucesso!",
        description: "Suas respostas estratégicas estão prontas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar respostas",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Respostas copiadas para a área de transferência.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/creative-assistant')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quebra de Objeções</h1>
            <p className="text-muted-foreground">Respostas estratégicas para objeções de vendas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Quebra de Objeções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="objection">Objeção do cliente</Label>
                <Textarea
                  id="objection"
                  placeholder="Ex: É muito caro, Não tenho tempo, Não funciona para mim"
                  value={formData.objection || ""}
                  onChange={(e) => setFormData({...formData, objection: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="product">Produto/serviço</Label>
                <Input
                  id="product"
                  placeholder="Ex: Curso de Marketing Digital"
                  value={formData.product || ""}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="audience">Público-alvo</Label>
                <Input
                  id="audience"
                  placeholder="Ex: Empreendedores iniciantes"
                  value={formData.audience || ""}
                  onChange={(e) => setFormData({...formData, audience: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="tone">Tom da resposta</Label>
                <Select value={formData.tone || ""} onValueChange={(value) => setFormData({...formData, tone: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empathetic">Empático</SelectItem>
                    <SelectItem value="confident">Confiante</SelectItem>
                    <SelectItem value="educational">Educativo</SelectItem>
                    <SelectItem value="reassuring">Tranquilizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select value={formData.language || ""} onValueChange={(value) => setFormData({...formData, language: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Respostas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Respostas Geradas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent)}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Respostas
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
