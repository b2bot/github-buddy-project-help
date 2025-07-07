import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, List, ListOrdered, Quote, Code, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { openai } from "@/integrations/openai";
import { ImportContentModal } from "@/components/manual/ImportContentModal";
import { VideoEmbedModal } from "@/components/manual/VideoEmbedModal";
import { CreatePostWizard } from "@/components/manual/CreatePostWizard";
import { SeoConfigTab } from "@/components/seoSidebar/SeoConfigTab";
import { SeoSidebar } from "@/components/seoSidebar/SeoSidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { wordpress } from "@/integrations/wordpress";

export default function Manual() {
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>("");
  const [isGeneratingParagraph, setIsGeneratingParagraph] = useState(false);
  const [currentHeadingLevel, setCurrentHeadingLevel] = useState("normal");
  const [currentFontSize, setCurrentFontSize] = useState("14");
  const [isInQueue, setIsInQueue] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Blockquote,
      CodeBlock,
      TextStyle,
      Image,
    ],
    content: '<h1>Título do seu artigo</h1><p>Comece a escrever seu conteúdo aqui...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onSelectionUpdate: ({ editor }) => {
      if (editor.isActive('heading', { level: 1 })) {
        setCurrentHeadingLevel('h1');
      } else if (editor.isActive('heading', { level: 2 })) {
        setCurrentHeadingLevel('h2');
      } else if (editor.isActive('heading', { level: 3 })) {
        setCurrentHeadingLevel('h3');
      } else if (editor.isActive('heading', { level: 4 })) {
        setCurrentHeadingLevel('h4');
      } else if (editor.isActive('heading', { level: 5 })) {
        setCurrentHeadingLevel('h5');
      } else {
        setCurrentHeadingLevel('normal');
      }
    },
  });

  const formatText = (format: string) => {
    if (!editor) return;

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'ordered':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
    }
  };

  const handleHeadingChange = (level: string) => {
    if (!editor) return;
    
    if (level === "normal") {
      editor.chain().focus().setParagraph().run();
    } else {
      const headingLevel = parseInt(level.replace('h', '')) as 1 | 2 | 3 | 4 | 5;
      editor.chain().focus().toggleHeading({ level: headingLevel }).run();
    }
    setCurrentHeadingLevel(level);
  };

  const handleFontSizeChange = (size: string) => {
    if (!editor) return;
    
    const selection = editor.state.selection;
    if (selection.empty) {
      toast({
        title: "Selecione o texto",
        description: "Selecione o texto que deseja alterar o tamanho da fonte.",
        variant: "destructive"
      });
      return;
    }
    
    editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
    setCurrentFontSize(size);
  };

  const generateParagraphSuggestion = async () => {
    if (!editor) return;

    setIsGeneratingParagraph(true);
    try {
      const currentContent = editor.getText();
      const context = currentContent.slice(0, 200);
      
      const suggestion = await openai.generateParagraph(context);
      
      editor.chain().focus().insertContent(`<p>${suggestion}</p>`).run();
      
      toast({
        title: "Parágrafo gerado!",
        description: "Sugestão da IA inserida no editor."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar sugestão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingParagraph(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 102400) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 100KB.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Apenas arquivos de imagem são permitidos.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
        toast({
          title: "Imagem inserida!",
          description: "Imagem adicionada ao conteúdo com sucesso."
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFeaturedImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 102400) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 100KB.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Apenas arquivos de imagem são permitidos.",
        variant: "destructive"
      });
      return;
    }

    setFeaturedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFeaturedImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Imagem de destaque carregada!",
      description: "Imagem de destaque adicionada com sucesso."
    });
  };

  const handleSaveDraft = () => {
    const content = editor?.getHTML() || '';
    const title = editor?.getText().split('\n')[0] || 'Novo artigo';
    
    // Create draft post object
    const draftPost = {
      id: Date.now().toString(),
      title,
      content,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      excerpt,
      metaDescription,
      altText,
      keyword,
      status: "draft" as const,
      category: "Produtividade",
      createdAt: new Date().toISOString().split('T')[0],
      wordCount: content.replace(/<[^>]*>/g, '').split(' ').length,
      readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200) + ' min',
      featuredImageUrl: featuredImagePreview || undefined
    };

    // Add to localStorage for persistence
    const existingPosts = JSON.parse(localStorage.getItem('draftPosts') || '[]');
    existingPosts.unshift(draftPost);
    localStorage.setItem('draftPosts', JSON.stringify(existingPosts));

    // Dispatch custom event to notify Posts page
    window.dispatchEvent(new CustomEvent('postSaved', { detail: draftPost }));
    
    toast({
      title: "Rascunho salvo!",
      description: "Seu artigo foi salvo nos rascunhos."
    });
  };

  const handleSendToQueue = async () => {
    const content = editor?.getHTML() || '';
    const title = editor?.getText().split('\n')[0] || 'Novo artigo';
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Preencha o título e conteúdo do artigo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPublishing(true);
    
    try {
      const postData = {
        id: Date.now().toString(),
        title,
        content,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        metaDescription,
        altText,
        keyword,
        status: "publish" as const,
        featuredImageUrl: featuredImagePreview || undefined
      };

      const result = await wordpress.publishPost(postData);
      
      if (result.success) {
        setIsInQueue(false);
        
        // Add to published posts
        const publishedPost = {
          ...postData,
          status: 'published' as const,
          publishedAt: new Date().toISOString(),
          category: "Produtividade",
          createdAt: new Date().toISOString().split('T')[0],
          wordCount: content.replace(/<[^>]*>/g, '').split(' ').length,
          readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200) + ' min'
        };
        
        const existingPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
        existingPosts.unshift(publishedPost);
        localStorage.setItem('publishedPosts', JSON.stringify(existingPosts));

        // Dispatch event to notify Posts page
        window.dispatchEvent(new CustomEvent('postPublished', { detail: publishedPost }));
        
        toast({
          title: "Post publicado!",
          description: "Seu artigo foi publicado no WordPress com sucesso."
        });
      } else {
        toast({
          title: "Erro na publicação",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro na publicação",
        description: "Erro ao publicar no WordPress. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a data e horário do agendamento.",
        variant: "destructive"
      });
      return;
    }

    const content = editor?.getHTML() || '';
    const title = editor?.getText().split('\n')[0] || 'Novo artigo';
    const scheduledAt = `${scheduleDate}T${scheduleTime}`;
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Preencha o título e conteúdo do artigo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsScheduling(true);
    
    try {
      const postData = {
        id: Date.now().toString(),
        title,
        content,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        metaDescription,
        altText,
        keyword,
        featuredImageUrl: featuredImagePreview || undefined,
        scheduledAt,
        status: "future" as const
      };

      const result = await wordpress.schedulePost(postData, scheduledAt);
      
      if (result.success) {
        // Add to scheduled posts
        const scheduledPost = {
          ...postData,
          status: 'scheduled' as const,
          category: "Produtividade",
          createdAt: new Date().toISOString().split('T')[0],
          scheduledAt,
          wordCount: content.replace(/<[^>]*>/g, '').split(' ').length,
          readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200) + ' min'
        };

        const existingPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
        existingPosts.unshift(scheduledPost);
        localStorage.setItem('scheduledPosts', JSON.stringify(existingPosts));

        // Dispatch event to notify Posts page
        window.dispatchEvent(new CustomEvent('postScheduled', { detail: scheduledPost }));

        setIsScheduleModalOpen(false);
        setScheduleDate("");
        setScheduleTime("");
        
        toast({
          title: "Post agendado!",
          description: `Seu artigo foi agendado para ${new Date(scheduledAt).toLocaleString('pt-BR')}.`
        });
      } else {
        toast({
          title: "Erro no agendamento",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no agendamento",
        description: "Erro ao agendar post. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleRemoveFromQueue = () => {
    setIsInQueue(false);
    toast({
      title: "Removido da fila",
      description: "Artigo removido da fila de geração."
    });
  };

  const handleImportContent = (content: string) => {
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  const handleInsertVideo = (html: string) => {
    if (editor) {
      editor.chain().focus().insertContent(html).run();
    }
  };

  if (!editor) {
    return null;
  }

  const currentContent = editor.getHTML();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Escrever Manualmente</h1>
          <p className="text-muted-foreground">Crie seu conteúdo com editor rico e otimizações SEO.</p>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="import">Importar Conteúdo</TabsTrigger>
            <TabsTrigger value="create">Criar com IA</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <ImportContentModal onImport={handleImportContent} />
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <CreatePostWizard onImport={handleImportContent} />
            </div>
          </TabsContent>

          <TabsContent value="editor" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Editor de Conteúdo</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Fonte:</span>
                        <Select value={currentFontSize} onValueChange={handleFontSizeChange}>
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="14">14</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Nível:</span>
                        <Select value={currentHeadingLevel} onValueChange={handleHeadingChange}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Texto Normal</SelectItem>
                            <SelectItem value="h1">H1</SelectItem>
                            <SelectItem value="h2">H2</SelectItem>
                            <SelectItem value="h3">H3</SelectItem>
                            <SelectItem value="h4">H4</SelectItem>
                            <SelectItem value="h5">H5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4 pb-4 border-b">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('bold')}
                        className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        <Bold className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('italic')}
                        className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        <Italic className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('bullet')}
                        className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        <List className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('ordered')}
                        className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        <ListOrdered className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('blockquote')}
                        className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        <Quote className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('code')}
                        className={`h-8 w-8 p-0 ${editor.isActive('codeBlock') ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        <Code className="h-3 w-3" />
                      </Button>
                      
                      <VideoEmbedModal onInsert={handleInsertVideo} />
                      
                      <label htmlFor="image-upload">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <span className="cursor-pointer">
                            <ImageIcon className="h-3 w-3" />
                          </span>
                        </Button>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateParagraphSuggestion}
                        disabled={isGeneratingParagraph}
                        className="ml-auto bg-gradient-primary text-white hover:opacity-90 h-8"
                      >
                        {isGeneratingParagraph ? (
                          <>
                            <Sparkles className="mr-1 h-3 w-3 animate-pulse" />
                            <span className="text-xs">Gerando...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-3 w-3" />
                            <span className="text-xs">Sugerir</span>
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <EditorContent 
                      editor={editor}
                      className="border rounded-lg min-h-[500px] bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                {isInQueue && (
                  <Alert className="mb-4 border-primary/20 bg-primary/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este artigo está na fila de geração.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary underline"
                        onClick={() => window.location.href = '/posts?tab=queue'}
                      >
                        Clique aqui para editar ou remover.
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="config" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="config" className="text-xs">Config SEO</TabsTrigger>
                    <TabsTrigger value="optimization" className="text-xs">Otimização</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="config" className="mt-4">
                    <SeoConfigTab
                      keyword={keyword}
                      setKeyword={setKeyword}
                      slug={slug}
                      setSlug={setSlug}
                      excerpt={excerpt}
                      setExcerpt={setExcerpt}
                      metaDescription={metaDescription}
                      setMetaDescription={setMetaDescription}
                      altText={altText}
                      setAltText={setAltText}
                      featuredImage={featuredImage}
                      featuredImagePreview={featuredImagePreview}
                      handleImageUpload={handleFeaturedImageUpload}
                      handleSaveDraft={handleSaveDraft}
                      handleSendToQueue={handleSendToQueue}
                      handleSchedulePost={() => setIsScheduleModalOpen(true)}
                      isInQueue={isInQueue}
                      isPublishing={isPublishing}
                      isScheduling={isScheduling}
                      onRemoveFromQueue={handleRemoveFromQueue}
                    />
                  </TabsContent>
                  
                  <TabsContent value="optimization" className="mt-4">
                    <SeoSidebar
                      content={currentContent}
                      keyword={keyword}
                      metaDescription={metaDescription}
                      slug={slug}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Publicação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Escolha quando este artigo deve ser publicado no WordPress.
            </p>
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Data</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Horário</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSchedulePost} 
                disabled={!scheduleDate || !scheduleTime || isScheduling}
                className="bg-gradient-primary"
              >
                {isScheduling ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  'Confirmar Agendamento'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
