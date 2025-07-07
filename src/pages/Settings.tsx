
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Globe, Palette, Save, Bell } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("pt-BR");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [showPreviews, setShowPreviews] = useState(true);

  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('partnerseo_settings', JSON.stringify({
      theme,
      language,
      notifications,
      autoSave,
      compactMode,
      showPreviews
    }));

    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas com sucesso."
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize suas preferências e configurações do sistema.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Appearance Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Escuro
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Sistema
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Escolha o tema de cores da interface
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Compacto</Label>
                  <p className="text-sm text-muted-foreground">
                    Interface mais compacta com menos espaçamento
                  </p>
                </div>
                <Switch
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar Visualizações</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir pré-visualizações de conteúdo nos cards
                  </p>
                </div>
                <Switch
                  checked={showPreviews}
                  onCheckedChange={setShowPreviews}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Idioma e Região
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Idioma da Interface</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Idioma principal da interface do sistema
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications & Behavior */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações e Comportamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações sobre ações do sistema
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Salvamento Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Salvar automaticamente o conteúdo enquanto digita
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
