
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Clock, Search, Smartphone, MapPin, Calendar } from "lucide-react";
import { ga } from "@/integrations/ga";
import { gsc } from "@/integrations/gsc";

export default function Analytics() {
  const [gaData, setGaData] = useState<any>(null);
  const [gscData, setGscData] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [isLoading, setIsLoading] = useState(true);

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
            <p className="text-muted-foreground">Carregando analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Acompanhe métricas de performance do Google Analytics e Search Console
          </p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Google Analytics
            </TabsTrigger>
            <TabsTrigger value="search-console" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Google Search Console
            </TabsTrigger>
          </TabsList>

          {/* Google Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Métricas principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sessões</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{gaData?.metrics?.sessions?.toLocaleString() || '0'}</div>
                    <p className="text-xs text-muted-foreground">+12% vs período anterior</p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{gaData?.metrics?.pageviews?.toLocaleString() || '0'}</div>
                    <p className="text-xs text-muted-foreground">+8% vs período anterior</p>
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
                    <p className="text-xs text-muted-foreground">-3% vs período anterior</p>
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
                    <p className="text-xs text-muted-foreground">+15% vs período anterior</p>
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
                    <p className="text-xs text-muted-foreground">+2.1% vs período anterior</p>
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
                    <p className="text-xs text-muted-foreground">+5.2% vs período anterior</p>
                  </CardContent>
                </Card>
              </div>

              {/* Desempenho por canal */}
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

              {/* Gráficos */}
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

          {/* Google Search Console Tab */}
          <TabsContent value="search-console" className="mt-6">
            <div className="space-y-6">
              {/* Filtro de período */}
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
                      <Label htmlFor="start-date">Data de Início</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Data de Término</Label>
                      <Input
                        id="end-date"
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

              {/* Métricas principais */}
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
                    <p className="text-xs text-muted-foreground">+22% vs período anterior</p>
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
                    <p className="text-xs text-muted-foreground">+18% vs período anterior</p>
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
                    <p className="text-xs text-muted-foreground">+2.3% vs período anterior</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de evolução */}
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

              {/* Tabelas */}
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
