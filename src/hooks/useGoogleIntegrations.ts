
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface GoogleToken {
  id: string;
  service: string;
  email: string;
  connected_at: string;
  expires_at?: number;
}

export interface GoogleAnalyticsProperty {
  id: string;
  account_id: string;
  property_id: string;
  property_name: string;
  website_url?: string;
  account_name?: string;
}

export interface GoogleSearchConsoleSite {
  id: string;
  site_url: string;
  permission_level: string;
}

export interface GoogleAdsAccount {
  id: string;
  customer_id: string;
  customer_name: string;
  account_type?: string;
  currency_code?: string;
}

export interface GoogleIntegrationStatus {
  service: string;
  connected: boolean;
  email?: string;
  lastSync?: string;
  properties?: GoogleAnalyticsProperty[];
  sites?: GoogleSearchConsoleSite[];
  accounts?: GoogleAdsAccount[];
}

export function useGoogleIntegrations() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<GoogleIntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIntegrations = async () => {
    if (!user) {
      setIntegrations([]);
      setLoading(false);
      return;
    }

    try {
      // Buscar tokens conectados
      const { data: tokens, error: tokensError } = await supabase
        .from('google_tokens')
        .select('*')
        .eq('user_id', user.id);

      if (tokensError) throw tokensError;

      const services = ['google_analytics', 'google_search_console', 'google_ads'];
      const integrationsData: GoogleIntegrationStatus[] = [];

      for (const service of services) {
        const token = tokens?.find(t => t.service === service);
        
        if (token) {
          const integration: GoogleIntegrationStatus = {
            service,
            connected: true,
            email: token.email,
            lastSync: token.connected_at
          };

          // Buscar dados específicos do serviço
          if (service === 'google_analytics') {
            const { data: properties } = await supabase
              .from('google_analytics_properties')
              .select('*')
              .eq('user_id', user.id);
            integration.properties = properties || [];
          } else if (service === 'google_search_console') {
            const { data: sites } = await supabase
              .from('google_search_console_sites')
              .select('*')
              .eq('user_id', user.id);
            integration.sites = sites || [];
          } else if (service === 'google_ads') {
            const { data: accounts } = await supabase
              .from('google_ads_accounts')
              .select('*')
              .eq('user_id', user.id);
            integration.accounts = accounts || [];
          }

          integrationsData.push(integration);
        } else {
          integrationsData.push({
            service,
            connected: false
          });
        }
      }

      setIntegrations(integrationsData);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  const disconnectService = async (service: string) => {
    if (!user) return;

    try {
      // Remover token
      const { error: tokenError } = await supabase
        .from('google_tokens')
        .delete()
        .eq('user_id', user.id)
        .eq('service', service);

      if (tokenError) throw tokenError;

      // Remover dados específicos do serviço
      if (service === 'google_analytics') {
        await supabase
          .from('google_analytics_properties')
          .delete()
          .eq('user_id', user.id);
      } else if (service === 'google_search_console') {
        await supabase
          .from('google_search_console_sites')
          .delete()
          .eq('user_id', user.id);
      } else if (service === 'google_ads') {
        await supabase
          .from('google_ads_accounts')
          .delete()
          .eq('user_id', user.id);
      }

      // Recarregar integrações
      await loadIntegrations();
    } catch (error) {
      console.error('Erro ao desconectar serviço:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, [user]);

  return {
    integrations,
    loading,
    loadIntegrations,
    disconnectService
  };
}
