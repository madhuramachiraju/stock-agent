'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaPlus, FaChartLine, FaBell, FaStar, FaEye, FaExternalLinkAlt 
} from 'react-icons/fa';
import { BiTrendingUp } from 'react-icons/bi';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import StockStatus from '@/components/StockStatus';
import AISuggestionsBanner from '@/components/AISuggestionsBanner';
import AppleStocksSync from '@/components/AppleStocksSync';
import NewsCard from '@/components/NewsCard';
import StockSearch from '@/components/StockSearch';
import { useAuth } from '@/components/providers/AuthProvider';

export default function HomePage() {
  const { user, getPortfolio, addToPortfolio, removeFromPortfolio } = useAuth();
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [news, setNews] = useState<any[]>([]);

  // Get portfolio from AuthProvider
  const portfolio = getPortfolio();

  // Enhanced mock news data with better content
  const mockNews = [
    {
      id: 1,
      title: 'Apple Reports Strong Q4 Earnings',
      summary: 'Apple Inc. exceeded analyst expectations with record iPhone sales and strong services revenue growth. The company reported earnings per share of $1.29, beating estimates of $1.27.',
      source: 'Yahoo Finance',
      time: '2 hours ago',
      impact: 'positive',
      url: 'https://finance.yahoo.com/news/'
    },
    {
      id: 2,
      title: 'Tesla Announces New Gigafactory',
      summary: 'Tesla plans to build a new manufacturing facility in Texas, creating thousands of jobs and expanding production capacity for electric vehicles and battery technology.',
      source: 'MarketWatch',
      time: '4 hours ago',
      impact: 'positive',
      url: 'https://www.marketwatch.com/newsview'
    },
    {
      id: 3,
      title: 'Market Volatility Expected This Week',
      summary: 'Analysts predict increased market volatility due to Fed meeting and key economic data releases. Investors should brace for potential price swings across major indices.',
      source: 'Investing.com',
      time: '6 hours ago',
      impact: 'neutral',
      url: 'https://www.investing.com/news/'
    },
    {
      id: 4,
      title: 'Microsoft Cloud Revenue Surges',
      summary: 'Microsoft\'s Azure cloud platform continues to dominate the market with 40% revenue growth, outpacing competitors and driving strong quarterly results.',
      source: 'Seeking Alpha',
      time: '8 hours ago',
      impact: 'positive',
      url: 'https://seekingalpha.com/news'
    },
    {
      id: 5,
      title: 'Amazon Faces Regulatory Scrutiny',
      summary: 'Federal regulators are investigating Amazon\'s business practices, particularly in the e-commerce and cloud computing sectors, raising concerns about market dominance.',
      source: 'Yahoo Finance',
      time: '10 hours ago',
      impact: 'negative',
      url: 'https://finance.yahoo.com/news/'
    },
    {
      id: 6,
      title: 'NVIDIA Continues AI Chip Dominance',
      summary: 'NVIDIA reports record-breaking quarterly results driven by surging demand for AI chips and data center solutions, with revenue growing 40% year-over-year.',
      source: 'MarketWatch',
      time: '12 hours ago',
      impact: 'positive',
      url: 'https://www.marketwatch.com/newsview'
    },
    {
      id: 7,
      title: 'Federal Reserve Signals Rate Cut Possibility',
      summary: 'Federal Reserve officials indicate potential interest rate cuts in 2024 if inflation continues to moderate, sending markets higher on accommodative policy expectations.',
      source: 'Investing.com',
      time: '14 hours ago',
      impact: 'positive',
      url: 'https://www.investing.com/news/'
    },
    {
      id: 8,
      title: 'IPO Market Shows Recovery Signs',
      summary: 'Several high-profile companies prepare to go public, signaling renewed investor confidence and potential uptick in market activity after a period of reduced IPO activity.',
      source: 'Seeking Alpha',
      time: '16 hours ago',
      impact: 'positive',
      url: 'https://seekingalpha.com/news'
    }
  ];

  useEffect(() => {
    setNews(mockNews);
  }, []);

  const handleNewsReadMore = (newsItem: any) => {
    if (newsItem.url) {
      window.open(newsItem.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `/news/${newsItem.id}`;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Hero Section */}
          <motion.section 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Logo size="lg" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gradient mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Smart Portfolio Management
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Track, analyze, and manage your investments with real-time updates, AI-powered insights, and comprehensive portfolio tracking
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => setShowStockSearch(true)}
                className="btn-primary flex items-center gap-3 text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSearch />
                Search Stocks
              </motion.button>
              <motion.button
                className="btn-secondary flex items-center gap-3 text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
                Add to Portfolio
              </motion.button>
            </motion.div>
          </motion.section>

          {/* Enhanced AI Banner */}
          <motion.div variants={itemVariants} className="mb-8">
            <AISuggestionsBanner />
          </motion.div>

          {/* Enhanced Apple Stocks Sync */}
          <motion.div variants={itemVariants} className="mb-8">
            <AppleStocksSync />
          </motion.div>

          {/* Enhanced Most Wanted Companies */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <BiTrendingUp className="text-blue-400" />
                Most Wanted Companies
              </h2>
              <motion.button
                className="btn-secondary text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[
                { symbol: 'AAPL', name: 'Apple Inc.', icon: '🍎', color: 'text-gray-800' },
                { symbol: 'MSFT', name: 'Microsoft', icon: '💻', color: 'text-blue-600' },
                { symbol: 'GOOGL', name: 'Alphabet', icon: '🔍', color: 'text-red-500' },
                { symbol: 'AMZN', name: 'Amazon', icon: '📦', color: 'text-orange-500' },
                { symbol: 'TSLA', name: 'Tesla', icon: '⚡', color: 'text-red-600' },
                { symbol: 'META', name: 'Meta', icon: '📘', color: 'text-blue-500' },
                { symbol: 'NVDA', name: 'NVIDIA', icon: '🎮', color: 'text-green-600' },
                { symbol: 'NFLX', name: 'Netflix', icon: '🎬', color: 'text-red-600' },
                { symbol: 'SPOT', name: 'Spotify', icon: '🎵', color: 'text-green-500' },
                { symbol: 'UBER', name: 'Uber', icon: '🚗', color: 'text-black' }
              ].map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  className="stock-card text-center group"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className={`text-4xl mb-3 ${stock.color} group-hover:scale-110 transition-transform duration-300`}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                  >
                    {stock.icon}
                  </motion.div>
                  <h3 className="font-bold text-white text-lg mb-1">{stock.symbol}</h3>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <motion.a
                      href={`/stock/${stock.symbol}`}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEye className="text-blue-400" />
                    </motion.a>
                    <motion.button
                      className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaStar className="text-green-400" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Enhanced Portfolio and News Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Portfolio Section */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaChartLine className="text-blue-400" />
                  Your Portfolio
                </h2>
                <motion.button
                  className="btn-primary text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All
                </motion.button>
              </div>
              
              {user ? (
                portfolio && portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.slice(0, 3).map((stock: any) => (
                      <StockStatus 
                        key={stock.symbol}
                        symbol={stock.symbol}
                        price={stock.price}
                        change={stock.change}
                        changePercent={stock.changePercent}
                        volume={stock.volume}
                        marketCap={stock.marketCap}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">📈</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Your portfolio is empty</h3>
                    <p className="text-gray-400 mb-6">Start building your portfolio by adding stocks</p>
                    <motion.button
                      onClick={() => setShowStockSearch(true)}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Your First Stock
                    </motion.button>
                  </div>
                )
              ) : (
                <div className="card text-center py-12">
                  <div className="text-gray-500 text-6xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Sign in to manage your portfolio</h3>
                  <p className="text-gray-400 mb-6">Your portfolio will be saved to your account</p>
                  <motion.button
                    className="btn-primary flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlus />
                    Sign In to Start
                  </motion.button>
                </div>
              )}
            </motion.section>

            {/* Enhanced Breaking News Section */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaBell className="text-purple-400" />
                  Breaking News
                </h2>
                <motion.button
                  className="btn-secondary text-sm flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaExternalLinkAlt />
                  Notifications
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {news.slice(0, 4).map((item) => (
                  <NewsCard
                    key={item.id}
                    news={item}
                    onReadMore={handleNewsReadMore}
                  />
                ))}
              </div>
            </motion.section>
          </div>
        </motion.div>
      </main>

      {/* Enhanced Stock Search Modal */}
      <AnimatePresence>
        {showStockSearch && (
          <StockSearch 
            onClose={() => setShowStockSearch(false)} 
            onAddToPortfolio={addToPortfolio}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 