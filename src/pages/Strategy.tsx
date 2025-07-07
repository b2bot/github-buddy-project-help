
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Layout } from "@/components/layout/Layout";
import { Target, Users, Lightbulb, TrendingUp, Search, Link2, FileText, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StrategyPillar {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
  status: "success" | "warning" | "danger";
  fields: {
    [key: string]: string;
  };
  aiSuggestions: string[];
}

export default function Strategy() {
  const [selectedPillar, setSelectedPillar] = useState<StrategyPillar | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [pillars, setPillars] = useState<StrategyPillar[]>([
    {
      id: "target-audience",
      title: "Definição de Público-Alvo",
      description: "Identifique e compreenda seu público ideal para direcionar seus esforços de SEO.",
      icon: Users,
      progress: 85,
      status: "success",
      fields: {
        audience: "Freelancers de social media, empreendedores digitais...",
        demographics: "",
        interests: "",
        painPoints: ""
      },
      aiSuggestions: [
        "Gerar personas detalhadas",
        "Analisar comportamento do público",
        "Identificar canais de comunicação",
        "Mapear jornada do cliente"
      ]
    },
    {
      id: "keyword-analysis",
      title: "Análise de Palavras-Chave",
      description: "Pesquise e selecione as palavras-chave mais relevantes para o seu nicho.",
      icon: Search,
      progress: 62,
      status: "warning",
      fields: {
        primaryKeywords: "",
        secondaryKeywords: "",
        longTailKeywords: "",
        competitorKeywords: ""
      },
      aiSuggestions: [
        "Encontrar palavras-chave de cauda longa",
        "Analisar dificuldade de rankeamento",
        "Descobrir gaps de conteúdo",
        "Mapear intenção de busca"
      ]
    },
    {
      id: "on-page-optimization",
      title: "Otimização On-Page",
      description: "Otimize o conteúdo e a estrutura do seu site para melhorar o ranking nos motores de busca.",
      icon: FileText,
      progress: 92,
      status: "success",
      fields: {
        titleTags: "",
        metaDescriptions: "",
        headingStructure: "",
        internalLinking: ""
      },
      aiSuggestions: [
        "Otimizar títulos e meta descriptions",
        "Melhorar estrutura de headings",
        "Sugerir links internos",
        "Analisar densidade de palavras-chave"
      ]
    },
    {
      id: "link-building",
      title: "Construção de Links",
      description: "Desenvolva uma estratégia para obter links de alta qualidade de outros sites.",
      icon: Link2,
      progress: 48,
      status: "danger",
      fields: {
        linkTargets: "",
        outreachStrategy: "",
        contentAssets: "",
        partnerships: ""
      },
      aiSuggestions: [
        "Encontrar oportunidades de guest posts",
        "Identificar sites para parcerias",
        "Criar estratégias de outreach",
        "Analisar perfil de backlinks"
      ]
    },
    {
      id: "content-marketing",
      title: "Marketing de Conteúdo",
      description: "Crie e distribua conteúdo relevante e valioso para atrair e engajar seu público.",
      icon: Lightbulb,
      progress: 78,
      status: "warning",
      fields: {
        contentPillars: "Educação, inspiração, entretenimento, vendas...",
        contentCalendar: "",
        distributionChannels: "",
        contentTypes: ""
      },
      aiSuggestions: [
        "Gerar ideias de conteúdo",
        "Criar calendário editorial",
        "Otimizar distribuição",
        "Analisar performance de conteúdo"
      ]
    }
  ]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "danger":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleOpenModal = (pillar: StrategyPillar) => {
    setSelectedPillar(pillar);
    setModalOpen(true);
    setAiResponse("");
  };

  const handleFieldChange = (fieldKey: string, value: string) => {
    if (!selectedPillar) return;
    
    const updatedPillar = {
      ...selectedPillar,
      fields: {
        ...selectedPillar.fields,
        [fieldKey]: value
      }
    };
    
    setSelectedPillar(updatedPillar);
    
    // Update the pillar in the main state
    setPillars(prev => 
      prev.map(p => p.id === updatedPillar.id ? updatedPillar : p)
    );
  };

  const handleAIGeneration = async (suggestion: string) => {
    setIsGenerating(true);
    setAiResponse("");
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = `Sugestão para "${suggestion}":

${selectedPillar?.id === 'target-audience' ? 
  `• Persona 1: Freelancer de Social Media (25-35 anos)
   - Desafios: Falta de tempo, pressão por resultados
   - Canais: Instagram, LinkedIn, YouTube
   
• Persona 2: Empreendedor Digital (30-45 anos)
   - Desafios: Escalar negócio, gerar leads
   - Canais: LinkedIn, Facebook, email marketing` :
  
selectedPillar?.id === 'keyword-analysis' ?
  `• Palavra-chave principal: "marketing digital para pequenas empresas"
   - Volume: 2.1K/mês | Dificuldade: Média | CPC: R$ 3,50
   
• Palavras-chave relacionadas:
   - "estratégias de marketing digital" (1.8K/mês)
   - "marketing digital iniciantes" (1.2K/mês)
   - "ferramentas marketing digital" (950/mês)` :
   
  `Esta é uma resposta simulada da IA para "${suggestion}". 
   Aqui você teria sugestões específicas baseadas no pilar selecionado.`}`;
      
      setAiResponse(mockResponse);
      
      toast({
        title: "IA executada com sucesso!",
        description: `Sugestões geradas para ${selectedPillar?.title}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao executar IA",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToEditor = () => {
    if (!selectedPillar || !aiResponse) return;
    
    // Store the generated content for the manual editor
    const editorData = {
      content: aiResponse,
      seoData: {
        keyword: selectedPillar.fields.primaryKeywords || "",
        slug: selectedPillar.title.toLowerCase().replace(/\s+/g, '-'),
        metaDescription: "",
        altText: "",
        excerpt: aiResponse.substring(0, 150) + "...",
        category: selectedPillar.title,
        title: `Estratégia: ${selectedPillar.title}`
      }
    };
    
    localStorage.setItem('strategy_generated_content', JSON.stringify(editorData));
    
    toast({
      title: "Conteúdo enviado para o editor!",
      description: "Redirecionando para a página de edição manual...",
    });
    
    // Navigate to manual editor
    setTimeout(() => {
      window.location.href = '/manual';
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estratégia de SEO</h1>
          <p className="text-gray-600">
            Gerencie sua estratégia de SEO com análise completa por pilares e integração com IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <Card key={pillar.id} className="glass hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {pillar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{pillar.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Progresso</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(pillar.status)}`}
                    >
                      {pillar.progress}%
                    </Badge>
                  </div>
                  
                  <Progress value={pillar.progress} className="h-2" />
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOpenModal(pillar)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Próximos Passos */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Próximos Passos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análise de Tendências
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Acompanhe as últimas tendências de SEO para ajustar sua estratégia.
                </p>
                <Button variant="outline" className="w-full">
                  Analisar Tendências
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Relatório Executivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Gere um relatório completo da sua estratégia de SEO atual.
                </p>
                <Button variant="outline" className="w-full">
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Detalhes */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedPillar && (
                  <>
                    <selectedPillar.icon className="h-5 w-5" />
                    {selectedPillar.title}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedPillar && (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Status Atual</p>
                    <p className="text-sm text-gray-600">Progresso: {selectedPillar.progress}%</p>
                  </div>
                  <Badge className={getStatusColor(selectedPillar.status)}>
                    {selectedPillar.status === 'success' ? 'Excelente' : 
                     selectedPillar.status === 'warning' ? 'Em andamento' : 'Precisa atenção'}
                  </Badge>
                </div>

                {/* Campos de Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedPillar.fields).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Textarea
                        id={key}
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={`Descreva ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}...`}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>

                {/* Sugestões de IA */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Sugestões de IA
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPillar.aiSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto p-3 text-left"
                        onClick={() => handleAIGeneration(suggestion)}
                        disabled={isGenerating}
                      >
                        <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Resposta da IA */}
                {(aiResponse || isGenerating) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Resultado da IA</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-600">Gerando sugestões...</span>
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm">{aiResponse}</pre>
                      )}
                    </div>
                    
                    {aiResponse && (
                      <div className="flex gap-2">
                        <Button onClick={handleSendToEditor} className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Enviar para Editor
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setAiResponse("")}
                        >
                          Limpar
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
