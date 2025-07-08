
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

export default function CreativeAssistantLinkBio() {
  const [formData, setFormData] = useState<any>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `🚀 ${formData.projectName || "Projeto Incrível"}\n\n${formData.description || "Transformando vidas através de conteúdo de qualidade"}\n\n✨ ${formData.cta || "Clique no link abaixo"}\n\n🔗 ${formData.links || "www.exemplo.com"}`;
      setGeneratedContent(mockContent);
      
      toast({
        title: "Link da Bio gerado com sucesso!",
        description: "Sua bio está pronta para uso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar bio",
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
      description: "Bio copiada para a área de transferência.",
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
            <h1 className="text-3xl font-bold">Link da Bio</h1>
            <p className="text-muted-foreground">Crie bios de impacto para Linktree e redes sociais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Bio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="projectName">Nome do projeto/marca</Label>
                <Input
                  id="projectName"
                  placeholder="Ex: Marketing Pro"
                  value={formData.projectName || ""}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição curta</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Ajudamos empreendedores a crescer online"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="links">Links principais</Label>
                <Textarea
                  id="links"
                  placeholder="Ex: www.seusite.com, Instagram: @seuusuario"
                  value={formData.links || ""}
                  onChange={(e) => setFormData({...formData, links: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="cta">Call to Action</Label>
                <Input
                  id="cta"
                  placeholder="Ex: Acesse nossos links, Conheça nossos serviços"
                  value={formData.cta || ""}
                  onChange={(e) => setFormData({...formData, cta: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="style">Estilo visual</Label>
                <Select value={formData.style || ""} onValueChange={(value) => setFormData({...formData, style: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="creative">Criativo</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="fun">Divertido</SelectItem>
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
                    Gerar Bio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Bio Gerada</CardTitle>
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
                  Copiar Bio
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
