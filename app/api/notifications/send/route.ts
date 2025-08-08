import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Use app-specific password
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, portfolioData, newsData } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = createEmailContent(portfolioData, newsData);

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Daily Stock Market Update - Stock Agent',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

function createEmailContent(portfolioData: any, newsData: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Daily Stock Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .stock-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        .news-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📈 Daily Stock Market Update</h1>
          <p>Your personalized stock portfolio summary</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>📊 Portfolio Summary</h2>
            ${portfolioData ? portfolioData.map((stock: any) => `
              <div class="stock-item">
                <h3>${stock.symbol} - ${stock.name}</h3>
                <p><strong>Current Price:</strong> $${stock.currentPrice}</p>
                <p><strong>Change:</strong> <span class="${stock.change >= 0 ? 'positive' : 'negative'}">
                  ${stock.change >= 0 ? '+' : ''}${stock.change} (${stock.changePercent}%)
                </span></p>
                <p><strong>Shares:</strong> ${stock.shares}</p>
                <p><strong>Total Value:</strong> $${(stock.shares * stock.currentPrice).toFixed(2)}</p>
              </div>
            `).join('') : '<p>No portfolio data available</p>'}
          </div>
          
          <div class="section">
            <h2>📰 Breaking News</h2>
            ${newsData ? newsData.map((news: any) => `
              <div class="news-item">
                <h3>${news.title}</h3>
                <p>${news.summary}</p>
                <small>Source: ${news.source} | ${news.time}</small>
              </div>
            `).join('') : '<p>No news available</p>'}
          </div>
          
          <div class="section">
            <h2>🎯 Action Items</h2>
            <ul>
              <li>Review your portfolio performance</li>
              <li>Check for any significant price movements</li>
              <li>Consider rebalancing if needed</li>
              <li>Stay updated with market news</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent by Stock Agent</p>
          <p>To unsubscribe or manage preferences, visit your account settings</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 