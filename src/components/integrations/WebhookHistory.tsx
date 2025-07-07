
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, AlertCircle, ChevronDown, RefreshCw } from "lucide-react";

interface WebhookLog {
  id: string;
  evento: string;
  payload: string;
  resposta: string;
  status: 'success' | 'error';
  data: string;
}

const mockLogs: WebhookLog[] = [
  {
    id: '1',
    evento: 'POST_CREATED',
    payload: '{"post": {"id": "123", "title": "Test Post"}}',
    resposta: '{"success": true, "post_id": 456}',
    status: 'success',
    data: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    evento: 'POST_UPDATED',
    payload: '{"post": {"id": "124", "title": "Updated Post"}}',
    resposta: '{"error": "Post not found"}',
    status: 'error',
    data: '2024-01-15T09:15:00'
  },
  {
    id: '3',
    evento: 'CHECK_INTEGRATION',
    payload: '{}',
    resposta: '{"status": "active", "token": "verified"}',
    status: 'success',
    data: '2024-01-15T08:45:00'
  }
];

export function WebhookHistory() {
  const [logs, setLogs] = useState<WebhookLog[]>(mockLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, fetch from /wp-json/partnerseo/v1/logs
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const toggleLogDetails = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getEventDisplayName = (evento: string) => {
    const eventNames: Record<string, string> = {
      'POST_CREATED': 'Post Criado',
      'POST_UPDATED': 'Post Atualizado', 
      'POST_DELETED': 'Post Deletado',
      'CATEGORY_CREATED': 'Categoria Criada',
      'CATEGORY_UPDATED': 'Categoria Atualizada',
      'CATEGORY_DELETED': 'Categoria Deletada',
      'CHECK_INTEGRATION': 'Verificação de Integração'
    };
    return eventNames[evento] || evento;
  };

  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Histórico de Webhooks</CardTitle>
          <Button
            onClick={loadLogs}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum log de webhook encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <>
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {formatDate(log.data)}
                      </TableCell>
                      <TableCell>
                        {getEventDisplayName(log.evento)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            log.status === 'success' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          }
                        >
                          {log.status === 'success' ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          )}
                          {log.status === 'success' ? 'Sucesso' : 'Erro'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLogDetails(log.id)}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${
                            expandedLogs.has(log.id) ? 'rotate-180' : ''
                          }`} />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedLogs.has(log.id) && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-muted/30">
                          <div className="space-y-4 py-4">
                            <div>
                              <h4 className="font-medium mb-2">Payload Enviado:</h4>
                              <pre className="bg-background p-3 rounded border text-xs overflow-x-auto">
                                {formatJson(log.payload)}
                              </pre>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Resposta Recebida:</h4>
                              <pre className="bg-background p-3 rounded border text-xs overflow-x-auto">
                                {formatJson(log.resposta)}
                              </pre>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
