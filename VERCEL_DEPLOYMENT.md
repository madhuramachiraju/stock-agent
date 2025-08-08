# 🚀 Quick Vercel Deployment Guide

This is the fastest way to get your Stock Agent application live on the internet!

## ⚡ 5-Minute Deployment

### Step 1: Prepare Your Code
```bash
# Make sure your code is in a GitHub repository
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with your GitHub account**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Vercel will automatically detect it's a Next.js app**
6. **Click "Deploy"**

That's it! Your app will be live in 2-3 minutes.

## 🔧 Configure Environment Variables

After deployment, you need to add your environment variables:

1. **Go to your Vercel project dashboard**
2. **Click Settings → Environment Variables**
3. **Add these variables:**

```env
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🔐 Update Google OAuth

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Select your project**
3. **Go to APIs & Services → Credentials**
4. **Edit your OAuth 2.0 Client ID**
5. **Add to "Authorized JavaScript origins":**
   ```
   https://your-vercel-domain.vercel.app
   ```
6. **Add to "Authorized redirect URIs":**
   ```
   https://your-vercel-domain.vercel.app/api/auth/callback/google
   ```

## 🌍 Custom Domain (Optional)

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **In Vercel dashboard → Settings → Domains**
3. **Add your domain**
4. **Update DNS settings as instructed**
5. **Update Google OAuth with your custom domain**

## ✅ Test Your Deployment

After deployment, test these features:
- [ ] Homepage loads
- [ ] Google sign-in works
- [ ] Stock search functionality
- [ ] Portfolio management
- [ ] Mobile responsiveness

## 🎉 You're Live!

Your Stock Agent application is now accessible to anyone on the internet!

**Your URL:** `https://your-vercel-domain.vercel.app`

## 📊 What's Included (Free)

- ✅ **Custom domain support**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Automatic deployments**
- ✅ **Analytics dashboard**
- ✅ **Performance monitoring**
- ✅ **99.9% uptime**

## 🔄 Automatic Deployments

Every time you push to your GitHub repository, Vercel will automatically:
1. Build your application
2. Run tests
3. Deploy to production
4. Update your live site

## 💰 Cost

**Free Tier:**
- Unlimited deployments
- Custom domains
- 100GB bandwidth/month
- Perfect for most projects

**Pro Plan ($20/month):**
- Team collaboration
- More bandwidth
- Advanced analytics
- Priority support

## 🆘 Need Help?

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**🎯 Pro Tip:** Vercel is the official hosting platform for Next.js, so you get the best performance and features! 