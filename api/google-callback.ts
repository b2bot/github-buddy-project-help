import { google } from 'googleapis';
import { createClient } from '../src/lib/supabase';

const redirectUri = 'https://github-buddy-project-help.vercel.app/api/google-callback';

const oauth2Client = new google.auth.OAuth2(
  '1015078541788-a38j0o12vm85m1bmddsbt40of7rul3r2.apps.googleusercontent.com',
  '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',
  redirectUri
);

// Substitui com suas chaves do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) return new Response('Código de autorização ausente', { status: 400 });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Salvar no Supabase (sem usuário ainda, só 1 registro genérico)
    const { error } = await supabase.from('google_tokens').insert([
      {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      },
    ]);

    if (error) {
      console.error(error);
      return new Response('Erro ao salvar no Supabase', { status: 500 });
    }

    return new Response('Autenticação concluída com sucesso!', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Erro na autenticação', { status: 500 });
  }
}
