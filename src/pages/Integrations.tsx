
import { useState } from "react";
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
  ExternalLink
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { WordpressIntegration } from "./Integrations/WordpressIntegration";

interface IntegrationCard {
  name: string;
  description: string;
  icon: any;
  status: 'connected' | 'available' | 'coming-soon';
  action?: () => void;
}

export default function Integrations() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

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

  const googleIntegrations: IntegrationCard[] = [
    {
      name: "Google Analytics",
      description: "Acompanhe métricas de tráfego, sessões e comportamento dos usuários",
      icon: BarChart3,
      status: 'available',
      action: () => handleGoogleConnect('analytics')
    },
    {
      name: "Google Search Console",
      description: "Monitore performance de SEO, cliques e impressões de busca",
      icon: Search,
      status: 'available',
      action: () => handleGoogleConnect('search-console')
    },
    {
      name: "Google Ads",
      description: "Gerencie campanhas de anúncios e acompanhe conversões",
      icon: Target,
      status: 'available',
      action: () => handleGoogleConnect('ads')
    },
    {
      name: "Google Trends",
      description: "Analise tendências de pesquisa e insights de mercado",
      icon: TrendingUp,
      status: 'available',
      action: () => handleGoogleConnect('trends')
    }
  ];

  const socialIntegrations: IntegrationCard[] = [
    {
      name: "LinkedIn",
      description: "Publique conteúdo profissional e acompanhe engajamento",
      icon: Share2,
      status: 'coming-soon'
    },
    {
      name: "Instagram",
      description: "Gerencie posts, stories e métricas de alcance",
      icon: Smartphone,
      status: 'coming-soon'
    }
  ];

  const trackingIntegrations: IntegrationCard[] = [
    {
      name: "Google Tag Manager",
      description: "Gerencie tags de rastreamento sem código",
      icon: Settings,
      status: 'coming-soon'
    },
    {
      name: "Pixel Meta Ads",
      description: "Rastreie conversões e otimize campanhas no Facebook",
      icon: Target,
      status: 'coming-soon'
    },
    {
      name: "Pixel Google Ads",
      description: "Meça efetividade de anúncios e remarketing",
      icon: Target,
      status: 'coming-soon'
    }
  ];

  const moreIntegrations: IntegrationCard[] = [
    {
      name: "Webhook",
      description: "Integre com sistemas externos via webhooks personalizados",
      icon: Webhook,
      status: 'coming-soon'
    },
    {
      name: "Zapier",
      description: "Automatize workflows conectando milhares de aplicações",
      icon: Zap,
      status: 'coming-soon'
    },
    {
      name: "Wix",
      description: "Publique conteúdo diretamente no seu site Wix",
      icon: Globe,
      status: 'coming-soon'
    },
    {
      name: "RD Station",
      description: "Integre com automação de marketing e lead nurturing",
      icon: Settings,
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
    if (integration.status === 'connected') {
      return (
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            Gerenciar
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-red-600 hover:text-red-700">
            Desconectar
          </Button>
        </div>
      );
    }
    
    if (integration.status === 'available' && integration.action) {
      return (
        <Button 
          onClick={integration.action}
          disabled={isConnecting === integration.name}
          className="w-full"
          size="sm"
        >
          {isConnecting === integration.name ? "Conectando..." : "Conectar"}
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
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
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
          </TabsList>

          {/* WordPress Tab */}
          <TabsContent value="wordpress" className="space-y-6 mt-6">
            <WordpressIntegration />
          </TabsContent>

          {/* Google Tab */}
          <TabsContent value="google" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Serviços Google</h2>
                <p className="text-muted-foreground">
                  Conecte-se aos serviços do Google para acessar dados de analytics, SEO e publicidade
                </p>
              </div>
              <IntegrationGrid integrations={googleIntegrations} />
            </div>
          </TabsContent>

          {/* Social Tab */}
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

          {/* Tracking Tab */}
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

          {/* More Tab */}
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
        </Tabs>
      </div>
    </Layout>
  );
}
