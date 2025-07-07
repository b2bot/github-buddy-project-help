import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, Globe, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportContentModalProps {
  onImport: (content: string) => void;
}

export function ImportContentModal({ onImport }: ImportContentModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleYouTubeImport = async () => {
    if (!youtubeUrl) return;
    
    setIsImporting(true);
    try {
      // Mock YouTube transcription extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscription = `# Transcrição do Vídeo YouTube

Esta é uma transcrição simulada do vídeo fornecido. O conteúdo seria extraído automaticamente do YouTube e formatado como um artigo base.

## Principais Pontos Abordados

- Ponto principal 1 do vídeo
- Estratégia importante mencionada
- Dicas práticas compartilhadas
- Conclusões relevantes

O sistema utilizaria a API do YouTube para extrair legendas automáticas ou transcrições disponíveis, formatando o conteúdo de forma estruturada para facilitar a edição posterior.

*Observação: Este é um exemplo de como o conteúdo seria importado.*`;

      onImport(mockTranscription);
      setOpen(false);
      setYoutubeUrl("");
      
      toast({
        title: "Conteúdo importado!",
        description: "Transcrição do YouTube foi adicionada ao editor."
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível extrair o conteúdo do vídeo.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleArticleImport = async () => {
    if (!articleUrl) return;
    
    setIsImporting(true);
    try {
      // Mock article content extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockArticleContent = `# Artigo Importado

Este é um exemplo de conteúdo extraído automaticamente de um artigo web. O sistema utilizaria técnicas de scraping para extrair o texto principal, removendo elementos de navegação, publicidade e outros ruídos.

## Conteúdo Principal

O artigo original continha informações valiosas sobre o tema abordado. Aqui está um resumo estruturado:

### Introdução
Contexto e objetivos do artigo original.

### Desenvolvimento
- Pontos principais abordados
- Argumentos e evidências apresentadas
- Exemplos práticos mencionados

### Conclusão
Síntese das ideias principais e recomendações finais.

*Fonte: ${articleUrl}*
*Importado automaticamente e formatado para edição.*`;

      onImport(mockArticleContent);
      setOpen(false);
      setArticleUrl("");
      
      toast({
        title: "Artigo importado!",
        description: "Conteúdo do artigo foi adicionado ao editor."
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível extrair o conteúdo do artigo.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Importar Conteúdo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Conteúdo Externo</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="article" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Artigo
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importar do YouTube</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="youtube-url">URL do Vídeo YouTube</Label>
                  <Input
                    id="youtube-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    O sistema extrairá as legendas/transcrição disponíveis
                  </p>
                </div>
                
                <Button 
                  onClick={handleYouTubeImport}
                  disabled={!youtubeUrl || isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extraindo Transcrição...
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" />
                      Importar do YouTube
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="article">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importar Artigo Web</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="article-url">URL do Artigo</Label>
                  <Input
                    id="article-url"
                    placeholder="https://exemplo.com/artigo"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Extrairemos o texto principal automaticamente
                  </p>
                </div>
                
                <Button 
                  onClick={handleArticleImport}
                  disabled={!articleUrl || isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extraindo Conteúdo...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Importar Artigo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}