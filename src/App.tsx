
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Posts from "./pages/Posts";
import CreativeAssistant from "./pages/CreativeAssistant";
import CreativeAssistantHistory from "./pages/CreativeAssistantHistory";
import CreativeAssistantSocialPost from "./pages/CreativeAssistantSocialPost";
import CreativeAssistantEmail from "./pages/CreativeAssistantEmail";
import CreativeAssistantAdsSocial from "./pages/CreativeAssistantAdsSocial";
import CreativeAssistantAdsGoogle from "./pages/CreativeAssistantAdsGoogle";
import CreativeAssistantLinkBio from "./pages/CreativeAssistantLinkBio";
import CreativeAssistantFAQ from "./pages/CreativeAssistantFAQ";
import CreativeAssistantObjections from "./pages/CreativeAssistantObjections";
import Strategy from "./pages/Strategy";
import Integrations from "./pages/Integrations";
import Conteudo from "./pages/Conteudo";
import Chat from "./pages/Chat";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from './pages/login-pages/Login';
import Cadastro from './pages/login-pages/Cadastro';
import EsqueciSenha from './pages/login-pages/EsqueciSenha';
import RedefinirSenha from './pages/login-pages/RedefinirSenha';
import VerificarCodigo from './pages/login-pages/VerificarCodigo';
import { GoogleAccountProvider } from '@/contexts/GoogleAccountContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>   
              <Route path="/login" element={<Login />} />
              <Route path="/esquecisenha" element={<EsqueciSenha />} />
              <Route path="/redefinirsenha" element={<RedefinirSenha />} />
              <Route path="/verificarcodigo" element={<VerificarCodigo />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/posts" replace />
                </ProtectedRoute>
              } />
              <Route path="/posts" element={
                <ProtectedRoute>
                  <Posts />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant" element={
                <ProtectedRoute>
                  <CreativeAssistant />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/history" element={
                <ProtectedRoute>
                  <CreativeAssistantHistory />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/social-post" element={
                <ProtectedRoute>
                  <CreativeAssistantSocialPost />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/email" element={
                <ProtectedRoute>
                  <CreativeAssistantEmail />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/ads-social" element={
                <ProtectedRoute>
                  <CreativeAssistantAdsSocial />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/ads-google" element={
                <ProtectedRoute>
                  <CreativeAssistantAdsGoogle />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/link-bio" element={
                <ProtectedRoute>
                  <CreativeAssistantLinkBio />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/faq" element={
                <ProtectedRoute>
                  <CreativeAssistantFAQ />
                </ProtectedRoute>
              } />
              <Route path="/creative-assistant/objections" element={
                <ProtectedRoute>
                  <CreativeAssistantObjections />
                </ProtectedRoute>
              } />
              <Route path="/strategy" element={
                <ProtectedRoute>
                  <Strategy />
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <Integrations />
                </ProtectedRoute>
              } />
              <Route path="/conteudo" element={
                <ProtectedRoute>
                  <Conteudo />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/performance" element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
