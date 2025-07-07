import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostPreferences {
  wordCount: number;
  imageStyle: string;
  writingStyle: string;
  mentionProject: boolean;
  internalLinking: boolean;
  useRealData: boolean;
  includeFAQ: boolean;
  schedulingInterval: number;
  anticipateFuturePosts: boolean;
}

export function PreferencesTab() {
  const [preferences, setPreferences] = useState<PostPreferences>({
    wordCount: 1000,
    imageStyle: "ilustracao",
    writingStyle: "informativo",
    mentionProject: false,
    internalLinking: true,
    useRealData: false,
    includeFAQ: false,
    schedulingInterval: 24,
    anticipateFuturePosts: false
  });

  const { toast } = useToast();

  const updatePreference = <K extends keyof PostPreferences>(
    key: K,
    value: PostPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePreferences = () => {
    // TODO: Save to localStorage or backend
    localStorage.setItem('postPreferences', JSON.stringify(preferences));
    toast({
      title: "Preferências salvas!",
      description: "Suas configurações padrão foram atualizadas."
    });
  };

  // Load preferences on mount
  useState(() => {
    const saved = localStorage.getItem('postPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Preferências de Posts</h3>
          <p className="text-sm text-muted-foreground">
            Configure os padrões que serão aplicados a todos os novos posts.
          </p>
        </div>
        <Button onClick={savePreferences} className="gradient-primary">
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Padrão dos Posts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quantidade de Palavras */}
          <div className="space-y-2">
            <Label htmlFor="wordCount">Quantidade de Palavras</Label>
            <Input
              id="wordCount"
              type="number"
              min="500"
              max="3000"
              value={preferences.wordCount}
              onChange={(e) => updatePreference('wordCount', parseInt(e.target.value) || 1000)}
            />
            <p className="text-xs text-muted-foreground">
              Entre 500 e 3.000 palavras. Recomendado: 1000-1500 palavras.
            </p>
          </div>

          {/* Estilo de Imagem */}
          <div className="space-y-2">
            <Label>Estilo de Imagem</Label>
            <Select value={preferences.imageStyle} onValueChange={(value) => updatePreference('imageStyle', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ilustracao">Ilustração</SelectItem>
                <SelectItem value="fotografia">Fotografia</SelectItem>
                <SelectItem value="infografico">Infográfico</SelectItem>
                <SelectItem value="minimalista">Minimalista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estilo de Escrita */}
          <div className="space-y-2">
            <Label>Estilo de Escrita</Label>
            <Select value={preferences.writingStyle} onValueChange={(value) => updatePreference('writingStyle', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informativo">Informativo</SelectItem>
                <SelectItem value="conversacional">Conversacional</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="educativo">Educativo</SelectItem>
                <SelectItem value="persuasivo">Persuasivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mencionar o projeto no texto do post</Label>
                <p className="text-xs text-muted-foreground">
                  Inclui referências ao seu projeto/marca no conteúdo do artigo.
                </p>
              </div>
              <Switch
                checked={preferences.mentionProject}
                onCheckedChange={(checked) => updatePreference('mentionProject', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Realizar linkagem interna</Label>
                <p className="text-xs text-muted-foreground">
                  Adiciona links para outros posts do seu blog automaticamente.
                </p>
              </div>
              <Switch
                checked={preferences.internalLinking}
                onCheckedChange={(checked) => updatePreference('internalLinking', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Usar dados e estudos reais e realizar linkagem externa</Label>
                <p className="text-xs text-muted-foreground">
                  Inclui estatísticas e referências de fontes confiáveis.
                </p>
              </div>
              <Switch
                checked={preferences.useRealData}
                onCheckedChange={(checked) => updatePreference('useRealData', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Incluir sessão de perguntas frequentes</Label>
                <p className="text-xs text-muted-foreground">
                  Adiciona uma seção FAQ ao final de cada artigo.
                </p>
              </div>
              <Switch
                checked={preferences.includeFAQ}
                onCheckedChange={(checked) => updatePreference('includeFAQ', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Agendamento Padrão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedulingInterval">Intervalo entre posts</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="schedulingInterval"
                type="number"
                min="1"
                max="168"
                value={preferences.schedulingInterval}
                onChange={(e) => updatePreference('schedulingInterval', parseInt(e.target.value) || 24)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">horas</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Antecipar agendamentos futuros ao retirar um agendamento</Label>
              <p className="text-xs text-muted-foreground">
                Quando você cancelar um post agendado, os próximos posts serão antecipados.
              </p>
            </div>
            <Switch
              checked={preferences.anticipateFuturePosts}
              onCheckedChange={(checked) => updatePreference('anticipateFuturePosts', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}