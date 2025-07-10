
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGoogleAccounts } from "@/contexts/GoogleAccountContext";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Search, Target } from "lucide-react";

interface GoogleAccountSelectorProps {
  service: 'google_analytics' | 'google_search_console' | 'google_ads';
  className?: string;
}

export function GoogleAccountSelector({ service, className }: GoogleAccountSelectorProps) {
  const { connectedAccounts, activeGoogleAccount, setActiveGoogleAccount, loading } = useGoogleAccounts();

  const serviceAccounts = connectedAccounts.filter(acc => acc.service === service);
  const activeAccountId = activeGoogleAccount[service];

  const getServiceIcon = () => {
    switch (service) {
      case 'google_analytics':
        return <BarChart3 className="h-4 w-4" />;
      case 'google_search_console':
        return <Search className="h-4 w-4" />;
      case 'google_ads':
        return <Target className="h-4 w-4" />;
    }
  };

  const getServiceLabel = () => {
    switch (service) {
      case 'google_analytics':
        return 'Google Analytics';
      case 'google_search_console':
        return 'Search Console';
      case 'google_ads':
        return 'Google Ads';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 p-2 bg-muted rounded-md ${className}`}>
        <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
        <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse" />
      </div>
    );
  }

  if (serviceAccounts.length === 0) {
    return (
      <div className={`flex items-center gap-2 p-2 bg-muted rounded-md ${className}`}>
        {getServiceIcon()}
        <span className="text-sm text-muted-foreground">
          Nenhuma conta {getServiceLabel()} conectada
        </span>
        <Badge variant="secondary">Desconectado</Badge>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        {getServiceIcon()}
        <span className="text-sm font-medium">{getServiceLabel()}</span>
        <Badge variant="outline">{serviceAccounts.length} conta(s)</Badge>
      </div>
      
      <Select
        value={activeAccountId || ''}
        onValueChange={(value) => setActiveGoogleAccount(service, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Selecionar conta ${getServiceLabel()}`} />
        </SelectTrigger>
        <SelectContent>
          {serviceAccounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              <div className="flex flex-col">
                <span className="font-medium">{account.name}</span>
                <span className="text-xs text-muted-foreground">{account.email}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
