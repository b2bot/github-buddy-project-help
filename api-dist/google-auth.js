"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const googleapis_1 = require("googleapis");
const redirectUri = 'https://github-buddy-project-help.vercel.app/api/google-callback';
async function handler(req, res) {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
    const scopes = [
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/adwords',
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/analytics.edit',
        'https://www.googleapis.com/auth/analytics.manage.users.readonly',
        'https://www.googleapis.com/auth/analytics.user.deletion',
    ];
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    });
    res.writeHead(302, { Location: url });
    res.end();
}
