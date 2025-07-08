
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function CreativeAssistantEmail() {
  const [formData, setFormData] = useState<any>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `Assunto: ${formData.context || "Assunto Personalizado"}\n\nOlá,\n\nConteúdo do e-mail personalizado baseado no contexto fornecido.\n\nAtenciosamente,\nSua Equipe`;
      setGeneratedContent(mockContent);
      
      toast({
        title: "E-mail gerado com sucesso!",
        description: "Seu e-mail está pronto para uso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar e-mail",
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
      description: "E-mail copiado para a área de transferência.",
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
            <h1 className="text-3xl font-bold">E-mail</h1>
            <p className="text-muted-foreground">Gere e-mails personalizados com IA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do E-mail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="context">Qual o assunto ou contexto do e-mail?</Label>
                <Textarea
                  id="context"
                  placeholder="Ex: Follow-up de proposta comercial..."
                  value={formData.context || ""}
                  onChange={(e) => setFormData({...formData, context: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="emailType">Tipo de e-mail</Label>
                <Select value={formData.emailType || ""} onValueChange={(value) => setFormData({...formData, emailType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="cold">Cold Email</SelectItem>
                    <SelectItem value="followup">Follow Up</SelectItem>
                    <SelectItem value="promo">Promoção</SelectItem>
                    <SelectItem value="aida">AIDA</SelectItem>
                    <SelectItem value="pas">PAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brandVoice">Brand Voice</Label>
                <Select value={formData.brandVoice || ""} onValueChange={(value) => setFormData({...formData, brandVoice: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="friendly">Amigável</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="persuasive">Persuasivo</SelectItem>
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
                    Gerar E-mail
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>E-mail Gerado</CardTitle>
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
                  Copiar E-mail
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
