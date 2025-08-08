# OAuth Setup Guide for Stock Agent

This guide will help you set up real Google and Apple OAuth authentication for your Stock Agent application.

## Prerequisites

- A Google account
- An Apple Developer account (for Apple Sign-In)
- Your application running on localhost:3000

## Step 1: Google OAuth Setup

### 1.1 Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/apple`
   - Click "Create"

### 1.2 Get Google Credentials

After creating the OAuth client, you'll get:
- **Client ID**: Copy this value
- **Client Secret**: Copy this value

## Step 2: Apple Sign-In Setup

### 2.1 Apple Developer Account Setup

1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Go to "Certificates, Identifiers & Profiles"
4. Create a new App ID:
   - Click the "+" button
   - Choose "App IDs" > "App"
   - Fill in the details:
     - Description: "Stock Agent"
     - Bundle ID: `com.yourcompany.stockagent`
   - Enable "Sign In with Apple"
   - Click "Continue" and "Register"

### 2.2 Create Service ID

1. Go to "Identifiers" > "Services IDs"
2. Click the "+" button
3. Choose "Services IDs"
4. Fill in the details:
   - Description: "Stock Agent Web"
   - Identifier: `com.yourcompany.stockagent.web`
5. Enable "Sign In with Apple"
6. Configure the domain:
   - Primary App ID: Select your App ID
   - Domains and Subdomains: `localhost`
   - Return URLs: `http://localhost:3000/api/auth/callback/apple`
7. Click "Continue" and "Register"

### 2.3 Create Private Key

1. Go to "Keys"
2. Click the "+" button
3. Fill in the details:
   - Key Name: "Stock Agent Sign In"
   - Enable "Sign In with Apple"
4. Click "Configure" and select your App ID
5. Click "Continue" and "Register"
6. Download the key file (.p8)
7. Note the Key ID

### 2.4 Generate Apple Client Secret

You'll need to generate a JWT token as your client secret. Use this Node.js script:

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('path/to/your/AuthKey_KEYID.p8');
const teamId = 'YOUR_TEAM_ID'; // Found in Apple Developer account
const keyId = 'YOUR_KEY_ID'; // From the key you created
const clientId = 'com.yourcompany.stockagent.web'; // Your Service ID

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: teamId,
  subject: clientId,
  keyid: keyId
});

console.log('Apple Client Secret:', token);
```

## Step 3: Environment Configuration

1. Create a `.env.local` file in your project root
2. Add your OAuth credentials:

```env
# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
APPLE_CLIENT_ID=com.yourcompany.stockagent.web
APPLE_CLIENT_SECRET=your-generated-jwt-token-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here
```

## Step 4: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Click "Sign In" and test both:
   - Google Sign-In
   - Apple Sign-In

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:
   - Make sure your redirect URIs exactly match what's configured in Google/Apple
   - Check for trailing slashes or protocol mismatches

2. **Apple Sign-In not working**:
   - Verify your Service ID is correctly configured
   - Ensure your domain (localhost) is added to the allowed domains
   - Check that your JWT token is valid and not expired

3. **Google Sign-In not working**:
   - Verify your OAuth client is configured for web applications
   - Check that the Google+ API is enabled
   - Ensure your redirect URI is correct

### Security Notes:

- Never commit your `.env.local` file to version control
- Keep your client secrets secure
- Use environment variables in production
- Regularly rotate your secrets

## Production Deployment

When deploying to production:

1. Update your OAuth redirect URIs to your production domain
2. Set up proper environment variables on your hosting platform
3. Update `NEXTAUTH_URL` to your production URL
4. Generate a new `NEXTAUTH_SECRET` for production

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your OAuth configuration
3. Test with a fresh browser session
4. Check the NextAuth logs in your terminal 