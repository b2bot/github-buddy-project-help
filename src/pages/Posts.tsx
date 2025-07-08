import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Users, Calendar, CheckCircle2, Clock, Edit3, Eye, MoreHorizontal, Trash2, Share, RefreshCw, PenTool } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { CreatePostSetModal } from "@/components/posts/CreatePostSetModal";
import { OpportunitiesTab } from "@/components/posts/OpportunitiesTab";
import { PreferencesTab } from "@/components/posts/PreferencesTab";
import { InternalLinkingTab } from "@/components/posts/InternalLinkingTab";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { wordpress } from "@/integrations/wordpress";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  status: "draft" | "pending" | "scheduled" | "published";
  category: string;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
  wordCount: number;
  readTime: string;
  image?: string;
}

interface GenerationItem {
  id: string;
  title: string;
  estimatedCompletion: string;
  progress: number;
  content?: string;
  slug?: string;
  excerpt?: string;
  metaDescription?: string;
  altText?: string;
  keyword?: string;
  featuredImage?: File | null;
  status?: string;
  scheduledAt?: string;
}

const statusConfig = {
  draft: { label: "Rascunho", icon: Edit3, className: "status-draft" },
  pending: { label: "Pendente", icon: Clock, className: "status-pending" },
  scheduled: { label: "Agendado", icon: Calendar, className: "status-scheduled" },
  published: { label: "Postado", icon: CheckCircle2, className: "status-published" }
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createSetModalOpen, setCreateSetModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [schedulePost, setSchedulePost] = useState<Post | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const { toast } = useToast();
  const [generationQueue, setGenerationQueue] = useState<GenerationItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = () => {
      const draftPosts = JSON.parse(localStorage.getItem('draftPosts') || '[]');
      const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
      const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
      
      const allPosts = [
        ...draftPosts,
        ...scheduledPosts, 
        ...publishedPosts
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setPosts(allPosts);
    };

    loadPosts();

    const handlePostSaved = (event: CustomEvent) => {
      const newPost = event.detail;
      setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const handlePostPublished = (event: CustomEvent) => {
      const newPost = event.detail;
      setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const handlePostScheduled = (event: CustomEvent) => {
      const newPost = event.detail;
      setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    window.addEventListener('postSaved', handlePostSaved as EventListener);
    window.addEventListener('postPublished', handlePostPublished as EventListener);
    window.addEventListener('postScheduled', handlePostScheduled as EventListener);

    return () => {
      window.removeEventListener('postSaved', handlePostSaved as EventListener);
      window.removeEventListener('postPublished', handlePostPublished as EventListener);
      window.removeEventListener('postScheduled', handlePostScheduled as EventListener);
    };
  }, []);

  useEffect(() => {
    const savedQueue = localStorage.getItem('generationQueue');
    if (savedQueue) {
      const queue = JSON.parse(savedQueue);
      setGenerationQueue(queue);
    }
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = {
    draft: posts.filter(p => p.status === 'draft').length,
    pending: posts.filter(p => p.status === 'pending').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length
  };

  const handleEditPost = (post: Post) => {
    setEditPost(post);
    setCreateModalOpen(true);
  };

  const handleDeletePost = (post: Post) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
    
    const draftPosts = JSON.parse(localStorage.getItem('draftPosts') || '[]').filter((p: any) => p.id !== post.id);
    const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]').filter((p: any) => p.id !== post.id);
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]').filter((p: any) => p.id !== post.id);
    
    localStorage.setItem('draftPosts', JSON.stringify(draftPosts));
    localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
    localStorage.setItem('publishedPosts', JSON.stringify(publishedPosts));
    
    toast({
      title: "Post excluído",
      description: `"${post.title}" foi removido com sucesso.`
    });
  };

  const handleSchedulePost = (post: Post) => {
    setSchedulePost(post);
  };

  const handleConfirmSchedule = async () => {
    if (!schedulePost || !scheduleDate || !scheduleTime) return;

    const scheduledDateTime = `${scheduleDate}T${scheduleTime}`;
    
    try {
      const updatedPost = {
        ...schedulePost,
        status: "scheduled" as const,
        scheduledAt: scheduledDateTime
      };

      await wordpress.publishPost({ ...updatedPost, content: "Mock content for publishing" });
      
      setPosts(prevPosts => 
        prevPosts.map(p => p.id === schedulePost.id ? updatedPost : p)
      );

      toast({
        title: "Post agendado",
        description: `"${schedulePost.title}" foi agendado para ${new Date(scheduledDateTime).toLocaleString('pt-BR')}.`
      });
      
      setSchedulePost(null);
      setScheduleDate("");
      setScheduleTime("");
    } catch (error) {
      toast({
        title: "Erro no agendamento",
        description: "Falha ao agendar o post. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleResendPost = async (post: Post) => {
    try {
      await wordpress.publishPost({ ...post, content: "Mock content for publishing" });
      toast({
        title: "Post reenviado",
        description: `"${post.title}" foi reenviado para o WordPress.`
      });
    } catch (error) {
      toast({
        title: "Erro no reenvio",
        description: "Falha ao reenviar o post. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handlePreviewPost = (post: Post) => {
    setPreviewPost(post);
  };

  const handleViewProgress = () => {
    setActiveTab("queue");
    setTimeout(() => {
      const queueSection = document.querySelector('[data-tab="queue"]');
      if (queueSection) {
        queueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleRemoveFromQueue = (itemId: string) => {
    const updatedQueue = generationQueue.filter(item => item.id !== itemId);
    setGenerationQueue(updatedQueue);
    localStorage.setItem('generationQueue', JSON.stringify(updatedQueue));
    
    toast({
      title: "Item removido",
      description: "Item removido da fila de geração."
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <p className="text-muted-foreground">Crie, revise e aprove os posts do seu blog.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/conteudo')} 
              className="bg-gradient-primary hover:opacity-90 flex items-center space-x-2"
            >
              <PenTool className="mr-2 h-4 w-4" />
              📝 Criar Conteúdo
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="posts">Lista de Posts</TabsTrigger>
            <TabsTrigger value="queue">
              Fila de Geração
              {generationQueue.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {generationQueue.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="opportunities">🔍 Oportunidades</TabsTrigger>
            <TabsTrigger value="preferences">⚙️ Preferências</TabsTrigger>
            <TabsTrigger value="linking">🔗 Linkagem Interna</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                const config = statusConfig[status as keyof typeof statusConfig];
                const Icon = config.icon;
                return (
                  <Card key={status} className="glass hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="flex items-center p-6">
                      <div className={`p-3 rounded-lg mr-4 ${
                        status === 'draft' ? 'bg-muted text-muted-foreground' :
                        status === 'pending' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        status === 'scheduled' ? 'bg-primary/10 text-primary' :
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-sm text-muted-foreground">{config.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Busque um post"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="Produtividade">Produtividade</SelectItem>
                  <SelectItem value="Negócios">Negócios</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="published">Postado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {generationQueue.length > 0 && (
              <Card className="glass border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="animate-pulse">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium">Você tem {generationQueue.length} artigos em elaboração</p>
                        <p className="text-sm text-muted-foreground">
                          Estimamos que dentro de {generationQueue[0]?.estimatedCompletion || '15 min'} eles estarão prontos
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleViewProgress}>
                      Visualizar progresso
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const config = statusConfig[post.status];
                const Icon = config.icon;
                return (
                  <Card key={post.id} className="glass hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {post.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={post.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Badge className={config.className}>
                                <Icon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                              <h3 className="font-semibold text-lg mt-2 mb-1">{post.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Categoria: <span className="text-primary">{post.category}</span></span>
                                {post.publishedAt && (
                                  <span>Postado em {new Date(post.publishedAt).toLocaleDateString('pt-BR')} às {new Date(post.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                )}
                                {post.scheduledAt && (
                                  <span>Agendado para {new Date(post.scheduledAt).toLocaleDateString('pt-BR')} às {new Date(post.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                )}
                                <span>{post.wordCount} palavras</span>
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePreviewPost(post)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSchedulePost(post)}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Agendar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleResendPost(post)}>
                                    <Share className="mr-2 h-4 w-4" />
                                    Reenviar para WP
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive"
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tem certeza que deseja excluir "{post.title}"? Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeletePost(post)}>
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {filteredPosts.length === 0 && (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                          ? "Tente ajustar os filtros ou criar um novo post." 
                          : "Comece criando seu primeiro conteúdo."}
                      </p>
                      <Button onClick={() => navigate('/conteudo')} className="bg-gradient-primary">
                        <PenTool className="mr-2 h-4 w-4" />
                        📝 Criar Conteúdo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="queue" className="space-y-6" data-tab="queue">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Fila de Geração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generationQueue.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-card">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromQueue(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {(item as any).status === 'scheduled' ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Agendado para: {new Date((item as any).scheduledAt).toLocaleString('pt-BR')}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">Agendado</Badge>
                              <span className="text-sm text-muted-foreground">
                                Aguardando execução
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground mb-2">
                              Conclusão estimada: {item.estimatedCompletion}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Progress value={item.progress} className="flex-1" />
                              <span className="text-sm text-muted-foreground min-w-[3rem]">
                                {Math.round(item.progress)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {generationQueue.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum item na fila de geração</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <OpportunitiesTab />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferencesTab />
          </TabsContent>

          <TabsContent value="linking" className="space-y-6">
            <InternalLinkingTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreatePostModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onPostCreated={(post) => {
          setPosts(prev => [post, ...prev]);
          setCreateModalOpen(false);
          setEditPost(null);
        }}
      />

      <CreatePostSetModal 
        open={createSetModalOpen} 
        onOpenChange={setCreateSetModalOpen} 
      />

      {previewPost && (
        <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{previewPost.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <Badge className={statusConfig[previewPost.status].className}>
                  {statusConfig[previewPost.status].label}
                </Badge>
                <span>{previewPost.category}</span>
                <span>{previewPost.wordCount} palavras</span>
                <span>{previewPost.readTime}</span>
              </div>
              {previewPost.image && (
                <img src={previewPost.image} alt="" className="w-full h-48 object-cover rounded-lg" />
              )}
              <div className="prose prose-sm max-w-none">
                <p>Preview do conteúdo do post...</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {schedulePost && (
        <Dialog open={!!schedulePost} onOpenChange={() => setSchedulePost(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Publicação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Escolha quando "{schedulePost.title}" deve ser publicado.
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
                <Button variant="outline" onClick={() => setSchedulePost(null)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleConfirmSchedule} 
                  disabled={!scheduleDate || !scheduleTime}
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}
