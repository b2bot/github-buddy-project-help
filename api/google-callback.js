// Google OAuth Callback API
export default async function handler(req, res) {
    try {
          const { code, error } = req.query;

      if (error) {
              return res.status(400).json({ error: 'OAuth failed', details: error });
      }

      if (!code) {
              return res.status(400).json({ error: 'Missing code' });
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
          const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
          const redirectUri = process.env.GOOGLE_REDIRECT_URI;

      if (!clientId || !clientSecret || !redirectUri) {
              return res.status(500).json({ error: 'Missing config' });
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
              return res.status(400).json({ error: 'Token exchange failed', details: tokenData });
      }

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
              return res.status(400).json({ error: 'User info failed', details: userData });
      }

      res.status(200).json({
              success: true,
              user: userData,
              tokens: tokenData
      });

    } catch (error) {
          res.status(500).json({ error: 'Server error', message: error.message });
    }
}
