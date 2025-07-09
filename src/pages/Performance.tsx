import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, CheckCircle2, FileText, Target, Brain, Zap, Users, Eye, Search, Smartphone, MapPin, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ga } from "@/integrations/ga";
import { gsc } from "@/integrations/gsc";

// Mock data for charts
const postsOverTime = [
  { name: 'Jan', posts: 12, avgSeoScore: 78, avgLlmScore: 82 },
  { name: 'Fev', posts: 19, avgSeoScore: 81, avgLlmScore: 85 },
  { name: 'Mar', posts: 15, avgSeoScore: 79, avgLlmScore: 83 },
  { name: 'Abr', posts: 28, avgSeoScore: 84, avgLlmScore: 88 },
  { name: 'Mai', posts: 24, avgSeoScore: 86, avgLlmScore: 90 },
  { name: 'Jun', posts: 31, avgSeoScore: 88, avgLlmScore: 92 },
];

const publicationStatus = [
  { name: 'Publicados', count: 45, color: '#22c55e' },
  { name: 'Agendados', count: 12, color: '#3b82f6' },
  { name: 'Rascunhos', count: 8, color: '#64748b' },
  { name: 'Falhas', count: 3, color: '#ef4444' },
];

// SEO Score vs Performance correlation
const seoPerformanceData = [
  { seoScore: 65, traffic: 1200, llmScore: 70 },
  { seoScore: 72, traffic: 1800, llmScore: 75 },
  { seoScore: 78, traffic: 2400, llmScore: 82 },
  { seoScore: 84, traffic: 3200, llmScore: 88 },
  { seoScore: 90, traffic: 4100, llmScore: 94 },
  { seoScore: 93, traffic: 4800, llmScore: 96 },
];

// Historical score trends
const scoreTrends = [
  { date: '01/01', seoScore: 72, llmScore: 68, gaTraffic: 1200 },
  { date: '01/02', seoScore: 74, llmScore: 71, gaTraffic: 1350 },
  { date: '01/03', seoScore: 76, llmScore: 73, gaTraffic: 1480 },
  { date: '01/04', seoScore: 79, llmScore: 76, gaTraffic: 1620 },
  { date: '01/05', seoScore: 82, llmScore: 80, gaTraffic: 1890 },
  { date: '01/06', seoScore: 85, llmScore: 84, gaTraffic: 2100 },
  { date: '01/07', seoScore: 88, llmScore: 87, gaTraffic: 2340 },
];

