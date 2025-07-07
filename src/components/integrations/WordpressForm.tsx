
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { wordpress } from "@/integrations/wordpress";
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ChevronDown,
  Send,
  Eye,
  EyeOff
} from "lucide-react";

export function WordpressForm() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{connected: boolean} | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedUrl = localStorage.getItem('partnerseo_webhook_url') || '';
    const savedToken = localStorage.getItem('partnerseo_auth_token') || '';
    const savedActive = localStorage.getItem('partnerseo_webhook_active') === 'true';
    
    setWebhookUrl(savedUrl);
    setAuthToken(savedToken);
    setIsActive(savedActive);
  }, []);

  const handleVerifyIntegration = async () => {
    if (!webhookUrl || !authToken) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL do WordPress e o token de autenticação",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      const config = { url: webhookUrl, token: authToken, active: isActive };
      const result = await wordpress.testConnection(config);
      
      if (result.success) {
        // Save settings
        wordpress.setWebhookConfig(config);
        setConnectionStatus({ connected: true });
        
        toast({
          title: "Integração verificada!",
          description: "Conexão com WordPress estabelecida com sucesso."
        });
      } else {
        setConnectionStatus({ connected: false });
        
        toast({
          title: "Erro na verificação",
          description: result.message || "Verifique a URL e o token de autenticação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setConnectionStatus({ connected: false });
      toast({
        title: "Erro na verificação",
        description: "Erro ao verificar integração",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(authToken);
    toast({
      title: "Token copiado!",
      description: "Token copiado para a área de transferência."
    });
  };

  const handleCopyEndpoint = () => {
    const endpoint = `${webhookUrl}/wp-json/partnerseo/v1/webhook`;
    navigator.clipboard.writeText(endpoint);
    toast({
      title: "Endpoint copiado!",
      description: "URL do endpoint copiada para a área de transferência."
    });
  };

  const handleResendAll = async () => {
    setIsResending(true);
    
    try {
      // Get published posts from localStorage
      const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
      
      if (publishedPosts.length === 0) {
        toast({
          title: "Nenhum post encontrado",
          description: "Não há posts para reenviar."
        });
        return;
      }
      
      await wordpress.resendAllPosts(publishedPosts);
      
      toast({
        title: "Posts reenviados!",
        description: `${publishedPosts.length} posts foram reenviados para o WordPress.`
      });
    } catch (error) {
      toast({
        title: "Erro no reenvio",
        description: "Falha ao reenviar posts.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleActiveToggle = (checked: boolean) => {
    setIsActive(checked);
    const config = { url: webhookUrl, token: authToken, active: checked };
    wordpress.setWebhookConfig(config);
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      {connectionStatus && (
        <div className="flex items-center gap-2">
          <Badge 
            className={
              connectionStatus.connected 
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            }
          >
            {connectionStatus.connected ? (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            ) : (
              <AlertCircle className="mr-1 h-3 w-3" />
            )}
            {connectionStatus.connected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
      )}

      {/* Basic Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do WordPress</Label>
          <Input
            id="webhook-url"
            placeholder="https://seusite.com"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            URL base do seu site WordPress
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="auth-token">Token de Autenticação</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="auth-token"
                type={showToken ? "text" : "password"}
                placeholder="Token do plugin WordPress (configure no WP Admin)"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyToken}
              disabled={!authToken}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure o token no WordPress Admin → Configurações → Partner SEO Webhook
          </p>
        </div>
      </div>

      {/* Endpoint Information */}
      {webhookUrl && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Informações do Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>URL do Webhook</Label>
              <div className="flex gap-2">
                <Input
                  value={`${webhookUrl}/wp-json/partnerseo/v1/webhook`}
                  readOnly
                  className="bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyEndpoint}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Endpoint usado para comunicação via webhooks
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Status & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <Switch
            id="webhook-active"
            checked={isActive}
            onCheckedChange={handleActiveToggle}
          />
          <div>
            <Label htmlFor="webhook-active" className="font-medium">
              Integração Ativa
            </Label>
            <p className="text-sm text-muted-foreground">
              Ativar/desativar recebimento de webhooks
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleVerifyIntegration}
            disabled={isVerifying || !webhookUrl || !authToken}
            variant="outline"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verificar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Options */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span>Opções Avançadas</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Reenvio de Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reenviar todos os posts</p>
                  <p className="text-xs text-muted-foreground">
                    Reenvia todos os posts do Partner SEO para o WordPress
                  </p>
                </div>
                <Button
                  onClick={handleResendAll}
                  disabled={isResending || !isActive}
                  variant="outline"
                  size="sm"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Reenviar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
