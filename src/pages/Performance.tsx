
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Clock, CheckCircle2, FileText, Target, Brain, Zap } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

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
  const totalPosts = 68;
  const avgGenerationTime = 12.5; // minutes
  const successRate = 94.1; // percentage
  const avgSeoScore = 85.2;
  const avgLlmScore = 87.8;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Performance</h1>
          <p className="text-muted-foreground">Dashboard profundo com trends de SEO vs LLM Score e correlação com Analytics.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="glass">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPosts}</p>
                <p className="text-sm text-muted-foreground">Posts Gerados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgGenerationTime}min</p>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{successRate}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mr-4">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgSeoScore}</p>
                <p className="text-sm text-muted-foreground">SEO Score Médio</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 mr-4">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgLlmScore}</p>
                <p className="text-sm text-muted-foreground">LLM Score Médio</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Posts and Scores Over Time */}
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

          {/* Publication Status */}
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

        {/* Score vs Performance Correlation */}
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

        {/* Historical Trends */}
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

        {/* Detailed Metrics */}
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
    </Layout>
  );
}
