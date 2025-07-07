
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Eye, Clock, Search } from "lucide-react";
import { ga } from "@/integrations/ga";
import { gsc } from "@/integrations/gsc";

export default function Analytics() {
  const [gaData, setGaData] = useState<any>(null);
  const [gscData, setGscData] = useState<any>(null);
  const [seoScoreHistory, setSeoScoreHistory] = useState<any[]>([]);
  const [llmScoreHistory, setLlmScoreHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dateRange = {
          startDate: '2024-01-01',
          endDate: '2024-01-31'
        };

        const [gaMetrics, gscMetrics, gaTimeSeries, gscTimeSeries, trafficSources] = await Promise.all([
          ga.fetchMetrics(dateRange),
          gsc.fetchMetrics(dateRange),
          ga.fetchTimeSeriesData(dateRange),
          gsc.fetchTimeSeriesData(dateRange),
          ga.fetchTrafficSources()
        ]);
        
        setGaData({
          metrics: {
            sessions: gaMetrics.visitors,
            pageviews: gaMetrics.pageViews,
            bounceRate: gaMetrics.bounceRate / 100,
            avgSessionDuration: gaMetrics.avgSessionDuration
          },
          timeSeries: gaTimeSeries.map(item => ({
            date: item.date,
            sessions: item.visitors,
            pageviews: item.visitors * 1.5 // Mock pageviews
          })),
          trafficSources
        });

        setGscData({
          metrics: {
            totalImpressions: gscMetrics.totalImpressions,
            totalClicks: gscMetrics.totalClicks,
            averageCtr: gscMetrics.averageCtr / 100,
            averagePosition: gscMetrics.averagePosition
          },
          timeSeries: gscTimeSeries,
          topQueries: gscMetrics.topQueries
        });
        
        // Mock historical data for scores
        setSeoScoreHistory([
          { date: '2024-01', seoScore: 65, traffic: 1200 },
          { date: '2024-02', seoScore: 72, traffic: 1450 },
          { date: '2024-03', seoScore: 78, traffic: 1680 },
          { date: '2024-04', seoScore: 85, traffic: 2100 },
          { date: '2024-05', seoScore: 88, traffic: 2350 },
          { date: '2024-06', seoScore: 92, traffic: 2800 }
        ]);

        setLlmScoreHistory([
          { date: '2024-01', llmScore: 58, engagement: 2.3 },
          { date: '2024-02', llmScore: 68, engagement: 2.8 },
          { date: '2024-03', llmScore: 74, engagement: 3.2 },
          { date: '2024-04', llmScore: 81, engagement: 3.7 },
          { date: '2024-05', llmScore: 86, engagement: 4.1 },
          { date: '2024-06', llmScore: 90, engagement: 4.5 }
        ]);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Métricas de performance e evolução dos scores.</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="seo-scores">SEO Score</TabsTrigger>
            <TabsTrigger value="llm-scores">LLM Score</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gaData?.metrics?.sessions?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gaData?.metrics?.pageviews?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gaData?.metrics?.bounceRate ? `${(gaData.metrics.bounceRate * 100).toFixed(1)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    -3% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gaData?.metrics?.avgSessionDuration ? `${Math.round(gaData.metrics.avgSessionDuration / 60)}m ${Math.round(gaData.metrics.avgSessionDuration % 60)}s` : '0m 0s'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15% vs mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search Console Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Impressões</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gscData?.metrics?.totalImpressions?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +18% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gscData?.metrics?.averageCtr ? `${(gscData.metrics.averageCtr * 100).toFixed(1)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2.3% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Posição Média</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gscData?.metrics?.averagePosition?.toFixed(1) || '0.0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    -2.1 posições (melhoria)
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cliques</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gscData?.metrics?.totalClicks?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +22% vs mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Combined Chart */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Tráfego vs Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={gaData?.timeSeries || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Sessões"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pageviews" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Visualizações"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Score History */}
          <TabsContent value="seo-scores" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Evolução SEO Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={seoScoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="seoScore" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        name="SEO Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Correlação Score vs Tráfego</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={seoScoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="traffic" fill="hsl(var(--chart-3))" name="Tráfego" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* LLM Score History */}
          <TabsContent value="llm-scores" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Evolução LLM Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={llmScoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="llmScore" 
                        stroke="hsl(var(--chart-4))" 
                        strokeWidth={3}
                        name="LLM Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Score vs Engajamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={llmScoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="engagement" fill="hsl(var(--chart-5))" name="Engajamento (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
