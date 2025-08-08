'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaArrowUp, FaArrowDown, FaChartLine, FaNewspaper, 
  FaExternalLinkAlt, FaPlus, FaStar, FaShareAlt,
  FaInfoCircle, FaBrain, FaLightbulb, FaExclamationTriangle
} from 'react-icons/fa';
import Header from '@/components/Header';
import StockStatus from '@/components/StockStatus';
import AIAgent from '@/components/AIAgent';
import PortfolioSaveOption from '@/components/PortfolioSaveOption';
import { useAuth } from '@/components/providers/AuthProvider';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  pe: number;
  dividend: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  time: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { user, addToPortfolio } = useAuth();
  
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<'review' | 'action'>('review');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStockData();
    loadNews();
  }, [symbol]);

  const loadStockData = async () => {
    // Mock stock data - replace with actual API call
    const mockData: StockData = {
      symbol: symbol,
      name: symbol === 'AAPL' ? 'Apple Inc.' : 
            symbol === 'MSFT' ? 'Microsoft Corporation' :
            symbol === 'GOOGL' ? 'Alphabet Inc.' :
            symbol === 'AMZN' ? 'Amazon.com Inc.' :
            symbol === 'TSLA' ? 'Tesla Inc.' : `${symbol} Corporation`,
      price: 175.50,
      change: 2.25,
      changePercent: 1.30,
      marketCap: '2.8T',
      volume: '45.2M',
      pe: 28.5,
      dividend: 0.88,
      high: 178.20,
      low: 173.80,
      open: 174.50,
      previousClose: 173.25
    };
    
    setStockData(mockData);
    setLoading(false);
  };

  const loadNews = async () => {
    // Mock news data - replace with actual API call
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: `${symbol} Reports Strong Q4 Earnings`,
        summary: `${symbol} exceeded analyst expectations with record sales and strong guidance for the upcoming quarter. The company's revenue grew 15% year-over-year, driven by strong demand for their core products.`,
        source: 'Reuters',
        time: '2 hours ago',
        impact: 'positive'
      },
      {
        id: 2,
        title: `Analysts Upgrade ${symbol} Price Target`,
        summary: `Multiple analysts have raised their price targets for ${symbol} following the latest earnings report. Goldman Sachs increased their target to $200, citing strong fundamentals and growth potential.`,
        source: 'Bloomberg',
        time: '4 hours ago',
        impact: 'positive'
      },
      {
        id: 3,
        title: `${symbol} Announces New Product Line`,
        summary: `${symbol} unveiled a new product line that could drive significant revenue growth in the coming year. The announcement was well-received by investors and analysts.`,
        source: 'CNBC',
        time: '6 hours ago',
        impact: 'positive'
      },
      {
        id: 4,
        title: `Market Volatility Affects ${symbol} Stock`,
        summary: `Recent market volatility has impacted ${symbol} stock price, but the company's fundamentals remain strong. This could present a buying opportunity for long-term investors.`,
        source: 'MarketWatch',
        time: '8 hours ago',
        impact: 'neutral'
      }
    ];
    
    setNews(mockNews);
  };

  const getStockWebsite = () => {
    const websites: { [key: string]: string } = {
      'AAPL': 'https://www.apple.com',
      'MSFT': 'https://www.microsoft.com',
      'GOOGL': 'https://www.google.com',
      'AMZN': 'https://www.amazon.com',
      'TSLA': 'https://www.tesla.com'
    };
    return websites[symbol] || `https://finance.yahoo.com/quote/${symbol}`;
  };

  const handleSaveToPortfolio = (shares: number, avgPrice: number) => {
    if (!stockData || !user) {
      alert('Please sign in to save stocks to your portfolio');
      return;
    }
    
    const portfolioStock = {
      symbol: stockData.symbol,
      name: stockData.name,
      shares: shares,
      avgPrice: avgPrice,
      currentPrice: stockData.price,
      change: stockData.change,
      changePercent: stockData.changePercent
    };

    addToPortfolio(portfolioStock);
    alert(`${stockData.symbol} has been added to your portfolio!`);
  };

  const handleCancelPortfolio = () => {
    // Handle cancel action if needed
    console.log('Portfolio save cancelled');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Stock not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stock Status */}
        <StockStatus 
          symbol={stockData.symbol}
          price={stockData.price}
          change={stockData.change}
          changePercent={stockData.changePercent}
          volume={stockData.volume}
          marketCap={stockData.marketCap}
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'review' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FaNewspaper className="inline mr-2" />
            Review
          </button>
          <button
            onClick={() => setActiveTab('action')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'action' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FaBrain className="inline mr-2" />
            Action
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'review' ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Recent News Impact */}
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaNewspaper />
                    Recent News & Impact Analysis
                  </h2>
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div key={item.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white mb-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.impact === 'positive' ? 'bg-green-900/50 text-green-400' :
                            item.impact === 'negative' ? 'bg-red-900/50 text-red-400' :
                            'bg-gray-700/50 text-gray-400'
                          }`}>
                            {item.impact === 'positive' ? <FaArrowUp className="inline mr-1" /> :
                             item.impact === 'negative' ? <FaArrowDown className="inline mr-1" /> :
                             <FaInfoCircle className="inline mr-1" />}
                            {item.impact}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{item.source}</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Analysis */}
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaChartLine />
                    Technical Analysis
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="text-2xl font-bold text-white">${stockData.high.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Day High</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="text-2xl font-bold text-white">${stockData.low.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Day Low</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="text-2xl font-bold text-white">${stockData.open.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Open</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="text-2xl font-bold text-white">${stockData.previousClose.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Previous Close</div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-4">Key Metrics</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-300">Market Cap</span>
                      <span className="font-medium text-white">{stockData.marketCap}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-300">P/E Ratio</span>
                      <span className="font-medium text-white">{stockData.pe}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-300">Dividend Yield</span>
                      <span className="font-medium text-white">{stockData.dividend}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Volume</span>
                      <span className="font-medium text-white">{stockData.volume}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* AI Action Plan */}
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaBrain />
                    AI Agent Analysis & Recommendations
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaArrowUp className="text-green-400" />
                        <span className="font-medium text-green-400">Buy Recommendation</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Based on strong fundamentals, positive technical indicators, and recent news sentiment, 
                        this appears to be a good entry point. The stock shows upward momentum with strong support levels.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaExclamationTriangle className="text-yellow-400" />
                        <span className="font-medium text-yellow-400">Risk Assessment</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Monitor market volatility and consider dollar-cost averaging for large positions. 
                        Set stop-loss orders around $170 to manage downside risk.
                      </p>
                    </div>

                    <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaChartLine className="text-blue-400" />
                        <span className="font-medium text-blue-400">Price Targets</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-400">Short-term (1-3 months):</span>
                          <div className="font-medium text-white">$180.00</div>
                        </div>
                        <div>
                          <span className="text-blue-400">Long-term (6-12 months):</span>
                          <div className="font-medium text-white">$200.00</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaLightbulb className="text-purple-400" />
                        <span className="font-medium text-purple-400">AI Insights</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        The AI analysis indicates strong institutional buying, positive earnings momentum, 
                        and favorable sector rotation. Consider this as a core holding in your portfolio.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="btn-primary flex items-center justify-center gap-2">
                      <FaPlus />
                      Add to Portfolio
                    </button>
                    <button className="btn-secondary flex items-center justify-center gap-2">
                      <FaStar />
                      Add to Watchlist
                    </button>
                    <button className="btn-secondary flex items-center justify-center gap-2">
                      <FaShareAlt />
                      Share Analysis
                    </button>
                    <a
                      href={getStockWebsite()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <FaExternalLinkAlt />
                      Visit Company Website
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Agent */}
            <AIAgent 
              symbol={stockData.symbol}
              currentPrice={stockData.price}
              isLoggedIn={!!user}
            />

            {/* Portfolio Save Option */}
            <PortfolioSaveOption
              symbol={stockData.symbol}
              name={stockData.name}
              currentPrice={stockData.price}
              onSave={handleSaveToPortfolio}
              onCancel={handleCancelPortfolio}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 