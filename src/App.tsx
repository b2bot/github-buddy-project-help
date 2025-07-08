
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
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
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>          
            <Route path="/" element={<Posts />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/creative-assistant" element={<CreativeAssistant />} />
            <Route path="/creative-assistant/history" element={<CreativeAssistantHistory />} />
            <Route path="/creative-assistant/social-post" element={<CreativeAssistantSocialPost />} />
            <Route path="/creative-assistant/email" element={<CreativeAssistantEmail />} />
            <Route path="/creative-assistant/ads-social" element={<CreativeAssistantAdsSocial />} />
            <Route path="/creative-assistant/ads-google" element={<CreativeAssistantAdsGoogle />} />
            <Route path="/creative-assistant/link-bio" element={<CreativeAssistantLinkBio />} />
            <Route path="/creative-assistant/faq" element={<CreativeAssistantFAQ />} />
            <Route path="/creative-assistant/objections" element={<CreativeAssistantObjections />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/conteudo" element={<Conteudo />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
