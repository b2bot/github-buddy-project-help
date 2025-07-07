import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, Code } from "lucide-react";

interface VideoEmbedModalProps {
  onInsert: (html: string) => void;
}

export function VideoEmbedModal({ onInsert }: VideoEmbedModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [open, setOpen] = useState(false);

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleYouTubeEmbed = () => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return;

    const embedHtml = `<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0" 
    allowfullscreen>
  </iframe>
</div>`;

    onInsert(embedHtml);
    setOpen(false);
    setYoutubeUrl("");
  };

  const handleCustomEmbed = () => {
    if (!embedCode.trim()) return;
    
    onInsert(embedCode);
    setOpen(false);
    setEmbedCode("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Youtube className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inserir Vídeo ou Embed</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="custom">HTML/iFrame</TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube" className="space-y-4">
            <div>
              <Label htmlFor="youtube-url">URL do Vídeo YouTube</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            
            {youtubeUrl && extractYouTubeId(youtubeUrl) && (
              <div className="p-4 border rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div className="aspect-video bg-black rounded flex items-center justify-center">
                  <Youtube className="h-12 w-12 text-white/50" />
                  <span className="ml-2 text-white/50">Vídeo do YouTube</span>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleYouTubeEmbed}
              disabled={!youtubeUrl || !extractYouTubeId(youtubeUrl)}
              className="w-full"
            >
              <Youtube className="mr-2 h-4 w-4" />
              Inserir Vídeo YouTube
            </Button>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div>
              <Label htmlFor="embed-code">Código HTML/iFrame</Label>
              <Textarea
                id="embed-code"
                placeholder="<iframe src='...' width='560' height='315'></iframe>"
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cole aqui o código embed de qualquer plataforma (Vimeo, Twitch, etc.)
              </p>
            </div>
            
            <Button 
              onClick={handleCustomEmbed}
              disabled={!embedCode.trim()}
              className="w-full"
            >
              <Code className="mr-2 h-4 w-4" />
              Inserir Embed Personalizado
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}