import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Target, Users, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Strategy() {
  const [strategy, setStrategy] = useState({
    targetAudience: "",
    macroThemes: "",
    contentPillars: ""
  });
  const { toast } = useToast();

  const testGeneration = () => {
    toast({
      title: "Teste de geração executado!",
      description: "Títulos de exemplo gerados com base na estratégia definida.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Estratégia de Conteúdo</h1>
          <p className="text-muted-foreground">Defina os parâmetros para geração de pautas e conteúdo.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Público-Alvo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Descrição do Público</Label>
                <Textarea
                  id="audience"
                  placeholder="Freelancers de social media, empreendedores digitais..."
                  value={strategy.targetAudience}
                  onChange={(e) => setStrategy({...strategy, targetAudience: e.target.value})}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Temas Macro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="themes">Principais Temas</Label>
                <Textarea
                  id="themes"
                  placeholder="Produtividade, gestão financeira, marketing digital..."
                  value={strategy.macroThemes}
                  onChange={(e) => setStrategy({...strategy, macroThemes: e.target.value})}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>Pilares de Conteúdo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pillars">Pilares Estratégicos</Label>
              <Textarea
                id="pillars"
                placeholder="Educação, inspiração, entretenimento, vendas..."
                value={strategy.contentPillars}
                onChange={(e) => setStrategy({...strategy, contentPillars: e.target.value})}
                rows={3}
              />
            </div>
            <Button onClick={testGeneration} className="gradient-primary">
              Testar Geração de Títulos
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}