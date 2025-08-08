# 📧 Daily Portfolio News Email System - API Setup Guide

## Overview
The Stock Agent notification system sends daily email updates with news about stocks in your portfolio. This guide will help you set up all the required APIs and services.

## 🔑 Required API Keys

### 1. **News APIs (Choose One or More)**

#### **Option A: Alpha Vantage (Recommended)**
- **Free Tier**: 500 requests/day
- **Features**: News sentiment analysis, comprehensive coverage
- **Setup**:
  1. Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
  2. Sign up for a free account
  3. Get your API key
  4. Add to `.env.local`: `ALPHA_VANTAGE_API_KEY=your-key-here`

#### **Option B: NewsAPI.org**
- **Free Tier**: 100 requests/day
- **Features**: Good news coverage, multiple sources
- **Setup**:
  1. Go to [NewsAPI.org](https://newsapi.org/register)
  2. Sign up for a free account
  3. Get your API key
  4. Add to `.env.local`: `NEWS_API_KEY=your-key-here`

#### **Option C: Finnhub**
- **Free Tier**: 60 calls/minute
- **Features**: Real-time financial news
- **Setup**:
  1. Go to [Finnhub](https://finnhub.io/register)
  2. Sign up for a free account
  3. Get your API key
  4. Add to `.env.local`: `FINNHUB_API_KEY=your-key-here`

### 2. **Email Service (Gmail)**

#### **Gmail Setup**
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Add to `.env.local`**:
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

### 3. **Security Keys**

#### **Cron Job Security**
```bash
# Generate a secure random string for cron job authentication
CRON_SECRET=your-secure-random-string-here
INTERNAL_API_SECRET=another-secure-random-string-here
```

## 🚀 Quick Setup Script

Run this script to help you set up the APIs:

```bash
node setup-notification-apis.js
```

## 📋 Environment Variables Template

Add these to your `.env.local` file:

```bash
# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# News APIs (Choose one or more)
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
NEWS_API_KEY=your-newsapi-key
FINNHUB_API_KEY=your-finnhub-api-key

# Security
CRON_SECRET=your-cron-job-secret-key
INTERNAL_API_SECRET=your-internal-api-secret
```

## 🔧 API Configuration Details

### **Alpha Vantage API**
```javascript
// Example API call
const response = await fetch(
  `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=${API_KEY}&limit=10`
);
```

**Features**:
- ✅ Sentiment analysis
- ✅ Company-specific news
- ✅ High request limit (500/day)
- ✅ Real-time data

### **NewsAPI.org**
```javascript
// Example API call
const response = await fetch(
  `https://newsapi.org/v2/everything?q=AAPL&from=2024-01-01&sortBy=publishedAt&apiKey=${API_KEY}`
);
```

**Features**:
- ✅ Multiple news sources
- ✅ Good coverage
- ✅ Easy to use
- ⚠️ Lower request limit (100/day)

### **Finnhub**
```javascript
// Example API call
const response = await fetch(
  `https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2024-01-01&to=2024-01-02&token=${API_KEY}`
);
```

**Features**:
- ✅ Real-time financial news
- ✅ High rate limit (60/minute)
- ✅ Company-specific news
- ✅ Market data integration

## 📧 Email System Features

### **Daily News Email Includes**:
- 📰 News articles for each stock in portfolio
- 🎯 Sentiment analysis (positive/negative/neutral)
- 🔗 Direct links to full articles
- 📊 Stock performance context
- 🎨 Beautiful HTML email template
- 📱 Mobile-responsive design

### **Email Schedule**:
- ⏰ User-configurable delivery time
- 🌍 Timezone-aware
- 📅 Daily delivery (weekdays)
- 🔄 Automatic retry on failure

## 🔒 Security Features

### **Email Security**:
- 🔐 TLS/SSL encryption
- 🛡️ Gmail App Password (not regular password)
- 📧 Secure SMTP connection
- 🚫 No email sharing with third parties

### **API Security**:
- 🔑 Secure API key storage
- 🛡️ Rate limiting protection
- 🔒 Request validation
- 🚫 No sensitive data logging

## 🧪 Testing the System

### **1. Test Email Configuration**
```bash
# Send a test email
curl -X POST http://localhost:3000/api/notifications/portfolio-news \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "userEmail": "your-email@example.com",
    "userName": "Test User",
    "portfolio": [{"symbol": "AAPL", "name": "Apple Inc."}]
  }'
```

### **2. Test News API**
```bash
# Test Alpha Vantage
curl "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=YOUR_API_KEY&limit=5"

# Test NewsAPI
curl "https://newsapi.org/v2/everything?q=AAPL&apiKey=YOUR_API_KEY&pageSize=5"

# Test Finnhub
curl "https://finnhub.io/api/v1/company-news?symbol=AAPL&token=YOUR_API_KEY"
```

## 🚀 Production Deployment

### **1. Vercel Cron Jobs**
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-news",
      "schedule": "0 18 * * 1-5"
    }
  ]
}
```

### **2. Environment Variables**
Set these in your Vercel dashboard:
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `ALPHA_VANTAGE_API_KEY` (or other news API)
- `CRON_SECRET`
- `INTERNAL_API_SECRET`

### **3. Database Integration**
For production, replace the mock user function with a real database query:
```javascript
// Example with MongoDB
async function getUsersWithDailyNewsEnabled() {
  const users = await db.collection('users').find({
    'preferences.dailyNewsEmail': true
  }).toArray();
  return users;
}
```

## 📊 Monitoring & Analytics

### **Email Analytics**:
- 📈 Delivery success rate
- 📊 Open rate tracking
- 🔗 Click-through rates
- ⏰ Delivery time optimization

### **API Usage**:
- 📊 Request count monitoring
- ⚠️ Rate limit alerts
- 🔄 Fallback API usage
- 💰 Cost optimization

## 🆘 Troubleshooting

### **Common Issues**:

1. **Gmail Authentication Error**
   - ✅ Use App Password, not regular password
   - ✅ Enable 2-Factor Authentication
   - ✅ Check Gmail security settings

2. **News API Rate Limit**
   - ✅ Implement fallback APIs
   - ✅ Cache responses
   - ✅ Monitor usage

3. **Email Not Sending**
   - ✅ Check Gmail settings
   - ✅ Verify environment variables
   - ✅ Check server logs

## 📞 Support

For help with API setup:
- 📧 Email: support@stockagent.com
- 📚 Documentation: [API Docs](https://docs.stockagent.com)
- 🐛 Issues: [GitHub Issues](https://github.com/stockagent/issues)

---

## 🎉 Ready to Go!

Once you've set up the APIs, your users will receive beautiful daily email updates with news about their portfolio stocks. The system is secure, scalable, and ready for production use! 