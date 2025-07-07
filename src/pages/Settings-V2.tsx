import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Key, Globe, Bell, Shield, User } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações da sua conta e preferências.</p>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="bg-white border border-gray-200 rounded-lg">
            <TabsTrigger value="account" className="data-[state=active]:bg-gray-100">
              <User className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-100">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-100">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-gray-100">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Preferências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input type="text" id="name" placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="seuemail@exemplo.com" disabled />
                  </div>
                </div>
                <Button>Atualizar Informações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input type="password" id="password" placeholder="Nova senha" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input type="password" id="confirmPassword" placeholder="Confirmar nova senha" />
                </div>
                <Button>Alterar Senha</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emailNotifications">Notificações por Email</Label>
                  <Input type="checkbox" id="emailNotifications" />
                </div>
                <div>
                  <Label htmlFor="pushNotifications">Notificações Push</Label>
                  <Input type="checkbox" id="pushNotifications" />
                </div>
                <Button>Salvar Notificações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Input type="text" id="language" placeholder="Português (Brasil)" disabled />
                </div>
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Input type="text" id="theme" placeholder="Automático" disabled />
                </div>
                <Button>Salvar Preferências</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}