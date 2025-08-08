import { NextRequest, NextResponse } from 'next/server';
import { withSecurity } from '@/utils/apiSecurity';
import { useAuth } from '@/components/providers/AuthProvider';

// News API configuration
const NEWS_API_CONFIG = {
  // Alpha Vantage News API (free tier: 500 requests/day)
  alphaVantage: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: process.env.ALPHA_VANTAGE_API_KEY,
  },
  // Alternative: NewsAPI.org (free tier: 100 requests/day)
  newsAPI: {
    baseUrl: 'https://newsapi.org/v2/everything',
    apiKey: process.env.NEWS_API_KEY,
  },
  // Alternative: Finnhub (free tier: 60 API calls/minute)
  finnhub: {
    baseUrl: 'https://finnhub.io/api/v1/company-news',
    apiKey: process.env.FINNHUB_API_KEY,
  }
};

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.GMAIL_USER || 'noreply@stockagent.com',
  subject: '📈 Your Daily Portfolio News Update',
  template: {
    header: `
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📈 Stock Agent</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Daily Portfolio News Update</p>
      </div>
    `,
    footer: `
      <div style="background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px;">
        <p>This email was sent by Stock Agent. You can manage your notification preferences in your account settings.</p>
        <p>© 2024 Stock Agent. All rights reserved.</p>
      </div>
    `
  }
};

// Fetch news for a specific stock symbol
async function fetchStockNews(symbol: string, days: number = 1) {
  try {
    // Try Alpha Vantage first
    if (NEWS_API_CONFIG.alphaVantage.apiKey) {
      const response = await fetch(
        `${NEWS_API_CONFIG.alphaVantage.baseUrl}?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${NEWS_API_CONFIG.alphaVantage.apiKey}&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.feed && data.feed.length > 0) {
          return data.feed.map((item: any) => ({
            title: item.title,
            summary: item.summary,
            url: item.url,
            time_published: item.time_published,
            source: item.source,
            sentiment: item.overall_sentiment_label,
            relevance_score: item.relevance_score
          }));
        }
      }
    }

    // Fallback to NewsAPI.org
    if (NEWS_API_CONFIG.newsAPI.apiKey) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      
      const response = await fetch(
        `${NEWS_API_CONFIG.newsAPI.baseUrl}?q=${symbol}&from=${fromDate.toISOString().split('T')[0]}&sortBy=publishedAt&apiKey=${NEWS_API_CONFIG.newsAPI.apiKey}&language=en&pageSize=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          return data.articles.map((article: any) => ({
            title: article.title,
            summary: article.description,
            url: article.url,
            time_published: article.publishedAt,
            source: article.source.name,
            sentiment: 'neutral', // NewsAPI doesn't provide sentiment
            relevance_score: 1.0
          }));
        }
      }
    }

    // Fallback to Finnhub
    if (NEWS_API_CONFIG.finnhub.apiKey) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const toDate = new Date();
      
      const response = await fetch(
        `${NEWS_API_CONFIG.finnhub.baseUrl}?symbol=${symbol}&from=${fromDate.toISOString().split('T')[0]}&to=${toDate.toISOString().split('T')[0]}&token=${NEWS_API_CONFIG.finnhub.apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return data.slice(0, 10).map((item: any) => ({
            title: item.headline,
            summary: item.summary,
            url: item.url,
            time_published: item.datetime,
            source: item.source,
            sentiment: item.sentiment || 'neutral',
            relevance_score: 1.0
          }));
        }
      }
    }

    return [];
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    return [];
  }
}

// Generate email HTML content
function generateEmailContent(userName: string, portfolioNews: any[]) {
  const newsItems = portfolioNews.map(stock => `
    <div style="margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background: #f8fafc; padding: 15px; border-bottom: 1px solid #e2e8f0;">
        <h3 style="margin: 0; color: #1e293b; font-size: 18px;">${stock.symbol} - ${stock.name}</h3>
        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">${stock.news.length} news items today</p>
      </div>
      <div style="padding: 15px;">
        ${stock.news.map((item: any) => `
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h4 style="margin: 0; color: #1e293b; font-size: 16px;">
                <a href="${item.url}" style="color: #3b82f6; text-decoration: none;">${item.title}</a>
              </h4>
              <span style="background: ${item.sentiment === 'positive' ? '#dcfce7' : item.sentiment === 'negative' ? '#fef2f2' : '#fef3c7'}; color: ${item.sentiment === 'positive' ? '#166534' : item.sentiment === 'negative' ? '#dc2626' : '#92400e'}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                ${item.sentiment}
              </span>
            </div>
            <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px; line-height: 1.5;">${item.summary}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748b;">
              <span>${item.source}</span>
              <span>${new Date(item.time_published).toLocaleDateString()}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Daily Portfolio News Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
      ${EMAIL_CONFIG.template.header}
      
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e293b; margin-bottom: 10px;">Hello ${userName}!</h2>
          <p style="color: #64748b; margin: 0; line-height: 1.6;">
            Here's your daily news update for the stocks in your portfolio. Stay informed about market movements and company developments.
          </p>
        </div>
        
        ${portfolioNews.length > 0 ? newsItems : `
          <div style="text-align: center; padding: 40px 20px; color: #64748b;">
            <p style="margin: 0; font-size: 16px;">No recent news found for your portfolio stocks.</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Check back tomorrow for updates!</p>
          </div>
        `}
        
        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center;">
          <p style="margin: 0 0 15px 0; color: #1e293b; font-weight: 500;">Want to see more details?</p>
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/portfolio" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
            View Your Portfolio
          </a>
        </div>
      </div>
      
      ${EMAIL_CONFIG.template.footer}
    </body>
    </html>
  `;
}

// Send email using Nodemailer
async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });

    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Main handler for portfolio news notifications
async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, userEmail, userName, portfolio } = await req.json();

    if (!userId || !userEmail || !portfolio || portfolio.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required data' 
      }, { status: 400 });
    }

    // Fetch news for each stock in portfolio
    const portfolioNews = [];
    
    for (const stock of portfolio) {
      const news = await fetchStockNews(stock.symbol, 1); // Last 1 day
      
      if (news.length > 0) {
        portfolioNews.push({
          symbol: stock.symbol,
          name: stock.name,
          news: news
        });
      }
    }

    // Generate email content
    const emailContent = generateEmailContent(userName, portfolioNews);
    
    // Send email
    const emailResult = await sendEmail(
      userEmail,
      EMAIL_CONFIG.subject,
      emailContent
    );

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Daily portfolio news email sent successfully',
        stocksProcessed: portfolio.length,
        newsItemsFound: portfolioNews.reduce((total, stock) => total + stock.news.length, 0)
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send email',
        details: emailResult.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Portfolio news notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export const POST = withSecurity(handler); 