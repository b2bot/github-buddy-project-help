
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGoogleIntegrations } from '@/hooks/useGoogleIntegrations';

interface GoogleAccount {
  id: string;
  service: string;
  email: string;
  name: string;
  properties?: any[];
  sites?: any[];
  accounts?: any[];
}

interface GoogleAccountContextType {
  connectedAccounts: GoogleAccount[];
  activeGoogleAccount: Record<string, string>; // service -> account_id
  setActiveGoogleAccount: (service: string, accountId: string) => void;
  getActiveAccount: (service: string) => GoogleAccount | null;
  loading: boolean;
}

const GoogleAccountContext = createContext<GoogleAccountContextType | undefined>(undefined);

export function GoogleAccountProvider({ children }: { children: ReactNode }) {
  const { integrations, loading } = useGoogleIntegrations();
  const [connectedAccounts, setConnectedAccounts] = useState<GoogleAccount[]>([]);
  const [activeGoogleAccount, setActiveGoogleAccountState] = useState<Record<string, string>>({});

  useEffect(() => {
    // Transformar integrações em contas
    const accounts: GoogleAccount[] = [];
    
    integrations.forEach(integration => {
      if (integration.connected) {
        if (integration.service === 'google_analytics' && integration.properties) {
          integration.properties.forEach(property => {
            accounts.push({
              id: property.id,
              service: 'google_analytics',
              email: integration.email || '',
              name: `${property.property_name} (${property.account_name})`,
              properties: [property]
            });
          });
        } else if (integration.service === 'google_search_console' && integration.sites) {
          integration.sites.forEach(site => {
            accounts.push({
              id: site.id,
              service: 'google_search_console',
              email: integration.email || '',
              name: site.site_url,
              sites: [site]
            });
          });
        } else if (integration.service === 'google_ads' && integration.accounts) {
          integration.accounts.forEach(account => {
            accounts.push({
              id: account.id,
              service: 'google_ads',
              email: integration.email || '',
              name: account.customer_name,
              accounts: [account]
            });
          });
        }
      }
    });

    setConnectedAccounts(accounts);

    // Definir contas ativas padrão (primeira de cada serviço se não estiver definida)
    const newActiveAccounts = { ...activeGoogleAccount };
    
    ['google_analytics', 'google_search_console', 'google_ads'].forEach(service => {
      if (!newActiveAccounts[service]) {
        const firstAccount = accounts.find(acc => acc.service === service);
        if (firstAccount) {
          newActiveAccounts[service] = firstAccount.id;
        }
      }
    });

    setActiveGoogleAccountState(newActiveAccounts);
  }, [integrations]);

  const setActiveGoogleAccount = (service: string, accountId: string) => {
    setActiveGoogleAccountState(prev => ({
      ...prev,
      [service]: accountId
    }));
  };

  const getActiveAccount = (service: string): GoogleAccount | null => {
    const activeId = activeGoogleAccount[service];
    return connectedAccounts.find(acc => acc.id === activeId && acc.service === service) || null;
  };

  return (
    <GoogleAccountContext.Provider value={{
      connectedAccounts,
      activeGoogleAccount,
      setActiveGoogleAccount,
      getActiveAccount,
      loading
    }}>
      {children}
    </GoogleAccountContext.Provider>
  );
}

export function useGoogleAccounts() {
  const context = useContext(GoogleAccountContext);
  if (context === undefined) {
    throw new Error('useGoogleAccounts must be used within a GoogleAccountProvider');
  }
  return context;
}