export default function Performance() {
  const [gaData, setGaData] = useState<any>(null);
  const [gscData, setGscData] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Performance constants
  const totalPosts = 68;
  const avgGenerationTime = 12.5; // minutes
  const successRate = 94.1; // percentage
  const avgSeoScore = 85.2;
  const avgLlmScore = 87.8;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [gaMetrics, gscMetrics, gaTimeSeries, gscTimeSeries, trafficSources] = await Promise.all([
          ga.fetchMetrics(dateFilter),
          gsc.fetchMetrics(dateFilter),
          ga.fetchTimeSeriesData(dateFilter),
          gsc.fetchTimeSeriesData(dateFilter),
          ga.fetchTrafficSources()
        ]);
        
        setGaData({
          metrics: {
            sessions: gaMetrics.visitors,
            pageviews: gaMetrics.pageViews,
            bounceRate: gaMetrics.bounceRate / 100,
            avgSessionDuration: gaMetrics.avgSessionDuration,
            engagementRate: 0.68,
            ctr: 0.045
          },
          timeSeries: gaTimeSeries.map(item => ({
            date: item.date,
            sessions: item.visitors,
            pageviews: item.visitors * 1.5
          })),
          trafficSources,
          deviceData: [
            { device: 'Desktop', users: 8234, percentage: 45 },
            { device: 'Mobile', users: 7456, percentage: 41 },
            { device: 'Tablet', users: 2543, percentage: 14 }
          ],
          cityData: [
            { city: 'São Paulo', users: 3245, sessions: 4123 },
            { city: 'Rio de Janeiro', users: 2134, sessions: 2876 },
            { city: 'Belo Horizonte', users: 1543, sessions: 1987 },
            { city: 'Porto Alegre', users: 1234, sessions: 1567 },
            { city: 'Salvador', users: 987, sessions: 1234 }
          ],
          channelData: [
            { channel: 'Orgânico', users: 8234, sessions: 12543, engagedSessions: 8567, avgDuration: 145, engagementRate: 68.3, events: 23456 },
            { channel: 'Social Media', users: 2134, sessions: 3245, engagedSessions: 2198, avgDuration: 89, engagementRate: 67.7, events: 8976 },
            { channel: 'Direto', users: 2175, sessions: 2890, engagedSessions: 1934, avgDuration: 156, engagementRate: 66.9, events: 7543 },
            { channel: 'Referral', users: 1890, sessions: 2456, engagedSessions: 1567, avgDuration: 134, engagementRate: 63.8, events: 5432 },
            { channel: 'Email', users: 896, sessions: 1234, engagedSessions: 876, avgDuration: 178, engagementRate: 71.0, events: 3210 }
          ]
        });

        setGscData({
          metrics: {
            totalImpressions: gscMetrics.totalImpressions,
            totalClicks: gscMetrics.totalClicks,
            averageCtr: gscMetrics.averageCtr / 100,
            averagePosition: gscMetrics.averagePosition
          },
          timeSeries: gscTimeSeries,
          topQueries: gscMetrics.topQueries,
          topPages: [
            { page: '/blog/marketing-digital-pequenas-empresas', clicks: 412, impressions: 8934, ctr: 4.6 },
            { page: '/blog/como-aumentar-vendas-online', clicks: 345, impressions: 7123, ctr: 4.8 },
            { page: '/blog/estrategias-seo-2024', clicks: 298, impressions: 6234, ctr: 4.8 },
            { page: '/blog/automacao-marketing', clicks: 267, impressions: 5432, ctr: 4.9 },
            { page: '/blog/ferramentas-produtividade', clicks: 234, impressions: 4987, ctr: 4.7 }
          ]
        });
        
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dateFilter]);

  const handleDateFilterChange = (field: string, value: string) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${Math.round(remainingSeconds)}s`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Performance</h1>
          <p className="text-muted-foreground">Dashboard completo com métricas de performance, Google Analytics e Search Console.</p>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Google Analytics
            </TabsTrigger>
            <TabsTrigger value="search-console" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Console
            </TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <div className="space-y-6">
              {/* Period Filter for Performance */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Período Personalizado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="perf-start-date">Data de Início</Label>
                      <Input
                        id="perf-start-date"
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perf-end-date">Data de Término</Label>
                      <Input
                        id="perf-end-date"
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                      />
                    </div>
                    <Button onClick={() => window.location.reload()}>
                      Aplicar Filtro
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Cards with improved design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="glass border-l-4 border-l-primary">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalPosts}</p>
                      <p className="text-sm text-muted-foreground">Posts Gerados</p>
                      <p className="text-xs text-green-600">+15% vs período anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-l-4 border-l-blue-500">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-4">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{avgGenerationTime}min</p>
                      <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      <p className="text-xs text-green-600">-8% vs período anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-l-4 border-l-green-500">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-4">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{successRate}%</p>
                      <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                      <p className="text-xs text-green-600">+2.3% vs período anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-l-4 border-l-purple-500">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mr-4">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{avgSeoScore}</p>
                      <p className="text-sm text-muted-foreground">SEO Score Médio</p>
                      <p className="text-xs text-green-600">+5.2% vs período anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-l-4 border-l-orange-500">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 mr-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{avgLlmScore}</p>
                      <p className="text-sm text-muted-foreground">LLM Score Médio</p>
                      <p className="text-xs text-green-600">+3.8% vs período anterior</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and detailed metrics sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Evolução de Posts e Qualidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={postsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="posts" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          name="Posts"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgSeoScore" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="SEO Score Médio"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgLlmScore" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="LLM Score Médio"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Status das Publicações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={publicationStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="count" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Correlação: Score SEO/LLM vs Tráfego Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart data={seoPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="seoScore" 
                        name="SEO Score"
                        domain={[60, 100]}
                      />
                      <YAxis 
                        dataKey="traffic" 
                        name="Tráfego"
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [
                          name === 'traffic' ? `${value} visitantes` : value,
                          name === 'traffic' ? 'Tráfego' : name === 'seoScore' ? 'SEO Score' : 'LLM Score'
                        ]}
                      />
                      <Scatter 
                        dataKey="traffic" 
                        fill="hsl(var(--primary))"
                        name="SEO Score vs Tráfego"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Tendências Históricas: Scores vs Tráfego GA/GSC</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={scoreTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="seoScore" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="SEO Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="llmScore" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="LLM Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gaTraffic" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        name="Tráfego GA"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Eficiência de Geração
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mais rápido:</span>
                        <span className="text-sm font-medium">8.2min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mais lento:</span>
                        <span className="text-sm font-medium">18.7min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mediana:</span>
                        <span className="text-sm font-medium">11.9min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Categorias Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Produtividade:</span>
                        <span className="text-sm font-medium">24 posts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Marketing:</span>
                        <span className="text-sm font-medium">18 posts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Negócios:</span>
                        <span className="text-sm font-medium">15 posts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Qualidade SEO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Score médio:</span>
                        <span className="text-sm font-medium">{avgSeoScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Acima de 80:</span>
                        <span className="text-sm font-medium">89.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Densidade ideal:</span>
                        <span className="text-sm font-medium">76.4%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Qualidade LLM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Score médio:</span>
                        <span className="text-sm font-medium">{avgLlmScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Entidades semânticas:</span>
                        <span className="text-sm font-medium">92.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Resposta direta:</span>
                        <span className="text-sm font-medium">85.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Google Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Period Filter */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Período Personalizado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="ga-start-date">Data de Início</Label>
                      <Input
                        id="ga-start-date"
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ga-end-date">Data de Término</Label>
                      <Input
                        id="ga-end-date"
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                      />
                    </div>
                    <Button onClick={() => window.location.reload()}>
                      Aplicar Filtro
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* GA Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sessões</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{gaData?.metrics?.sessions?.toLocaleString() || '0'}</div>
                    <p className="text-xs text-green-600">+12% vs período anterior</p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{gaData?.metrics?.pageviews?.toLocaleString() || '0'}</div>
                    <p className="text-xs text-green-600">+8% vs período anterior</p>
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
                    <p className="text-xs text-green-600">-3% vs período anterior</p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {gaData?.metrics?.avgSessionDuration ? formatDuration(gaData.metrics.avgSessionDuration) : '0m 0s'}
                    </div>
                    <p className="text-xs text-green-600">+15% vs período anterior</p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {gaData?.metrics?.ctr ? `${(gaData.metrics.ctr * 100).toFixed(1)}%` : '4.5%'}
                    </div>
                    <p className="text-xs text-green-600">+2.1% vs período anterior</p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {gaData?.metrics?.engagementRate ? `${(gaData.metrics.engagementRate * 100).toFixed(1)}%` : '68%'}
                    </div>
                    <p className="text-xs text-green-600">+5.2% vs período anterior</p>
                  </CardContent>
                </Card>
              </div>

              {/* Channel Performance Table */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Desempenho por Canal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Canal</th>
                          <th className="text-right p-2">Total de Usuários</th>
                          <th className="text-right p-2">Sessões</th>
                          <th className="text-right p-2">Sessões Engajadas</th>
                          <th className="text-right p-2">Duração Média</th>
                          <th className="text-right p-2">Taxa de Engajamento</th>
                          <th className="text-right p-2">Eventos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gaData?.channelData?.map((channel: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/30">
                            <td className="p-2 font-medium">{channel.channel}</td>
                            <td className="text-right p-2">{channel.users.toLocaleString()}</td>
                            <td className="text-right p-2">{channel.sessions.toLocaleString()}</td>
                            <td className="text-right p-2">{channel.engagedSessions.toLocaleString()}</td>
                            <td className="text-right p-2">{formatDuration(channel.avgDuration)}</td>
                            <td className="text-right p-2">{channel.engagementRate}%</td>
                            <td className="text-right p-2">{channel.events.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Visualizações por Dispositivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={gaData?.deviceData || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ device, percentage }) => `${device} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="users"
                        >
                          {gaData?.deviceData?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Desempenho por Cidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={gaData?.cityData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="city" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="hsl(var(--primary))" name="Usuários" />
                        <Bar dataKey="sessions" fill="hsl(var(--chart-2))" name="Sessões" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Search Console Tab */}
          <TabsContent value="search-console" className="mt-6">
            <div className="space-y-6">
              {/* Period Filter */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Período Personalizado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="gsc-start-date">Data de Início</Label>
                      <Input
                        id="gsc-start-date"
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gsc-end-date">Data de Término</Label>
                      <Input
                        id="gsc-end-date"
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                      />
                    </div>
                    <Button onClick={() => window.location.reload()}>
                      Aplicar Filtro
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* GSC Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {gscData?.metrics?.totalClicks?.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-green-600">+22% vs período anterior</p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Impressões</CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {gscData?.metrics?.totalImpressions?.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-green-600">+18% vs período anterior</p>
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
                    <p className="text-xs text-green-600">+2.3% vs período anterior</p>
                  </CardContent>
                </Card>
              </div>

              {/* Evolution Chart */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Evolução do Tráfego Orgânico</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={gscData?.timeSeries || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Cliques"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="impressions" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        name="Impressões"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Análise de Posicionamento por Termo de Busca</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Palavra-Chave</th>
                            <th className="text-right p-2">Posição Média</th>
                            <th className="text-right p-2">Cliques</th>
                            <th className="text-right p-2">Impressões</th>
                            <th className="text-right p-2">CTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gscData?.topQueries?.map((query: any, index: number) => (
                            <tr key={index} className="border-b hover:bg-muted/30">
                              <td className="p-2 font-medium text-sm">{query.query}</td>
                              <td className="text-right p-2">{query.position.toFixed(1)}</td>
                              <td className="text-right p-2">{query.clicks}</td>
                              <td className="text-right p-2">{query.impressions.toLocaleString()}</td>
                              <td className="text-right p-2">{query.ctr.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Páginas com Maior Tráfego</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Página</th>
                            <th className="text-right p-2">Cliques</th>
                            <th className="text-right p-2">Impressões</th>
                            <th className="text-right p-2">CTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gscData?.topPages?.map((page: any, index: number) => (
                            <tr key={index} className="border-b hover:bg-muted/30">
                              <td className="p-2 font-medium text-sm">{page.page}</td>
                              <td className="text-right p-2">{page.clicks}</td>
                              <td className="text-right p-2">{page.impressions.toLocaleString()}</td>
                              <td className="text-right p-2">{page.ctr.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
