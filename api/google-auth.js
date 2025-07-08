// Google OAuth Authentication API - Versão Simplificada e Funcional
export default async function handler(req, res) {
      // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
          return res.status(200).end();
  }

  try {
          // Verificar variáveis de ambiente
        const clientId = process.env.GOOGLE_CLIENT_ID;
          const redirectUri = process.env.GOOGLE_REDIRECT_URI;

        if (!clientId || !redirectUri) {
                  return res.status(500).json({
                              error: 'Configuração incompleta',
                              details: 'GOOGLE_CLIENT_ID ou GOOGLE_REDIRECT_URI não configurados',
                              debug: {
                                            hasClientId: !!clientId,
                                            hasRedirectUri: !!redirectUri
                              }
                  });
        }

        // Definir escopos do OAuth
        const scopes = [
                  'https://www.googleapis.com/auth/userinfo.email',
                  'https://www.googleapis.com/auth/userinfo.profile'
                ];

        // Construir URL de autenticação do Google
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
          authUrl.searchParams.set('client_id', clientId);
          authUrl.searchParams.set('redirect_uri', redirectUri);
          authUrl.searchParams.set('response_type', 'code');
          authUrl.searchParams.set('scope', scopes.join(' '));
          authUrl.searchParams.set('access_type', 'offline');
          authUrl.searchParams.set('prompt', 'consent');

        // Retornar URL de autenticação
        return res.status(200).json({
                  success: true,
                  authUrl: authUrl.toString(),
                  message: 'URL de autenticação Google gerada com sucesso'
        });

  } catch (error) {
          console.error('Erro na API Google Auth:', error);
          return res.status(500).json({
                    error: 'Erro interno do servidor',
                    details: error.message,
                    timestamp: new Date().toISOString()
          });
  }
}
