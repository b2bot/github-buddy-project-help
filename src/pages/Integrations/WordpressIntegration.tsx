
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordpressForm } from "@/components/integrations/WordpressForm";
import { WebhookHistory } from "@/components/integrations/WebhookHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, History, Settings } from "lucide-react";

export function WordpressIntegration() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Integração WordPress</h2>
        <p className="text-muted-foreground">
          Configure a conexão com seu site WordPress para publicação automática de posts
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Avançado
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Configuração Básica</CardTitle>
            </CardHeader>
            <CardContent>
              <WordpressForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configurações avançadas de integração em desenvolvimento...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <WebhookHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
