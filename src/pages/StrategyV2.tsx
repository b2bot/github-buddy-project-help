import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Users, Lightbulb, CheckCircle, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function StrategyV2() {
  const strategyData = [
    {
      title: "Definição de Público-Alvo",
      description: "Identifique e compreenda seu público ideal para direcionar seus esforços de SEO.",
      progress: 85,
      status: "success",
    },
    {
      title: "Análise de Palavras-Chave",
      description: "Pesquise e selecione as palavras-chave mais relevantes para o seu nicho.",
      progress: 62,
      status: "warning",
    },
    {
      title: "Otimização On-Page",
      description: "Otimize o conteúdo e a estrutura do seu site para melhorar o ranking nos motores de busca.",
      progress: 92,
      status: "success",
    },
    {
      title: "Construção de Links",
      description: "Desenvolva uma estratégia para obter links de alta qualidade de outros sites.",
      progress: 48,
      status: "danger",
    },
    {
      title: "Marketing de Conteúdo",
      description: "Crie e distribua conteúdo relevante e valioso para atrair e engajar seu público.",
      progress: 78,
      status: "warning",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estratégia de SEO</h1>
          <p className="text-gray-600">
            Visualize e gerencie sua estratégia de SEO para alcançar seus objetivos de negócios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategyData.map((item, index) => (
            <Card key={index} className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Progresso</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      item.status === "success"
                        ? "bg-green-100 text-green-700"
                        : item.status === "warning"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.progress}%
                  </Badge>
                </div>
                <Progress value={item.progress} className="h-2" />
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
                  <Users className="h-5 w-5" />
                  Engajamento do Público
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Aumente o engajamento do público com conteúdo relevante e interativo.
                </p>
                <Button variant="outline" className="w-full">
                  Otimizar Engajamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}