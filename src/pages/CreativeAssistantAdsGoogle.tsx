
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

export default function CreativeAssistantAdsGoogle() {
  const [formData, setFormData] = useState<any>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `**Headlines:**\n1. ${formData.product || "Produto Premium"} - Palavra-chave: ${formData.keyword || "exemplo"}\n2. Melhor ${formData.product || "solução"} para ${formData.audience || "você"}\n3. ${formData.product || "Produto"} com Resultados Garantidos\n\n**Descrições:**\n1. Descubra como ${formData.product || "nosso produto"} pode transformar seus resultados. ${formData.cta || "Clique aqui!"}\n2. Solução completa para ${formData.audience || "seu negócio"}. Resultados comprovados.`;
      setGeneratedContent(mockContent);
      
      toast({
        title: "Anúncio Google gerado com sucesso!",
        description: "Seu anúncio está pronto para uso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar anúncio",
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
      description: "Anúncio copiado para a área de transferência.",
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
            <h1 className="text-3xl font-bold">Anúncio para Google Ads</h1>
            <p className="text-muted-foreground">Gere headlines e descrições otimizadas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Anúncio Google</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="product">Produto ou serviço</Label>
                <Input
                  id="product"
                  placeholder="Ex: Curso de Marketing Digital"
                  value={formData.product || ""}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category || ""} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="technology">Tecnologia</SelectItem>
                    <SelectItem value="health">Saúde</SelectItem>
                    <SelectItem value="business">Negócios</SelectItem>
                    <SelectItem value="lifestyle">Estilo de Vida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="keyword">Palavra-chave principal</Label>
                <Input
                  id="keyword"
                  placeholder="Ex: marketing digital"
                  value={formData.keyword || ""}
                  onChange={(e) => setFormData({...formData, keyword: e.target.value})}
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
                <Label htmlFor="cta">Call to Action (CTA)</Label>
                <Input
                  id="cta"
                  placeholder="Ex: Saiba mais, Compre agora, Cadastre-se"
                  value={formData.cta || ""}
                  onChange={(e) => setFormData({...formData, cta: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="region">Região</Label>
                <Select value={formData.region || ""} onValueChange={(value) => setFormData({...formData, region: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="br">Brasil</SelectItem>
                    <SelectItem value="us">Estados Unidos</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
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
                    Gerar Anúncio Google
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Anúncio Google Gerado</CardTitle>
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
                  Copiar Anúncio
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
