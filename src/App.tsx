import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { GoogleAccountProvider } from '@/contexts/GoogleAccountContext';
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Import your page components
import Index from '@/pages';
import Login from '@/pages/Login';
import Cadastro from '@/pages/Cadastro';
import EsqueciSenha from '@/pages/EsqueciSenha';
import RedefinirSenha from '@/pages/RedefinirSenha';
import VerificarCodigo from '@/pages/VerificarCodigo';
import NotFound from '@/pages/NotFound';
import Chat from '@/pages/Chat';
import Posts from '@/pages/Posts';
import Strategy from '@/pages/Strategy';
import Manual from '@/pages/Manual';
import Conteudo from '@/pages/Conteudo';
import Performance from '@/pages/Performance';
import Integrations from '@/pages/Integrations';
import Settings from '@/pages/Settings';
import SettingsV2 from '@/pages/SettingsV2';

// Creative Assistant Pages
import CreativeAssistant from '@/pages/creative-assistant/CreativeAssistant';
import CreativeAssistantHistory from '@/pages/creative-assistant/CreativeAssistantHistory';
import CreativeAssistantSocialPost from '@/pages/creative-assistant/CreativeAssistantSocialPost';
import CreativeAssistantAdsGoogle from '@/pages/creative-assistant/CreativeAssistantAdsGoogle';
import CreativeAssistantAdsSocial from '@/pages/creative-assistant/CreativeAssistantAdsSocial';
import CreativeAssistantEmail from '@/pages/creative-assistant/CreativeAssistantEmail';
import CreativeAssistantFAQ from '@/pages/creative-assistant/CreativeAssistantFAQ';
import CreativeAssistantObjections from '@/pages/creative-assistant/CreativeAssistantObjections';
import CreativeAssistantLinkBio from '@/pages/creative-assistant/CreativeAssistantLinkBio';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GoogleAccountProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
                <Route path="/strategy" element={<ProtectedRoute><Strategy /></ProtectedRoute>} />
                <Route path="/manual" element={<ProtectedRoute><Manual /></ProtectedRoute>} />
                <Route path="/conteudo" element={<ProtectedRoute><Conteudo /></ProtectedRoute>} />
                <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
                <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/settings-v2" element={<ProtectedRoute><SettingsV2 /></ProtectedRoute>} />
                
                {/* Creative Assistant Routes */}
                <Route path="/creative-assistant" element={<ProtectedRoute><CreativeAssistant /></ProtectedRoute>} />
                <Route path="/creative-assistant/history" element={<ProtectedRoute><CreativeAssistantHistory /></ProtectedRoute>} />
                <Route path="/creative-assistant/social-post" element={<ProtectedRoute><CreativeAssistantSocialPost /></ProtectedRoute>} />
                <Route path="/creative-assistant/ads-google" element={<ProtectedRoute><CreativeAssistantAdsGoogle /></ProtectedRoute>} />
                <Route path="/creative-assistant/ads-social" element={<ProtectedRoute><CreativeAssistantAdsSocial /></ProtectedRoute>} />
                <Route path="/creative-assistant/email" element={<ProtectedRoute><CreativeAssistantEmail /></ProtectedRoute>} />
                <Route path="/creative-assistant/faq" element={<ProtectedRoute><CreativeAssistantFAQ /></ProtectedRoute>} />
                <Route path="/creative-assistant/objections" element={<ProtectedRoute><CreativeAssistantObjections /></ProtectedRoute>} />
                <Route path="/creative-assistant/link-bio" element={<ProtectedRoute><CreativeAssistantLinkBio /></ProtectedRoute>} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
                <Route path="/redefinirsenha" element={<RedefinirSenha />} />
                <Route path="/verificar-codigo" element={<VerificarCodigo />} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </GoogleAccountProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
