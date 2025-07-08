
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Mail, Target, Search, Link, HelpCircle, Brain, History, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const creativeCards = [
  {
    id: "social-media",
    title: "Social Media Post",
    description: "Crie posts cativantes para redes sociais como Instagram, Facebook, LinkedIn, X.",
    icon: Smartphone,
    color: "bg-gradient-to-br from-pink-500 to-purple-600"
  },
  {
    id: "email",
    title: "E-mail",
    description: "Gere e-mails como cold mail, follow-up, nurturing, promo, etc",
    icon: Mail,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600"
  },
  {
    id: "social-ads",
    title: "Anúncio para Redes Sociais",
    description: "Crie textos publicitários atrativos para redes sociais",
    icon: Target,
    color: "bg-gradient-to-br from-orange-500 to-red-600"
  },
  {
    id: "google-ads",
    title: "Anúncio para Google Ads",
    description: "Gere headlines e descrições para Google Ads",
    icon: Search,
    color: "bg-gradient-to-br from-green-500 to-emerald-600"
  },
  {
    id: "bio-link",
    title: "Link da Bio",
    description: "Crie bios de impacto para usar em Linktree, Beacons, etc",
    icon: Link,
    color: "bg-gradient-to-br from-violet-500 to-indigo-600"
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Gere respostas para perguntas comuns dos seus clientes",
    icon: HelpCircle,
    color: "bg-gradient-to-br from-yellow-500 to-amber-600"
  },
  {
    id: "objections",
    title: "Quebra de Objeções",
    description: "Enfrente objeções com respostas estratégicas baseadas em gatilhos de vendas",
    icon: Brain,
    color: "bg-gradient-to-br from-teal-500 to-cyan-600"
  }
];

export default function CreativeAssistant() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId);
    setFormData({});
    setGeneratedContent("");
    setIsModalOpen(true);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation - replace with actual AI integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = generateMockContent(selectedCard, formData);
      setGeneratedContent(mockContent);
      
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: "Seu conteúdo está pronto para uso.",
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

  const generateMockContent = (cardId: string | null, data: any) => {
    switch (cardId) {
      case "social-media":
        return `🚀 ${data.description || "Novo post incrível!"}\n\n${data.includeEmojis ? "✨ " : ""}Conteúdo envolvente para suas redes sociais!\n\n#marketing #socialmedia ${data.hashtags || ""}`;
      case "email":
        return `Assunto: ${data.context || "Assunto Personalizado"}\n\nOlá,\n\nConteúdo do e-mail personalizado baseado no contexto fornecido.\n\nAtenciosamente,\nSua Equipe`;
      case "social-ads":
        return `🎯 ${data.product || "Produto Incrível"}\n\nTransforme sua vida hoje mesmo!\nEspecialmente para: ${data.audience || "público específico"}\n\n👉 Clique e descubra mais!`;
      default:
        return "Conteúdo gerado com base nos seus parâmetros!";
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
    });
  };

  const renderModalContent = () => {
    const card = creativeCards.find(c => c.id === selectedCard);
    if (!card) return null;

    switch (selectedCard) {
      case "social-media":
        return (
          <div className="space-y-4">
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
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
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
          </div>
        );

      case "social-ads":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="product">Descreva o produto/serviço</Label>
              <Textarea
                id="product"
                placeholder="Ex: Curso online de marketing digital..."
                value={formData.product || ""}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="audience">Público-alvo</Label>
              <Input
                id="audience"
                placeholder="Ex: Empreendedores de 25-45 anos"
                value={formData.audience || ""}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="objective">Objetivo do anúncio</Label>
              <Select value={formData.objective || ""} onValueChange={(value) => setFormData({...formData, objective: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversion">Conversão</SelectItem>
                  <SelectItem value="traffic">Tráfego</SelectItem>
                  <SelectItem value="branding">Branding</SelectItem>
                  <SelectItem value="engagement">Engajamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="general">Descreva o que você precisa</Label>
              <Textarea
                id="general"
                placeholder="Descreva aqui..."
                value={formData.general || ""}
                onChange={(e) => setFormData({...formData, general: e.target.value})}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assistente Criativo</h1>
            <p className="text-muted-foreground">Gere microconteúdos instantaneamente com IA</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/creative-assistant/history')}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Histórico
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creativeCards.map((card) => (
            <Card
              key={card.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick(card.id)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Criar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedCard && (
                  <>
                    {React.createElement(creativeCards.find(c => c.id === selectedCard)?.icon || Sparkles, { className: "h-5 w-5" })}
                    {creativeCards.find(c => c.id === selectedCard)?.title}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {renderModalContent()}

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Conteúdo
                    </>
                  )}
                </Button>
              </div>

              {generatedContent && (
                <div className="space-y-3">
                  <Label>Conteúdo Gerado:</Label>
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
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
