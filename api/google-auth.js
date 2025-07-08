// Google OAuth Authentication API
export default function handler(req, res) {
    try {
          // Get environment variables
      const clientId = process.env.GOOGLE_CLIENT_ID;
          const redirectUri = process.env.GOOGLE_REDIRECT_URI;

      if (!clientId || !redirectUri) {
              return res.status(500).json({ 
                                                  error: 'Missing Google OAuth configuration',
                        details: 'GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI not configured'
              });
      }

      // Define OAuth scopes
      const scopes = [
              'https://www.googleapis.com/auth/userinfo.email',
              'https://www.googleapis.com/auth/userinfo.profile'
            ];

      // Build Google OAuth URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
          authUrl.searchParams.set('client_id', clientId);
          authUrl.searchParams.set('redirect_uri', redirectUri);
          authUrl.searchParams.set('response_type', 'code');
          authUrl.searchParams.set('scope', scopes.join(' '));
          authUrl.searchParams.set('access_type', 'offline');
          authUrl.searchParams.set('prompt', 'consent');

      // Redirect to Google OAuth
      res.redirect(authUrl.toString());

    } catch (error) {
          console.error('Google Auth Error:', error);
          res.status(500).json({ 
                                     error: 'Internal server error',
                  message: error.message 
          });
    }
}
