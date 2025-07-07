import { RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Send, Upload, X, Trash2 } from "lucide-react";

interface SeoConfigTabProps {
  keyword: string;
  setKeyword: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  excerpt: string;
  setExcerpt: (value: string) => void;
  metaDescription: string;
  setMetaDescription: (value: string) => void;
  altText: string;
  setAltText: (value: string) => void;
  featuredImage: File | null;
  featuredImagePreview: string;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveDraft: () => void;
  handleSendToQueue: () => void;
  handleSchedulePost: () => void;
  isInQueue?: boolean;
  isPublishing?: boolean;
  isScheduling?: boolean;
  onRemoveFromQueue?: () => void;
}

export function SeoConfigTab({
  keyword,
  setKeyword,
  slug,
  setSlug,
  excerpt,
  setExcerpt,
  metaDescription,
  setMetaDescription,
  altText,
  setAltText,
  featuredImage,
  featuredImagePreview,
  handleImageUpload,
  handleSaveDraft,
  handleSendToQueue,
  handleSchedulePost,
  isInQueue = false,
  isPublishing = false,
  isScheduling = false,
  onRemoveFromQueue
}: SeoConfigTabProps) {
  return (
    <div className="space-y-4">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Configurações SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="keyword">Palavra-chave Principal</Label>
            <Input
              id="keyword"
              placeholder="palavra-chave principal"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug da URL</Label>
            <Input
              id="slug"
              placeholder="meu-artigo-incrivel"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="excerpt">Descrição Curta / Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Resumo breve do artigo (1-2 linhas)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              placeholder="Descrição para mecanismos de busca (150-160 caracteres)"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metaDescription.length}/160 caracteres
            </p>
          </div>
          
          <div>
            <Label htmlFor="alt-text">Alt Text da Imagem de Capa</Label>
            <Input
              id="alt-text"
              placeholder="Descrição da imagem para acessibilidade"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="featured-image">Imagem de Destaque (máx. 100KB)</Label>
            <div className="space-y-3">
              {featuredImagePreview && (
                <div className="relative inline-block">
                  <img 
                    src={featuredImagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => {
                      setAltText("");
                      // Reset file input and preview
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              <label htmlFor="featured-image-input">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {featuredImage ? "Alterar Imagem" : "Upload Imagem"}
                  </span>
                </Button>
              </label>
              <input
                id="featured-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {featuredImage && (
                <p className="text-xs text-muted-foreground">
                  {featuredImage.name} ({(featuredImage.size / 1024).toFixed(1)}KB)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSaveDraft}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Rascunho
          </Button>
          
          {isInQueue ? (
            <div className="space-y-2">
              <Button 
                className="w-full bg-green-600 text-white hover:bg-green-700"
                disabled
              >
                <Send className="mr-2 h-4 w-4" />
                Na Fila
              </Button>
              {onRemoveFromQueue && (
                <Button 
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={onRemoveFromQueue}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover da Fila
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button 
                className="w-full bg-gradient-primary text-white hover:opacity-90"
                onClick={handleSendToQueue}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar para Fila
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleSchedulePost}
                disabled={isScheduling}
              >
                {isScheduling ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
