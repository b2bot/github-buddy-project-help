import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  BarChart3, 
  Search, 
  TrendingUp, 
  Smartphone, 
  Target, 
  Share2, 
  Zap, 
  Webhook,
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { WordpressIntegration } from "./Integrations/WordpressIntegration";
import { useGoogleIntegrations } from "@/hooks/useGoogleIntegrations";

interface IntegrationCard {
  name: string;
  description: string;
  icon: any;
  service: string;
  status: 'connected' | 'available' | 'coming-soon';
  action?: () => void;
}

export default function Integrations() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { integrations, loading, loadIntegrations, disconnectService } = useGoogleIntegrations();

  // Verificar parâmetros da URL para feedback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const service = urlParams.get('service');

    if (success === 'connected' && service) {
      toast({
        title: "Conectado com sucesso!",
        description: `Sua conta Google ${service.replace('google_', '').replace('_', ' ')} foi conectada.`,
      });
      // Limpar URL
      window.history.replaceState({}, '', '/integrations');
      // Recarregar integrações
      loadIntegrations();
    } else if (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar sua conta Google. Tente novamente.",
        variant: "destructive"
      });
      // Limpar URL
      window.history.replaceState({}, '', '/integrations');
    }
  }, [toast, loadIntegrations]);

  const handleGoogleConnect = async (service: string) => {
    setIsConnecting(service);
    
    try {
      const response = await fetch('/api/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service })
      });
      
      const data = await response.json();
      
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast({
          title: "Erro na conexão",
          description: "Não foi possível iniciar a autenticação com o Google.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Erro ao conectar com o Google. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (service: string) => {
    try {
      await disconnectService(service);
      toast({
        title: "Desconectado",
        description: `Conta Google ${service.replace('google_', '').replace('_', ' ')} desconectada com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar a conta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getIntegrationStatus = (service: string) => {
    const integration = integrations.find(i => i.service === service);
    return integration || { service, connected: false };
  };

  const googleIntegrations: IntegrationCard[] = [
    {
      name: "Google Analytics",
      description: "Acompanhe métricas de tráfego, sessões e comportamento dos usuários",
      icon: BarChart3,
      service: 'google_analytics',
      status: getIntegrationStatus('google_analytics').connected ? 'connected' : 'available',
      action: () => handleGoogleConnect('google_analytics')
    },
    {
      name: "Google Search Console",
      description: "Monitore performance de SEO, cliques e impressões de busca",
      icon: Search,
      service: 'google_search_console',
      status: getIntegrationStatus('google_search_console').connected ? 'connected' : 'available',
      action: () => handleGoogleConnect('google_search_console')
    },
    {
      name: "Google Ads",
      description: "Gerencie campanhas de anúncios e acompanhe conversões",
      icon: Target,
      service: 'google_ads',
      status: getIntegrationStatus('google_ads').connected ? 'connected' : 'available',
      action: () => handleGoogleConnect('google_ads')
    }
  ];

  const socialIntegrations: IntegrationCard[] = [
    {
      name: "LinkedIn",
      description: "Publique conteúdo profissional e acompanhe engajamento",
      icon: Share2,
      service: 'linkedin',
      status: 'coming-soon'
    },
    {
      name: "Instagram",
      description: "Gerencie posts, stories e métricas de alcance",
      icon: Smartphone,
      service: 'instagram',
      status: 'coming-soon'
    }
  ];

  const trackingIntegrations: IntegrationCard[] = [
    {
      name: "Google Tag Manager",
      description: "Gerencie tags de rastreamento sem código",
      icon: Settings,
      service: 'gtm',
      status: 'coming-soon'
    },
    {
      name: "Pixel Meta Ads",
      description: "Rastreie conversões e otimize campanhas no Facebook",
      icon: Target,
      service: 'meta_pixel',
      status: 'coming-soon'
    }
  ];

  const moreIntegrations: IntegrationCard[] = [
    {
      name: "Webhook",
      description: "Integre com sistemas externos via webhooks personalizados",
      icon: Webhook,
      service: 'webhook',
      status: 'coming-soon'
    },
    {
      name: "Zapier",
      description: "Automatize workflows conectando milhares de aplicações",
      icon: Zap,
      service: 'zapier',
      status: 'coming-soon'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">✅ Conectado</Badge>;
      case 'available':
        return <Badge variant="outline">Disponível</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Em breve</Badge>;
      default:
        return null;
    }
  };

  const getActionButton = (integration: IntegrationCard) => {
    const status = getIntegrationStatus(integration.service);
    
    if (integration.status === 'connected') {
      return (
        <div className="space-y-2">
          {status.email && (
            <p className="text-xs text-muted-foreground">
              Conectado como: {status.email}
            </p>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={() => handleDisconnect(integration.service)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Desconectar
          </Button>
        </div>
      );
    }
    
    if (integration.status === 'available' && integration.action) {
      return (
        <Button 
          onClick={integration.action}
          disabled={isConnecting === integration.service}
          className="w-full"
          size="sm"
        >
          {isConnecting === integration.service ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </>
          ) : (
            "Conectar"
          )}
        </Button>
      );
    }
    
    return (
      <Button variant="ghost" size="sm" className="w-full" disabled>
        Em breve
      </Button>
    );
  };

  const IntegrationGrid = ({ integrations }: { integrations: IntegrationCard[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((integration) => {
        const IconComponent = integration.icon;
        return (
          <Card key={integration.name} className="glass hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {integration.description}
              </p>
              {getActionButton(integration)}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const StatusTable = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status das Conexões Google
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Serviço</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Última Sincronização</th>
                  <th className="text-left p-2">Conta Conectada</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr key={integration.service} className="border-b">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {integration.service === 'google_analytics' && <BarChart3 className="h-4 w-4" />}
                        {integration.service === 'google_search_console' && <Search className="h-4 w-4" />}
                        {integration.service === 'google_ads' && <Target className="h-4 w-4" />}
                        {integration.service.replace('google_', '').replace('_', ' ').toUpperCase()}
                      </div>
                    </td>
                    <td className="p-2">
                      {integration.connected ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Conectado
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="h-4 w-4" />
                          Não conectado
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {integration.connected && integration.lastSync ? (
                        new Date(integration.lastSync).toLocaleString('pt-BR')
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-2">
                      {integration.email || '—'}
                    </td>
                    <td className="p-2">
                      {integration.connected ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnect(integration.service)}
                        >
                          Desconectar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGoogleConnect(integration.service)}
                          disabled={isConnecting === integration.service}
                        >
                          {isConnecting === integration.service ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Conectar'
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">
            Conecte suas ferramentas favoritas e automatize seu fluxo de trabalho
          </p>
        </div>

        <Tabs defaultValue="wordpress" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50">
            <TabsTrigger value="wordpress" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              WordPress
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Google
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Rastrear
            </TabsTrigger>
            <TabsTrigger value="more" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Mais
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wordpress" className="space-y-6 mt-6">
            <WordpressIntegration />
          </TabsContent>

          <TabsContent value="google" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Serviços Google</h2>
                <p className="text-muted-foreground">
                  Conecte-se aos serviços do Google para acessar dados de analytics, SEO e publicidade
                </p>
              </div>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <IntegrationGrid integrations={googleIntegrations} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Redes Sociais</h2>
                <p className="text-muted-foreground">
                  Publique e gerencie conteúdo nas principais redes sociais
                </p>
              </div>
              <IntegrationGrid integrations={socialIntegrations} />
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Rastreamento</h2>
                <p className="text-muted-foreground">
                  Configure pixels e tags para monitorar conversões e performance
                </p>
              </div>
              <IntegrationGrid integrations={trackingIntegrations} />
            </div>
          </TabsContent>

          <TabsContent value="more" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Outras Integrações</h2>
                <p className="text-muted-foreground">
                  Conecte com CRMs, automação de marketing e ferramentas personalizadas
                </p>
              </div>
              <IntegrationGrid integrations={moreIntegrations} />
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Status das Conexões</h2>
                <p className="text-muted-foreground">
                  Monitore o status de todas as suas integrações Google
                </p>
              </div>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <StatusTable />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
