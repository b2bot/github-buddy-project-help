import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Youtube, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [method, setMethod] = useState<"interests" | "youtube">("interests");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    keywords: "",
    articleSize: "800",
    interests: "",
    youtubeUrl: "",
    altText: "",
    metaDescription: "",
    advancedOptions: false,
    mentionProject: false,
    internalLinking: false
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Post criado com sucesso!",
      description: "Seu post foi adicionado à fila de geração.",
    });
    
    onOpenChange(false);
    // Reset form
    setFormData({
      title: "",
      category: "",
      keywords: "",
      articleSize: "800",
      interests: "",
      youtubeUrl: "",
      altText: "",
      metaDescription: "",
      advancedOptions: false,
      mentionProject: false,
      internalLinking: false
    });
  };

  const generateSuggestions = () => {
    const suggestions = [
      "5 Estratégias de Produtividade para Social Media Freelancers",
      "Como Gerenciar Múltiplos Clientes de Social Media",
      "Ferramentas Essenciais para Freelancers de Marketing Digital"
    ];
    setFormData({ ...formData, title: suggestions[Math.floor(Math.random() * suggestions.length)] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Novo Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Método de Criação</Label>
            <Tabs value={method} onValueChange={(value) => setMethod(value as typeof method)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="interests">
                  <Users className="w-4 h-4 mr-2" />
                  Interesses do Público
                </TabsTrigger>
                <TabsTrigger value="youtube">
                  <Youtube className="w-4 h-4 mr-2" />
                  Vídeo do YouTube
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="interests" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="interests">Temas de Interesse</Label>
                  <Textarea
                    id="interests"
                    placeholder="Descreva os temas que interessam ao seu público-alvo..."
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">URL do Vídeo do YouTube</Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    A transcrição será extraída automaticamente para gerar o conteúdo
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Post</Label>
              <div className="flex space-x-2">
                <Input
                  id="title"
                  placeholder="Digite o título ou gere sugestões"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSuggestions}
                  className="shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produtividade">Produtividade</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="negocios">Negócios</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Palavra-chave Principal</Label>
            <Textarea
              id="keywords"
              placeholder="freelancer social media, produtividade, gestão de clientes..."
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="articleSize">Tamanho do Artigo (palavras)</Label>
            <Input
              id="articleSize"
              type="number"
              min="300"
              max="3000"
              value={formData.articleSize}
              onChange={(e) => setFormData({ ...formData, articleSize: e.target.value })}
            />
          </div>

          {/* Advanced Options */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <span className="font-medium">Opções Avançadas</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altText">Texto Alternativo da Imagem</Label>
                  <Input
                    id="altText"
                    placeholder="Descrição da imagem para SEO"
                    value={formData.altText}
                    onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Input
                    id="metaDescription"
                    placeholder="Descrição para mecanismos de busca"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="mentionProject"
                    checked={formData.mentionProject}
                    onCheckedChange={(checked) => setFormData({ ...formData, mentionProject: checked })}
                  />
                  <Label htmlFor="mentionProject">Mencionar projetos da agência</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="internalLinking"
                    checked={formData.internalLinking}
                    onCheckedChange={(checked) => setFormData({ ...formData, internalLinking: checked })}
                  />
                  <Label htmlFor="internalLinking">Incluir linkagem interna</Label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="gradient-primary">
              Enviar para Fila de Geração
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}