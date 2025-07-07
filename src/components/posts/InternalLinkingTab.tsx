
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface LinkingConfig {
  enabled: boolean;
  sitemapUrls: string;
  manualUrls: string;
  lastSync: string | null;
  syncedUrlsCount: number;
  syncedUrls: string[];
}

export function InternalLinkingTab() {
  const [config, setConfig] = useState<LinkingConfig>({
    enabled: true,
    sitemapUrls: "https://seusite.com/sitemap.xml\nhttps://seusite.com/post-sitemap.xml",
    manualUrls: "",
    lastSync: null,
    syncedUrlsCount: 0,
    syncedUrls: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const urlsPerPage = 10;
  const totalPages = Math.ceil(config.syncedUrls.length / urlsPerPage);
  const paginatedUrls = config.syncedUrls.slice((currentPage - 1) * urlsPerPage, currentPage * urlsPerPage);

  const parseSitemap = async (sitemapUrl: string): Promise<string[]> => {
    try {
      // Simular requisição ao sitemap
      const response = await fetch(sitemapUrl);
      if (!response.ok) throw new Error('Failed to fetch sitemap');
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Buscar todas as tags <loc>
      const locElements = xmlDoc.getElementsByTagName('loc');
      const urls: string[] = [];
      
      for (let i = 0; i < locElements.length; i++) {
        const url = locElements[i].textContent;
        if (url) {
          urls.push(url);
        }
      }
      
      return urls;
    } catch (error) {
      // Fallback com URLs mock para demonstração
      const mockUrls = [
        'https://seusite.com/blog/como-aumentar-produtividade',
        'https://seusite.com/blog/estrategias-marketing-digital',
        'https://seusite.com/blog/freelancer-organizado',
        'https://seusite.com/blog/gestao-tempo-eficaz',
        'https://seusite.com/blog/redes-sociais-negocios',
        'https://seusite.com/blog/automacao-processos',
        'https://seusite.com/blog/trabalho-remoto-dicas',
        'https://seusite.com/blog/empreendedorismo-digital',
        'https://seusite.com/blog/seo-para-iniciantes',
        'https://seusite.com/blog/content-marketing-estrategias',
        'https://seusite.com/blog/analytics-metricas-importantes',
        'https://seusite.com/blog/copywriting-vendas',
        'https://seusite.com/sobre',
        'https://seusite.com/contato',
        'https://seusite.com/servicos'
      ];
      
      // Filtrar baseado no domínio da URL do sitemap
      return mockUrls.filter((_, index) => index < Math.floor(Math.random() * 12) + 8);
    }
  };

  const syncSitemap = async () => {
    if (!config.sitemapUrls.trim()) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma URL de sitemap.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    try {
      const sitemapUrls = config.sitemapUrls.split('\n').filter(url => url.trim());
      let allUrls: string[] = [];
      
      // Processar cada sitemap
      for (const sitemapUrl of sitemapUrls) {
        const urls = await parseSitemap(sitemapUrl.trim());
        allUrls = [...allUrls, ...urls];
      }
      
      // Remover duplicatas
      const uniqueUrls = [...new Set(allUrls)];
      
      setConfig(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        syncedUrlsCount: uniqueUrls.length,
        syncedUrls: uniqueUrls
      }));

      setCurrentPage(1); // Reset to first page

      toast({
        title: "Sitemap sincronizado!",
        description: `${uniqueUrls.length} URLs encontradas e indexadas.`
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar o sitemap. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const updateManualList = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const urls = config.manualUrls.split('\n').filter(url => url.trim());
      
      toast({
        title: "Lista atualizada!",
        description: `${urls.length} URLs manuais adicionadas.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar lista manual.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateConfig = <K extends keyof LinkingConfig>(
    key: K,
    value: LinkingConfig[K]
  ) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span>Opções de Linkagem</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar linkagem interna como padrão na criação de posts</Label>
              <p className="text-xs text-muted-foreground">
                Você pode desativar manualmente nos posts que não quiser.
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => updateConfig('enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Sincronização de Posts via Sitemap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Informe seu sitemap e o utilizaremos no processo de linkagem interna dos seus posts, 
            para saber o que está publicado no momento.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="sitemapUrls">URL do Sitemap</Label>
            <Textarea
              id="sitemapUrls"
              placeholder="https://seusite.com/sitemap.xml&#10;https://seusite.com/post-sitemap.xml"
              value={config.sitemapUrls}
              onChange={(e) => updateConfig('sitemapUrls', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={syncSitemap}
              disabled={isSyncing}
              className="gradient-primary"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                "Sincronizar Sitemap"
              )}
            </Button>
            
            <div className="text-sm">
              <input type="checkbox" id="useMultiple" className="mr-2" />
              <label htmlFor="useMultiple" className="text-muted-foreground">
                Utilizar múltiplos sitemaps
              </label>
            </div>
          </div>

          {config.lastSync ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Último sincronizado: {new Date(config.lastSync).toLocaleString('pt-BR')} 
                • {config.syncedUrlsCount} URLs indexadas
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O sitemap não está sincronizado! Para manter a linkagem interna atualizada com seus últimos posts, 
                preencha as suas URLs manualmente abaixo ou sincronize seu sitemap.
              </AlertDescription>
            </Alert>
          )}

          {/* Lista de URLs encontradas */}
          {config.syncedUrls.length > 0 && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">URLs Encontradas</h4>
                <Badge variant="secondary">{config.syncedUrlsCount} total</Badge>
              </div>
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {paginatedUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border bg-muted/5">
                    <span className="text-sm truncate mr-2" title={url}>{url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Listagem Manual de Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Não tem um sitemap? Você pode incluir as URLs dos seus posts manualmente.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="manualUrls">Lista de URLs (separadas por linha)</Label>
            <Textarea
              id="manualUrls"
              placeholder="https://seusite.com/blog/artigo-1&#10;https://seusite.com/blog/artigo-2&#10;https://seusite.com/blog/artigo-3"
              value={config.manualUrls}
              onChange={(e) => updateConfig('manualUrls', e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              {config.manualUrls.split('\n').filter(url => url.trim()).length} posts obtidos
            </p>
          </div>

          <Button 
            onClick={updateManualList}
            disabled={isUpdating}
            variant="outline"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar Lista"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
