
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, RefreshCw, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data para o histórico
const mockHistory = [
  {
    id: 1,
    title: "Post sobre produtividade",
    type: "Social Media Post",
    content: "🚀 Novo post incrível!\n\n✨ Conteúdo envolvente para suas redes sociais!\n\n#marketing #socialmedia #produtividade",
    createdAt: "2024-01-15T10:30:00Z",
    platform: ["Instagram", "LinkedIn"]
  },
  {
    id: 2,
    title: "E-mail de follow-up",
    type: "E-mail",
    content: "Assunto: Follow-up da nossa conversa\n\nOlá,\n\nConteúdo do e-mail personalizado baseado no contexto fornecido.\n\nAtenciosamente,\nSua Equipe",
    createdAt: "2024-01-14T14:20:00Z",
    platform: []
  },
  {
    id: 3,
    title: "Anúncio curso marketing",
    type: "Anúncio para Redes Sociais",
    content: "🎯 Curso de Marketing Digital\n\nTransforme sua vida hoje mesmo!\nEspecialmente para: empreendedores iniciantes\n\n👉 Clique e descubra mais!",
    createdAt: "2024-01-13T09:15:00Z",
    platform: ["Facebook", "Instagram"]
  }
];

export default function CreativeAssistantHistory() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
    });
  };

  const handleRegenerate = (item: any) => {
    toast({
      title: "Redirecionando...",
      description: "Você será redirecionado para gerar novamente este conteúdo.",
    });
    // Aqui você pode implementar a lógica para redirecionar com os dados pré-preenchidos
    navigate('/creative-assistant');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Social Media Post": "bg-gradient-to-r from-pink-500 to-purple-600",
      "E-mail": "bg-gradient-to-r from-blue-500 to-cyan-600",
      "Anúncio para Redes Sociais": "bg-gradient-to-r from-orange-500 to-red-600",
      "Anúncio para Google Ads": "bg-gradient-to-r from-green-500 to-emerald-600",
      "Link da Bio": "bg-gradient-to-r from-violet-500 to-indigo-600",
      "FAQ": "bg-gradient-to-r from-yellow-500 to-amber-600",
      "Quebra de Objeções": "bg-gradient-to-r from-teal-500 to-cyan-600"
    };
    return colors[type] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/creative-assistant')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Histórico de Criações</h1>
            <p className="text-muted-foreground">Visualize e reutilize seus conteúdos anteriores</p>
          </div>
        </div>

        {mockHistory.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Nenhum conteúdo criado ainda</p>
                <p className="text-sm">Comece criando seu primeiro conteúdo!</p>
              </div>
              <Button onClick={() => navigate('/creative-assistant')}>
                Criar Primeiro Conteúdo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {mockHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getTypeColor(item.type)}`}></div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                        {item.platform.length > 0 && (
                          <div className="flex gap-1 ml-4">
                            {item.platform.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground line-clamp-4">
                      {item.content}
                    </pre>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item.content)}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-3 w-3" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerate(item)}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Gerar Novamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
