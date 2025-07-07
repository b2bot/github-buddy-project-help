
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Youtube, Link, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostMethodsModalProps {
  onImport: (content: string) => void;
}

export function CreatePostMethodsModal({ onImport }: CreatePostMethodsModalProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Audience Interests
  const [audienceInterests, setAudienceInterests] = useState("");
  
  // YouTube Video
  const [youtubeUrl, setYoutubeUrl] = useState("");
  
  // URLs/Text
  const [urlList, setUrlList] = useState("");
  const [pastedText, setPastedText] = useState("");
  
  const { toast } = useToast();

  const processAudienceInterests = async () => {
    if (!audienceInterests.trim()) return;
    
    setIsProcessing(true);
    try {
      // Mock AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = `
        <h1>Conteúdo baseado nos interesses do público</h1>
        <p>Este conteúdo foi gerado com base nos interesses: ${audienceInterests}</p>
        <h2>Introdução</h2>
        <p>Baseado na análise dos interesses do seu público, criamos este conteúdo personalizado que aborda os principais pontos de interesse identificados.</p>
        <h2>Desenvolvimento</h2>
        <p>O conteúdo foi estruturado para atender especificamente às necessidades e curiosidades do seu público-alvo.</p>
      `;
      
      onImport(generatedContent);
      setOpen(false);
      setAudienceInterests("");
      
      toast({
        title: "Conteúdo gerado!",
        description: "Conteúdo baseado nos interesses do público foi importado."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar interesses. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processYouTubeVideo = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsProcessing(true);
    try {
      // Mock YouTube transcription processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedContent = `
        <h1>Artigo baseado no vídeo do YouTube</h1>
        <p>Este conteúdo foi gerado a partir da transcrição do vídeo: ${youtubeUrl}</p>
        <h2>Pontos principais do vídeo</h2>
        <ul>
          <li>Ponto importante número 1 extraído do vídeo</li>
          <li>Segundo insight relevante identificado</li>
          <li>Terceira informação valiosa transcrita</li>
        </ul>
        <h2>Desenvolvimento dos temas</h2>
        <p>Com base na transcrição do vídeo, desenvolvemos os principais temas abordados de forma estruturada para criar um artigo completo e otimizado.</p>
      `;
      
      onImport(generatedContent);
      setOpen(false);
      setYoutubeUrl("");
      
      toast({
        title: "Vídeo processado!",
        description: "Conteúdo gerado a partir da transcrição do YouTube."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar vídeo. Verifique a URL.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processUrlsAndText = async () => {
    if (!urlList.trim() && !pastedText.trim()) return;
    
    setIsProcessing(true);
    try {
      // Mock URLs and text processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const sourceContent = urlList.trim() || pastedText.trim();
      const generatedContent = `
        <h1>Artigo baseado em fontes externas</h1>
        <p>Este conteúdo foi gerado a partir da análise de URLs e textos fornecidos.</p>
        <h2>Síntese das fontes</h2>
        <p>Fonte analisada: ${sourceContent.substring(0, 100)}...</p>
        <h2>Principais insights</h2>
        <ul>
          <li>Insight extraído das fontes analisadas</li>
          <li>Segunda informação relevante identificada</li>
          <li>Terceiro ponto importante compilado</li>
        </ul>
        <h2>Conclusão</h2>
        <p>Com base na análise das fontes fornecidas, criamos este conteúdo estruturado que combina as melhores informações identificadas.</p>
      `;
      
      onImport(generatedContent);
      setOpen(false);
      setUrlList("");
      setPastedText("");
      
      toast({
        title: "Fontes processadas!",
        description: "Conteúdo gerado a partir das URLs e textos analisados."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar fontes. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary w-full">
          <Plus className="mr-2 h-4 w-4" />
          Criar Post com IA
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Métodos de Criação de Conteúdo</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="audience" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Interesses do Público
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              Vídeo YouTube
            </TabsTrigger>
            <TabsTrigger value="urls" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URLs/Texto
            </TabsTrigger>
          </TabsList>
          
          {/* Audience Interests Tab */}
          <TabsContent value="audience" className="space-y-4">
            <div>
              <Label htmlFor="audience-interests">Descreva os interesses do seu público</Label>
              <Textarea
                id="audience-interests"
                placeholder="Ex: Marketing digital, produtividade, empreendedorismo, ferramentas de automação..."
                value={audienceInterests}
                onChange={(e) => setAudienceInterests(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Descreva os principais interesses, dores e necessidades do seu público-alvo
              </p>
            </div>
            
            <Button 
              onClick={processAudienceInterests}
              disabled={isProcessing || !audienceInterests.trim()}
              className="w-full gradient-primary"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Gerando conteúdo...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Conteúdo Personalizado
                </>
              )}
            </Button>
          </TabsContent>
          
          {/* YouTube Video Tab */}
          <TabsContent value="youtube" className="space-y-4">
            <div>
              <Label htmlFor="youtube-url">URL do Vídeo YouTube</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                A IA irá transcrever e gerar um artigo baseado no conteúdo do vídeo
              </p>
            </div>
            
            <Button 
              onClick={processYouTubeVideo}
              disabled={isProcessing || !youtubeUrl.trim()}
              className="w-full gradient-primary"
            >
              {isProcessing ? (
                <>
                  <Youtube className="mr-2 h-4 w-4 animate-pulse" />
                  Transcrevendo vídeo...
                </>
              ) : (
                <>
                  <Youtube className="mr-2 h-4 w-4" />
                  Importar e Transcrever Vídeo
                </>
              )}
            </Button>
          </TabsContent>
          
          {/* URLs and Text Tab */}
          <TabsContent value="urls" className="space-y-4">
            <div>
              <Label htmlFor="url-list">Lista de URLs (uma por linha)</Label>
              <Textarea
                id="url-list"
                placeholder="https://example.com/artigo1&#10;https://example.com/artigo2&#10;https://example.com/artigo3"
                value={urlList}
                onChange={(e) => setUrlList(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              OU
            </div>
            
            <div>
              <Label htmlFor="pasted-text">Texto colado diretamente</Label>
              <Textarea
                id="pasted-text"
                placeholder="Cole aqui o texto que você quer que a IA analise e transforme em artigo..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={6}
              />
            </div>
            
            <Button 
              onClick={processUrlsAndText}
              disabled={isProcessing || (!urlList.trim() && !pastedText.trim())}
              className="w-full gradient-primary"
            >
              {isProcessing ? (
                <>
                  <Link className="mr-2 h-4 w-4 animate-pulse" />
                  Importando via IA...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Importar via IA
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
