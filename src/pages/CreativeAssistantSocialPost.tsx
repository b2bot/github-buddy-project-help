
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function CreativeAssistantSocialPost() {
  const [formData, setFormData] = useState<any>({
    platforms: []
  });
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation - replace with actual AI integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `🚀 ${formData.description || "Novo post incrível!"}\n\n${formData.includeEmojis ? "✨ " : ""}Conteúdo envolvente para suas redes sociais!\n\n#marketing #socialmedia ${formData.hashtags || ""}`;
      setGeneratedContent(mockContent);
      
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: "Seu post está pronto para uso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar conteúdo",
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
      description: "Conteúdo copiado para a área de transferência.",
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
            <h1 className="text-3xl font-bold">Social Media Post</h1>
            <p className="text-muted-foreground">Crie posts cativantes para redes sociais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description">Descreva o que você gostaria de gerar</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Post sobre dicas de produtividade..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.includeEmojis || false}
                  onCheckedChange={(checked) => setFormData({...formData, includeEmojis: checked})}
                />
                <Label>Incluir Emojis</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.generateImage || false}
                  onCheckedChange={(checked) => setFormData({...formData, generateImage: checked})}
                />
                <Label>Gerar Imagem (Em breve)</Label>
              </div>

              <div>
                <Label>Redes sociais</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Facebook", "Instagram", "LinkedIn", "X"].map((platform) => (
                    <Badge
                      key={platform}
                      variant={formData.platforms?.includes(platform) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const platforms = formData.platforms || [];
                        const updated = platforms.includes(platform)
                          ? platforms.filter((p: string) => p !== platform)
                          : [...platforms, platform];
                        setFormData({...formData, platforms: updated});
                      }}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="hashtags">Hashtags personalizadas</Label>
                <Input
                  id="hashtags"
                  placeholder="#exemplo #hashtag"
                  value={formData.hashtags || ""}
                  onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="brandVoice">Brand Voice</Label>
                <Select value={formData.brandVoice || ""} onValueChange={(value) => setFormData({...formData, brandVoice: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="fun">Divertido</SelectItem>
                    <SelectItem value="inspiring">Inspirador</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
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
                    Gerar Post
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Gerado</CardTitle>
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
                  Copiar Conteúdo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
