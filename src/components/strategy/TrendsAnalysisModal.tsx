
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Download, Send, Sparkles, Search, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTrendsData } from "@/hooks/useTrendsData";
import { useToast } from "@/hooks/use-toast";

interface TrendsAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrendsAnalysisModal({ open, onOpenChange }: TrendsAnalysisModalProps) {
  const [period, setPeriod] = useState("30d");
  const [keywords, setKeywords] = useState<string[]>(["marketing digital", "seo"]);
  const [keywordInput, setKeywordInput] = useState("");
  const { toast } = useToast();

  // Calculate date range based on period
  const getDateRange = (period: string) => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "6m":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "1a":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    return { startDate: startDate.toISOString().split('T')[0], endDate };
  };

  const { startDate, endDate } = getDateRange(period);
  const { data: trendsData, isLoading } = useTrendsData({ keywords, startDate, endDate });

  const addKeyword = () => {
    if (keywordInput.trim() && keywords.length < 3 && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleGenerateContent = async () => {
    try {
      toast({
        title: "Gerando pautas...",
        description: "Aguarde enquanto criamos sugestões baseadas nas tendências.",
      });
      
      // Simulate AI content generation
      setTimeout(() => {
        const generatedContent = {
          titles: [
            "Como dominar o marketing digital em 2024: Guia completo",
            "SEO para iniciantes: 10 estratégias que funcionam",
            "Tendências de marketing digital que você precisa conhecer"
          ],
          insights: trendsData?.insights
        };
        
        localStorage.setItem('trends_generated_content', JSON.stringify(generatedContent));
        
        toast({
          title: "Pautas geradas com sucesso!",
          description: "As sugestões foram criadas baseadas nas tendências identificadas.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro ao gerar pautas",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleSendToEditor = () => {
    const content = localStorage.getItem('trends_generated_content');
    if (content) {
      localStorage.setItem('editor_draft_content', content);
      toast({
        title: "Conteúdo enviado para o editor!",
        description: "Redirecionando para a página de edição manual...",
      });
      
      setTimeout(() => {
        window.location.href = '/manual';
      }, 1000);
    } else {
      toast({
        title: "Nenhum conteúdo para enviar",
        description: "Gere pautas primeiro antes de enviar ao editor.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    if (!trendsData) return;
    
    const csvData = trendsData.trends.map(trend => 
      trend.data.map(point => ({
        keyword: trend.keyword,
        date: point.date,
        value: point.value
      }))
    ).flat();
    
    const csvContent = [
      "keyword,date,value",
      ...csvData.map(row => `${row.keyword},${row.date},${row.value}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trends-analysis-${startDate}-${endDate}.csv`;
    a.click();
    
    toast({
      title: "Dados exportados!",
      description: "O arquivo CSV foi baixado com sucesso.",
    });
  };

  const chartData = trendsData?.trends[0]?.data.map((point, index) => {
    const dataPoint: any = { date: point.date };
    trendsData.trends.forEach(trend => {
      dataPoint[trend.keyword] = trend.data[index]?.value || 0;
    });
    return dataPoint;
  }) || [];

  const colors = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análise de Tendências
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 dias</SelectItem>
                      <SelectItem value="30d">30 dias</SelectItem>
                      <SelectItem value="6m">6 meses</SelectItem>
                      <SelectItem value="1a">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Palavras-chave ({keywords.length}/3)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="Digite uma palavra-chave"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button 
                      size="sm" 
                      onClick={addKeyword}
                      disabled={keywords.length >= 3}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <Badge 
                        key={keyword} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => removeKeyword(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights Card */}
            {trendsData?.insights && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +{trendsData.insights.growth}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Crescimento vs período anterior
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{trendsData.insights.topKeyword}</div>
                    <div className="text-xs text-muted-foreground">
                      Palavra-chave em destaque
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{trendsData.insights.bestDay}</div>
                    <div className="text-xs text-muted-foreground">
                      Melhor dia da semana
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Tendências de Busca
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {keywords.map((keyword, index) => (
                        <Line
                          key={keyword}
                          type="monotone"
                          dataKey={keyword}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Related Queries */}
            {trendsData?.relatedQueries && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Consultas Relacionadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendsData.relatedQueries.map((query) => (
                      <Badge
                        key={query.query}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                        style={{ fontSize: `${Math.max(0.7, query.value / 100)}rem` }}
                      >
                        {query.query} ({query.value})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleGenerateContent} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Gerar Pautas
                  </Button>
                  <Button onClick={handleSendToEditor} variant="outline" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Enviar ao Editor
                  </Button>
                  <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
