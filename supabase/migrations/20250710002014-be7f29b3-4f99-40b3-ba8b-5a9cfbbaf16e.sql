
-- Criar tabelas para armazenar dados específicos dos serviços Google

-- Tabela para propriedades do Google Analytics
CREATE TABLE IF NOT EXISTS public.google_analytics_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  google_token_id UUID NOT NULL REFERENCES public.google_tokens(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  website_url TEXT,
  account_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para sites do Google Search Console
CREATE TABLE IF NOT EXISTS public.google_search_console_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  google_token_id UUID NOT NULL REFERENCES public.google_tokens(id) ON DELETE CASCADE,
  site_url TEXT NOT NULL,
  permission_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para contas do Google Ads
CREATE TABLE IF NOT EXISTS public.google_ads_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  google_token_id UUID NOT NULL REFERENCES public.google_tokens(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  account_type TEXT,
  currency_code TEXT,
  time_zone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS às novas tabelas
ALTER TABLE public.google_analytics_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_search_console_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_ads_accounts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para google_analytics_properties
CREATE POLICY "Users can view their own analytics properties" 
  ON public.google_analytics_properties 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics properties" 
  ON public.google_analytics_properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics properties" 
  ON public.google_analytics_properties 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics properties" 
  ON public.google_analytics_properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para google_search_console_sites
CREATE POLICY "Users can view their own search console sites" 
  ON public.google_search_console_sites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search console sites" 
  ON public.google_search_console_sites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own search console sites" 
  ON public.google_search_console_sites 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search console sites" 
  ON public.google_search_console_sites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para google_ads_accounts
CREATE POLICY "Users can view their own ads accounts" 
  ON public.google_ads_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ads accounts" 
  ON public.google_ads_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ads accounts" 
  ON public.google_ads_accounts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ads accounts" 
  ON public.google_ads_accounts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Adicionar RLS à tabela google_tokens
ALTER TABLE public.google_tokens ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para google_tokens
CREATE POLICY "Users can view their own google tokens" 
  ON public.google_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own google tokens" 
  ON public.google_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own google tokens" 
  ON public.google_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own google tokens" 
  ON public.google_tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Índices únicos para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_google_analytics_properties_unique 
  ON public.google_analytics_properties(user_id, property_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_google_search_console_sites_unique 
  ON public.google_search_console_sites(user_id, site_url);

CREATE UNIQUE INDEX IF NOT EXISTS idx_google_ads_accounts_unique 
  ON public.google_ads_accounts(user_id, customer_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_google_analytics_properties_updated_at
  BEFORE UPDATE ON public.google_analytics_properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_google_search_console_sites_updated_at
  BEFORE UPDATE ON public.google_search_console_sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_google_ads_accounts_updated_at
  BEFORE UPDATE ON public.google_ads_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_google_tokens_updated_at
  BEFORE UPDATE ON public.google_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
