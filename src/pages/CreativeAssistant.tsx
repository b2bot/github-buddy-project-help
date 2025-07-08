import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Mail, Target, Search, Link, HelpCircle, Brain, History, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const creativeCards = [
  {
    id: "social-media",
    title: "Social Media Post",
    description: "Crie posts cativantes para redes sociais como Instagram, Facebook, LinkedIn, X.",
    icon: Smartphone,
    color: "bg-gradient-to-br from-pink-500 to-purple-600",
    route: "/creative-assistant/social-post"
  },
  {
    id: "email",
    title: "E-mail",
    description: "Gere e-mails como cold mail, follow-up, nurturing, promo, etc",
    icon: Mail,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    route: "/creative-assistant/email"
  },
  {
    id: "social-ads",
    title: "Anúncio para Redes Sociais",
    description: "Crie textos publicitários atrativos para redes sociais",
    icon: Target,
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    route: "/creative-assistant/ads-social"
  },
  {
    id: "google-ads",
    title: "Anúncio para Google Ads",
    description: "Gere headlines e descrições para Google Ads",
    icon: Search,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    route: "/creative-assistant/ads-google"
  },
  {
    id: "bio-link",
    title: "Link da Bio",
    description: "Crie bios de impacto para usar em Linktree, Beacons, etc",
    icon: Link,
    color: "bg-gradient-to-br from-violet-500 to-indigo-600",
    route: "/creative-assistant/link-bio"
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Gere respostas para perguntas comuns dos seus clientes",
    icon: HelpCircle,
    color: "bg-gradient-to-br from-yellow-500 to-amber-600",
    route: "/creative-assistant/faq"
  },
  {
    id: "objections",
    title: "Quebra de Objeções",
    description: "Enfrente objeções com respostas estratégicas baseadas em gatilhos de vendas",
    icon: Brain,
    color: "bg-gradient-to-br from-teal-500 to-cyan-600",
    route: "/creative-assistant/objections"
  }
];

export default function CreativeAssistant() {
  const navigate = useNavigate();

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assistente Criativo</h1>
            <p className="text-muted-foreground">Gere microconteúdos instantaneamente com IA</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/creative-assistant/history')}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Histórico
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creativeCards.map((card) => (
            <Card
              key={card.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick(card.route)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Criar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
