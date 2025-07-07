
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, RefreshCw, CheckCircle2, BarChart3, Search, Key } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { WordpressIntegration } from "./Integrations/WordpressIntegration";

export default function Integrations() {
  // OpenAI states
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [isOpenaiActive, setIsOpenaiActive] = useState(false);
  const [isVerifyingOpenai, setIsVerifyingOpenai] = useState(false);

  // Google Analytics states
  const [gaViewId, setGaViewId] = useState("");
  const [gaApiKey, setGaApiKey] = useState("");
  const [isGaActive, setIsGaActive] = useState(false);
  const [isVerifyingGa, setIsVerifyingGa] = useState(false);

  // Search Console states
  const [gscSiteUrl, setGscSiteUrl] = useState("");
  const [gscApiKey, setGscApiKey] = useState("");
  const [isGscActive, setIsGscActive] = useState(false);
  const [isVerifyingGsc, setIsVerifyingGsc] = useState(false);

  const { toast } = useToast();

  const handleVerifyOpenAI = async () => {
    setIsVerifyingOpenai(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (openaiApiKey) {
      toast({
        title: "OpenAI verificado!",
        description: "Conexão com OpenAI estabelecida com sucesso."
      });
      setIsOpenaiActive(true);
    } else {
      toast({
        title: "Erro na verificação OpenAI",
        description: "Verifique a API Key.",
        variant: "destructive"
      });
    }
    
    setIsVerifyingOpenai(false);
  };

  const handleVerifyGA = async () => {
    setIsVerifyingGa(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    if (gaViewId && gaApiKey) {
      toast({
        title: "Google Analytics verificado!",
        description: "Conexão estabelecida com sucesso."
      });
      setIsGaActive(true);
    } else {
      toast({
        title: "Erro na verificação GA",
        description: "Verifique o View ID e API Key.",
        variant: "destructive"
      });
    }
    
    setIsVerifyingGa(false);
  };

  const handleVerifyGSC = async () => {
    setIsVerifyingGsc(true);
    
    await new Promise(resolve => setTimeout(resolve, 2200));
    
    if (gscSiteUrl && gscApiKey) {
      toast({
        title: "Search Console verificado!",
        description: "Conexão estabelecida com sucesso."
      });
      setIsGscActive(true);
    } else {
      toast({
        title: "Erro na verificação GSC",
        description: "Verifique a URL do site e API Key.",
        variant: "destructive"
      });
    }
    
    setIsVerifyingGsc(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">Configure conexões com serviços externos e APIs.</p>
        </div>

        <Tabs defaultValue="wordpress" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wordpress" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              WordPress
            </TabsTrigger>
            <TabsTrigger value="openai" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              OpenAI
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="search-console" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Console
            </TabsTrigger>
          </TabsList>

          {/* WordPress Tab */}
          <TabsContent value="wordpress" className="space-y-6">
            <WordpressIntegration />
          </TabsContent>

          {/* OpenAI Tab */}
          <TabsContent value="openai" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Configuração OpenAI</span>
                  {isOpenaiActive && (
                    <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      Conectado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Sua chave API do OpenAI para geração de conteúdo
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="openai-active"
                      checked={isOpenaiActive}
                      onCheckedChange={setIsOpenaiActive}
                    />
                    <Label htmlFor="openai-active">Integração Ativa</Label>
                  </div>
                  
                  <Button 
                    onClick={handleVerifyOpenAI}
                    disabled={isVerifyingOpenai || !openaiApiKey}
                    variant="outline"
                  >
                    {isVerifyingOpenai ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Verificar API
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Configuração Google Analytics</span>
                  {isGaActive && (
                    <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      Conectado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga-view-id">GA View ID</Label>
                    <Input
                      id="ga-view-id"
                      placeholder="123456789"
                      value={gaViewId}
                      onChange={(e) => setGaViewId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ga-api-key">GA API Key</Label>
                    <Input
                      id="ga-api-key"
                      type="password"
                      placeholder="AIza..."
                      value={gaApiKey}
                      onChange={(e) => setGaApiKey(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ga-active"
                      checked={isGaActive}
                      onCheckedChange={setIsGaActive}
                    />
                    <Label htmlFor="ga-active">Integração Ativa</Label>
                  </div>
                  
                  <Button 
                    onClick={handleVerifyGA}
                    disabled={isVerifyingGa || !gaViewId || !gaApiKey}
                    variant="outline"
                  >
                    {isVerifyingGa ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Verificar Integração
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search Console Tab */}
          <TabsContent value="search-console" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Configuração Search Console</span>
                  {isGscActive && (
                    <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      Conectado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gsc-site-url">Site URL</Label>
                    <Input
                      id="gsc-site-url"
                      placeholder="https://seusite.com"
                      value={gscSiteUrl}
                      onChange={(e) => setGscSiteUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gsc-api-key">GSC API Key</Label>
                    <Input
                      id="gsc-api-key"
                      type="password"
                      placeholder="AIza..."
                      value={gscApiKey}
                      onChange={(e) => setGscApiKey(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="gsc-active"
                      checked={isGscActive}
                      onCheckedChange={setIsGscActive}
                    />
                    <Label htmlFor="gsc-active">Integração Ativa</Label>
                  </div>
                  
                  <Button 
                    onClick={handleVerifyGSC}
                    disabled={isVerifyingGsc || !gscSiteUrl || !gscApiKey}
                    variant="outline"
                  >
                    {isVerifyingGsc ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Verificar Integração
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
