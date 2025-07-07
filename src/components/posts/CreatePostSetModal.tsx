import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Users, Youtube, Sparkles, Eye, Edit2, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostSetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "method" | "config" | "preview";

interface GeneratedPost {
  id: string;
  title: string;
  outline: string[];
  keywords: string[];
  estimatedWords: number;
}

const mockGeneratedPosts: GeneratedPost[] = [
  {
    id: "1",
    title: "5 Estratégias de Produtividade para Social Media Freelancers",
    outline: ["Introdução", "Estratégia 1: Time Blocking", "Estratégia 2: Automação", "Estratégia 3: Templates", "Estratégia 4: Batching", "Estratégia 5: Métricas", "Conclusão"],
    keywords: ["produtividade", "freelancer", "social media"],
    estimatedWords: 800
  },
  {
    id: "2",
    title: "Gerenciando Finanças: Um Guia para Freelancers de Social Media",
    outline: ["Introdução", "Controle de Receitas", "Gestão de Despesas", "Impostos para Freelancers", "Reserva de Emergência", "Ferramentas Financeiras", "Conclusão"],
    keywords: ["finanças", "freelancer", "gestão"],
    estimatedWords: 800
  },
  {
    id: "3",
    title: "Como Criar Contratos Claros para Serviços de Social Media",
    outline: ["Introdução", "Elementos Essenciais", "Definindo Escopo", "Prazos e Entregas", "Políticas de Revisão", "Proteção Legal", "Conclusão"],
    keywords: ["contratos", "freelancer", "legal"],
    estimatedWords: 800
  }
];

export function CreatePostSetModal({ open, onOpenChange }: CreatePostSetModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("method");
  const [method, setMethod] = useState<"interests" | "youtube">("interests");
  const [quantity, setQuantity] = useState([3]);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    interests: "",
    youtubeUrl: "",
    category: "",
    keywords: "",
    articleSize: "800",
    altText: "",
    metaDescription: "",
    mentionProject: false,
    internalLinking: false
  });

  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep === "method") {
      setCurrentStep("config");
    } else if (currentStep === "config") {
      // Simulate generation
      setGeneratedPosts(mockGeneratedPosts.slice(0, quantity[0]));
      setCurrentStep("preview");
    }
  };

  const handleBack = () => {
    if (currentStep === "config") {
      setCurrentStep("method");
    } else if (currentStep === "preview") {
      setCurrentStep("config");
    }
  };

  const handleSubmit = () => {
    toast({
      title: `${generatedPosts.length} posts criados com sucesso!`,
      description: "Seus posts foram adicionados à fila de geração.",
    });
    
    onOpenChange(false);
    setCurrentStep("method");
    setGeneratedPosts([]);
    // Reset form data
  };

  const generateTitleSuggestions = () => {
    const suggestions = [
      "Produtividade para Freelancers",
      "Gestão de Clientes em Social Media",
      "Ferramentas Essenciais para Marketing Digital"
    ];
    setFormData({ 
      ...formData, 
      interests: suggestions.join(", ")
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Conjunto de Posts</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <div className={`w-8 h-1 rounded ${currentStep === "method" ? "bg-primary" : "bg-muted"}`} />
            <div className={`w-8 h-1 rounded ${currentStep === "config" ? "bg-primary" : "bg-muted"}`} />
            <div className={`w-8 h-1 rounded ${currentStep === "preview" ? "bg-primary" : "bg-muted"}`} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === "method" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Selecione o Método de Geração</h3>
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
                  
                  <TabsContent value="interests" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="interests">Temas de Interesse do Público</Label>
                      <div className="flex space-x-2">
                        <Textarea
                          id="interests"
                          placeholder="Descreva os temas que interessam ao seu público-alvo..."
                          value={formData.interests}
                          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                          rows={4}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateTitleSuggestions}
                          className="shrink-0"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="youtube" className="space-y-4 mt-6">
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
                        A transcrição será extraída automaticamente para gerar múltiplos posts relacionados
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {currentStep === "config" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações dos Posts</h3>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Quantidade de Posts: {quantity[0]}</Label>
                      <Slider
                        value={quantity}
                        onValueChange={setQuantity}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1 post</span>
                        <span>10 posts</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keywords">Palavras-chave Gerais</Label>
                      <Textarea
                        id="keywords"
                        placeholder="freelancer social media, produtividade, gestão de clientes..."
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        rows={2}
                      />
                    </div>
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
                          <Label htmlFor="altText">Texto Alternativo Padrão</Label>
                          <Input
                            id="altText"
                            placeholder="Base para descrição das imagens"
                            value={formData.altText}
                            onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="metaDescription">Meta Description Base</Label>
                          <Input
                            id="metaDescription"
                            placeholder="Base para descrições SEO"
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
                          <Label htmlFor="internalLinking">Incluir linkagem interna entre posts</Label>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
          )}

          {currentStep === "preview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Preview dos Posts Gerados</h3>
                <p className="text-muted-foreground mb-6">
                  Revise e edite os títulos e estruturas antes de enviar para geração
                </p>
                
                <div className="space-y-4">
                  {generatedPosts.map((post, index) => (
                    <Card key={post.id} className="glass">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary">Post {index + 1}</Badge>
                              <Badge variant="outline">{post.estimatedWords} palavras</Badge>
                            </div>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Estrutura:</p>
                            <div className="flex flex-wrap gap-2">
                              {post.outline.map((section, sectionIndex) => (
                                <Badge key={sectionIndex} variant="outline" className="text-xs">
                                  {section}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Palavras-chave:</p>
                            <div className="flex flex-wrap gap-2">
                              {post.keywords.map((keyword, keywordIndex) => (
                                <Badge key={keywordIndex} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div>
              {currentStep !== "method" && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              
              {currentStep === "preview" ? (
                <Button onClick={handleSubmit} className="gradient-primary">
                  Enviar {generatedPosts.length} Posts para Geração
                </Button>
              ) : (
                <Button onClick={handleNext} className="gradient-primary">
                  {currentStep === "method" ? "Continuar" : "Gerar Preview"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}