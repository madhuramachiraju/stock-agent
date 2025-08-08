# 🚀 Quick Google OAuth Setup Guide

## Step 1: Go to Google Cloud Console
1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account (the same one you want to use for sign-in)

## Step 2: Create a New Project
1. Click on the project dropdown at the top of the page
2. Click **"New Project"**
3. Name it: **"Stock Agent"**
4. Click **"Create"**

## Step 3: Enable Google+ API
1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on **"Google+ API"**
4. Click **"Enable"**

## Step 4: Create OAuth Credentials
1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. If prompted, click **"Configure Consent Screen"**:
   - User Type: **External**
   - App name: **"Stock Agent"**
   - User support email: **Your email**
   - Developer contact information: **Your email**
   - Click **"Save and Continue"** (skip other sections)
   - Click **"Save and Continue"** again
   - Click **"Back to Dashboard"**

4. Now create the OAuth client:
   - Application type: **"Web application"**
   - Name: **"Stock Agent"**
   - Authorized redirect URIs: **`http://localhost:3000/api/auth/callback/google`**
   - Click **"Create"**

## Step 5: Copy Your Credentials
You'll see a popup with your credentials:
- **Client ID**: Looks like `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret**: Looks like `GOCSPX-your-secret-here`

**Copy both values!** You'll need them for the next step.

## Step 6: Update Your App
1. Go back to your terminal
2. Run: `node quick-oauth-setup.js`
3. Enter your Client ID and Client Secret when prompted

## That's it! 🎉
After completing these steps, your Google OAuth will work perfectly!

---

## Need Help?
- **Stuck on any step?** Take a screenshot and I can help
- **Don't see the options?** Make sure you're signed in with the right Google account
- **Getting errors?** Make sure you've enabled the Google+ API first

## Quick Links
- **Google Cloud Console**: https://console.cloud.google.com/
- **APIs & Services**: https://console.cloud.google.com/apis
- **Credentials**: https://console.cloud.google.com/apis/credentials 