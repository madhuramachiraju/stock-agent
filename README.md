# Stock Agent - Smart Portfolio Manager

A comprehensive stock trading and portfolio management application built with Next.js, React, and TypeScript. This application provides real-time stock tracking, portfolio management, and intelligent notifications.

## 🚀 Features

### Core Features
- **Most Wanted Companies**: Quick access to popular stock icons on the homepage
- **User Authentication**: Secure account creation and login with JWT tokens
- **Portfolio Management**: Track your stock holdings with real-time updates
- **Stock Search**: Find and analyze any stock with detailed information
- **Breaking News**: Real-time market news with impact analysis
- **Gmail Integration**: Daily email notifications after market hours

### Stock Analysis
- **Review Section**: Technical analysis, key metrics, and market data
- **Action Section**: Buy/sell recommendations, risk assessment, and price targets
- **Company Website Links**: Direct links to official company websites for actions
- **Single Glance Information**: Important data displayed for quick decision making

### Security & Protection
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Security Headers**: XSS protection, content type validation, and frame options
- **Input Validation**: Comprehensive form validation and sanitization

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer with Gmail integration
- **Icons**: React Icons
- **Charts**: Recharts (ready for implementation)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/stock-agent
   JWT_SECRET=your-super-secret-jwt-key-here
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-app-specific-password
   ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Gmail Setup for Notifications
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Use the app-specific password in `GMAIL_PASS`

### Stock API Setup
1. Sign up for Alpha Vantage API (free tier available)
2. Get your API key
3. Add it to `ALPHA_VANTAGE_API_KEY`

## 📱 Usage

### Homepage
- View most wanted companies with their icons
- See your portfolio summary
- Check breaking news
- Search for stocks

### Stock Details
- **Review Tab**: Technical analysis and key metrics
- **Action Tab**: Recommendations and quick actions
- Direct links to company websites for trading

### Portfolio Management
- Add stocks to your portfolio
- Track performance and gains/losses
- View detailed stock information

### Notifications
- Daily email updates after market hours
- Portfolio summary and news digest
- Action items and recommendations

## 🏗️ Project Structure

```
stock-agent/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── notifications/ # Email notification endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── stock/[symbol]/    # Stock detail pages
├── components/            # React components
│   ├── providers/         # Context providers
│   ├── Header.tsx         # Navigation header
│   ├── LoginModal.tsx     # Authentication modal
│   ├── PortfolioCard.tsx  # Portfolio display
│   ├── NewsCard.tsx       # News display
│   └── StockSearch.tsx    # Stock search modal
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔒 Security Features

- **JWT Token Authentication**: Secure user sessions
- **Password Hashing**: Bcrypt encryption
- **Security Headers**: XSS protection, content type validation
- **Input Validation**: Form validation and sanitization
- **CORS Protection**: Cross-origin request protection

## 📧 Email Notifications

The application sends daily email updates including:
- Portfolio performance summary
- Breaking news and market updates
- Action items and recommendations
- Risk assessments and price targets

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Railway**: Add environment variables and deploy
- **DigitalOcean**: Use App Platform or Droplets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- Real-time stock price updates
- Advanced charting with technical indicators
- Social trading features
- Mobile app development
- AI-powered stock recommendations
- Options and futures trading support

---

**Note**: This is a demo application with mock data. For production use, integrate with real stock APIs and implement proper database connections. 