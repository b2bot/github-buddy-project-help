import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

const redirectUri = 'https://github-buddy-project-help.vercel.app/api/google-callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { code } = req.query;

  if (!code) {
        return res.status(400).json({ error: 'Código de autorização ausente' });
  }

  try {
        const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID!,
                process.env.GOOGLE_CLIENT_SECRET!,
                redirectUri
              );

      const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);

      // Log dos tokens para debug (remover em produção)
      console.log('Tokens recebidos:', {
              access_token: tokens.access_token ? 'presente' : 'ausente',
              refresh_token: tokens.refresh_token ? 'presente' : 'ausente',
              scope: tokens.scope,
              token_type: tokens.token_type,
              expiry_date: tokens.expiry_date,
      });

      // Por enquanto, apenas retorna sucesso
      // TODO: Implementar salvamento no Supabase
      return res.status(200).json({ 
                                        success: true, 
              message: 'Autorização Google realizada com sucesso!',
              tokens: {
                        access_token: tokens.access_token ? 'presente' : 'ausente',
                        refresh_token: tokens.refresh_token ? 'presente' : 'ausente',
                        scope: tokens.scope,
                        expires_in: tokens.expiry_date
              }
      });

  } catch (error) {
        console.error('Erro na autorização Google:', error);
        return res.status(500).json({ 
                                          error: 'Erro interno do servidor',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
  }
}
