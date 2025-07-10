
// Google OAuth Callback API - Versão Completa com Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://onnvpakhibftxpqeraur.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ubnZwYWtoaWJmdHhwcWVyYXVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MzY0OCwiZXhwIjoyMDY1MjI5NjQ4fQ.WrhRsv6uH7cw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  try {
    const { code, error, state } = req.query;
    const service = state || 'google_analytics'; // Usar state para identificar o serviço

    if (error) {
      return res.redirect(`/integrations?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect('/integrations?error=missing_code');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.redirect('/integrations?error=missing_config');
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.redirect(`/integrations?error=${encodeURIComponent('token_exchange_failed')}`);
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return res.redirect('/integrations?error=user_info_failed');
    }
    
   
    // Depois de userData chegar do Google...
    console.log('🤖 userData.email:', userData.email);
    // Buscar usuário pelo email na tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userData.email)
      .single();

    if (profileError || !profile) {
      return res.redirect('/integrations?error=user_not_found');
    }
    console.log('🔍 profile:', profile);
    console.log('❗ profileError:', profileError);
    
    // Calcular expires_at em Unix timestamp
    const expiresAt = tokenData.expires_in 
      ? Math.floor(Date.now() / 1000) + tokenData.expires_in 
      : null;

    // Salvar token no Supabase (com upsert para evitar duplicatas)
    const { error: tokenError } = await supabase
      .from('google_tokens')
      .upsert({
        user_id: profile.id,
        service: service,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        id_token: tokenData.id_token,
        email: userData.email,
        expires_at: expiresAt,
        connected_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,service'
      });

    if (tokenError) {
      console.error('Erro ao salvar token:', tokenError);
      return res.redirect('/integrations?error=token_save_failed');
    }

    // Buscar dados específicos do serviço e salvar nas tabelas apropriadas
    await fetchAndSaveServiceData(service, tokenData.access_token, profile.id);

    // Redirecionar de volta para integrations com sucesso
    return res.redirect(`/integrations?success=connected&service=${service}`);

  } catch (error) {
    console.error('Erro no callback:', error);
    return res.redirect('/integrations?error=server_error');
  }
}

async function fetchAndSaveServiceData(service, accessToken, userId) {
  try {
    switch (service) {
      case 'google_analytics':
        await fetchAnalyticsProperties(accessToken, userId);
        break;
      case 'google_search_console':
        await fetchSearchConsoleSites(accessToken, userId);
        break;
      case 'google_ads':
        await fetchAdsAccounts(accessToken, userId);
        break;
    }
  } catch (error) {
    console.error(`Erro ao buscar dados do serviço ${service}:`, error);
  }
}

async function fetchAnalyticsProperties(accessToken, userId) {
  try {
    // Buscar contas do Analytics
    const accountsResponse = await fetch('https://www.googleapis.com/analytics/v3/management/accounts', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!accountsResponse.ok) return;

    const accountsData = await accountsResponse.json();
    
    for (const account of accountsData.items || []) {
      // Buscar propriedades de cada conta
      const propertiesResponse = await fetch(
        `https://www.googleapis.com/analytics/v3/management/accounts/${account.id}/webproperties`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!propertiesResponse.ok) continue;

      const propertiesData = await propertiesResponse.json();

      for (const property of propertiesData.items || []) {
        // Buscar token_id para relacionamento
        const { data: tokenData } = await supabase
          .from('google_tokens')
          .select('id')
          .eq('user_id', userId)
          .eq('service', 'google_analytics')
          .single();

        if (tokenData) {
          await supabase
            .from('google_analytics_properties')
            .upsert({
              user_id: userId,
              google_token_id: tokenData.id,
              account_id: account.id,
              property_id: property.id,
              property_name: property.name,
              website_url: property.websiteUrl || null,
              account_name: account.name
            }, {
              onConflict: 'user_id,property_id'
            });
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar propriedades do Analytics:', error);
  }
}

async function fetchSearchConsoleSites(accessToken, userId) {
  try {
    const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) return;

    const data = await response.json();

    // Buscar token_id para relacionamento
    const { data: tokenData } = await supabase
      .from('google_tokens')
      .select('id')
      .eq('user_id', userId)
      .eq('service', 'google_search_console')
      .single();

    if (tokenData) {
      for (const site of data.siteEntry || []) {
        await supabase
          .from('google_search_console_sites')
          .upsert({
            user_id: userId,
            google_token_id: tokenData.id,
            site_url: site.siteUrl,
            permission_level: site.permissionLevel
          }, {
            onConflict: 'user_id,site_url'
          });
      }
    }
  } catch (error) {
    console.error('Erro ao buscar sites do Search Console:', error);
  }
}

async function fetchAdsAccounts(accessToken, userId) {
  try {
    const response = await fetch('https://googleads.googleapis.com/v14/customers:listAccessibleCustomers', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || ''
      }
    });

    if (!response.ok) return;

    const data = await response.json();

    // Buscar token_id para relacionamento
    const { data: tokenData } = await supabase
      .from('google_tokens')
      .select('id')
      .eq('user_id', userId)
      .eq('service', 'google_ads')
      .single();

    if (tokenData) {
      for (const customer of data.resourceNames || []) {
        const customerId = customer.split('/')[1];
        
        // Buscar detalhes do cliente
        const customerResponse = await fetch(
          `https://googleads.googleapis.com/v14/customers/${customerId}`,
          {
            headers: { 
              Authorization: `Bearer ${accessToken}`,
              'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || ''
            }
          }
        );

        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          
          await supabase
            .from('google_ads_accounts')
            .upsert({
              user_id: userId,
              google_token_id: tokenData.id,
              customer_id: customerId,
              customer_name: customerData.descriptiveName || `Account ${customerId}`,
              account_type: customerData.manager ? 'manager' : 'client',
              currency_code: customerData.currencyCode,
              time_zone: customerData.timeZone
            }, {
              onConflict: 'user_id,customer_id'
            });
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar contas do Google Ads:', error);
  }
}
