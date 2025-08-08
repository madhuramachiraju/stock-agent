# 🚀 Stock Agent - Deployment Guide

This guide will help you deploy your Stock Agent application to a real domain with a professional hosting service.

## 📋 Pre-Deployment Checklist

### ✅ Required Items
- [ ] GitHub repository with your code
- [ ] Domain name (optional but recommended)
- [ ] Environment variables configured
- [ ] Google OAuth credentials (for production)
- [ ] Stock API keys

### 🔧 Environment Variables for Production

You'll need to update these environment variables for production:

```env
# Production URLs (replace with your domain)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-nextauth-secret

# Google OAuth (Production credentials)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Database (if using MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-agent

# Email (Gmail App Password)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-specific-password

# Stock APIs
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
```

## 🌐 Deployment Options

### 1. **Vercel (Recommended) - FREE**

**Why Vercel?**
- Perfect for Next.js applications
- Automatic deployments from GitHub
- Free tier available
- Built-in analytics and performance monitoring
- Custom domain support

**Steps:**
1. **Prepare your repository**
   ```bash
   # Make sure your code is in a GitHub repository
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js app

3. **Configure Environment Variables**
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add all your production environment variables

4. **Custom Domain (Optional)**
   - In your Vercel project dashboard
   - Go to Settings → Domains
   - Add your custom domain
   - Update your DNS settings as instructed

**Vercel Configuration:**
```json
// vercel.json (optional - Vercel auto-detects Next.js)
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### 2. **Netlify - FREE**

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Sign up and connect your GitHub
3. Click "New site from Git"
4. Choose your repository
5. Set build command: `npm run build`
6. Set publish directory: `.next`
7. Add environment variables in Site settings

### 3. **Railway - PAID**

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub repo
4. Add environment variables
5. Deploy automatically

### 4. **DigitalOcean App Platform - PAID**

**Steps:**
1. Go to [digitalocean.com](https://digitalocean.com)
2. Create App Platform project
3. Connect your GitHub repository
4. Configure build settings
5. Add environment variables
6. Deploy

## 🔐 Production Security Setup

### 1. **Update Google OAuth for Production**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to APIs & Services → Credentials
4. Edit your OAuth 2.0 Client ID
5. Add your production domain to "Authorized JavaScript origins":
   ```
   https://yourdomain.com
   ```
6. Add your production callback URL to "Authorized redirect URIs":
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

### 2. **Generate Strong Secrets**

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 32
```

### 3. **Database Setup (Optional)**

For production, consider using MongoDB Atlas:
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 🌍 Domain Setup

### **Buying a Domain**
- **Namecheap**: Good prices, easy setup
- **GoDaddy**: Popular, good support
- **Google Domains**: Clean interface
- **Cloudflare**: Free privacy protection

### **DNS Configuration**

After buying a domain, configure DNS:

**For Vercel:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: CNAME
Name: @
Value: your-site.netlify.app
```

## 📊 Post-Deployment Checklist

### ✅ Verify Everything Works
- [ ] Homepage loads correctly
- [ ] Google OAuth sign-in works
- [ ] Stock search functionality
- [ ] Portfolio management
- [ ] Email notifications (if configured)
- [ ] Mobile responsiveness

### ✅ Performance Optimization
- [ ] Images are optimized
- [ ] Loading times are acceptable
- [ ] SEO meta tags are set
- [ ] Analytics are configured (optional)

### ✅ Security Verification
- [ ] HTTPS is enabled
- [ ] Security headers are working
- [ ] Environment variables are secure
- [ ] No sensitive data in client-side code

## 🔧 Troubleshooting

### **Common Issues:**

1. **Build Errors**
   ```bash
   # Check build locally first
   npm run build
   ```

2. **Environment Variables Not Working**
   - Double-check spelling
   - Ensure they're added to hosting platform
   - Restart deployment after adding

3. **OAuth Not Working**
   - Verify production URLs in Google Console
   - Check callback URLs match exactly

4. **Domain Not Working**
   - DNS propagation can take 24-48 hours
   - Check DNS settings with `nslookup yourdomain.com`

## 📈 Monitoring & Analytics

### **Free Analytics Options:**
- **Google Analytics**: Track user behavior
- **Vercel Analytics**: Built-in with Vercel
- **Hotjar**: User session recordings

### **Performance Monitoring:**
- **Lighthouse**: Test performance
- **WebPageTest**: Detailed performance analysis
- **GTmetrix**: Speed testing

## 🚀 Going Live Checklist

### **Final Steps:**
- [ ] Test all features on production
- [ ] Update README with live URL
- [ ] Set up monitoring/analytics
- [ ] Configure error tracking
- [ ] Test email notifications
- [ ] Verify mobile experience
- [ ] Check loading speeds
- [ ] Test OAuth flows

## 💰 Cost Breakdown

### **Free Tier (Recommended for starting):**
- **Vercel**: $0/month (includes custom domain)
- **Domain**: ~$10-15/year
- **Total**: ~$10-15/year

### **Paid Options (for scaling):**
- **Vercel Pro**: $20/month
- **Database**: $0-15/month
- **Domain**: $10-15/year
- **Total**: $30-50/month

## 🎉 Congratulations!

Your Stock Agent application is now live on the internet! 

**Next Steps:**
1. Share your domain with users
2. Monitor performance and usage
3. Gather feedback and iterate
4. Consider adding more features
5. Scale as needed

---

**Need Help?**
- Check the hosting platform's documentation
- Review error logs in your hosting dashboard
- Test locally first before deploying changes
- Use the troubleshooting section above 