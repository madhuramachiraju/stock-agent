'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaNewspaper, FaSearch, FaFilter, FaBookmark, FaShare,
  FaArrowUp, FaArrowDown, FaClock, FaExternalLinkAlt,
  FaStar, FaBell
} from 'react-icons/fa';
import Header from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  source: string;
  time: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'market' | 'earnings' | 'ipo' | 'mergers' | 'regulation' | 'technology';
  relatedStocks: string[];
  url?: string;
  isBookmarked?: boolean;
}

export default function NewsPage() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [bookmarkedNews, setBookmarkedNews] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadNews();
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery, selectedCategory, selectedImpact]);

  const loadNews = async () => {
    // Mock news data - replace with actual API call
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: 'Apple Reports Strong Q4 Earnings, Exceeds Expectations',
        summary: 'Apple Inc. exceeded analyst expectations with record iPhone sales and strong guidance for the upcoming quarter.',
        content: 'Apple Inc. (AAPL) reported fourth-quarter earnings that beat analyst expectations, driven by strong iPhone sales and services revenue growth. The company posted revenue of $89.5 billion, up 8% year-over-year, and earnings per share of $1.29, up 13% from the same period last year.',
        source: 'Yahoo Finance',
        time: '2 hours ago',
        impact: 'positive',
        category: 'earnings',
        relatedStocks: ['AAPL'],
        url: 'https://finance.yahoo.com/news/'
      },
      {
        id: 2,
        title: 'Tesla Announces New Gigafactory in Texas',
        summary: 'Tesla plans to build a new manufacturing facility in Texas, creating thousands of jobs.',
        content: 'Tesla Inc. (TSLA) announced plans to build a new Gigafactory in Texas, which will focus on the production of the Cybertruck and Model Y. The facility is expected to create over 5,000 jobs and significantly increase Tesla\'s production capacity.',
        source: 'MarketWatch',
        time: '4 hours ago',
        impact: 'positive',
        category: 'technology',
        relatedStocks: ['TSLA'],
        url: 'https://www.marketwatch.com/newsview'
      },
      {
        id: 3,
        title: 'Federal Reserve Signals Potential Rate Cuts in 2024',
        summary: 'The Federal Reserve indicated it may consider interest rate cuts next year amid economic uncertainty.',
        content: 'Federal Reserve officials signaled during their latest meeting that they may consider cutting interest rates in 2024 if inflation continues to moderate and economic growth slows. This news sent markets higher as investors anticipate more accommodative monetary policy.',
        source: 'Investing.com',
        time: '6 hours ago',
        impact: 'positive',
        category: 'market',
        relatedStocks: [],
        url: 'https://www.investing.com/news/'
      },
      {
        id: 4,
        title: 'Microsoft Acquires Gaming Studio for $10 Billion',
        summary: 'Microsoft has acquired a major gaming studio in a deal worth $10 billion.',
        content: 'Microsoft Corporation (MSFT) announced the acquisition of a major gaming studio for $10 billion, expanding its presence in the gaming industry. The deal is expected to strengthen Microsoft\'s Xbox division and cloud gaming services.',
        source: 'Seeking Alpha',
        time: '8 hours ago',
        impact: 'positive',
        category: 'mergers',
        relatedStocks: ['MSFT'],
        url: 'https://seekingalpha.com/news'
      },
      {
        id: 5,
        title: 'New Regulations Impact Cryptocurrency Markets',
        summary: 'New regulatory framework for cryptocurrencies has been proposed, affecting digital asset markets.',
        content: 'A new regulatory framework for cryptocurrencies has been proposed by financial regulators, which could significantly impact digital asset markets. The regulations aim to provide clarity and consumer protection while maintaining innovation in the sector.',
        source: 'Yahoo Finance',
        time: '10 hours ago',
        impact: 'neutral',
        category: 'regulation',
        relatedStocks: [],
        url: 'https://finance.yahoo.com/news/'
      },
      {
        id: 6,
        title: 'Amazon Faces Antitrust Investigation',
        summary: 'Federal regulators are investigating Amazon\'s business practices in e-commerce and cloud computing.',
        content: 'Amazon.com Inc. (AMZN) is facing a comprehensive antitrust investigation by federal regulators. The probe focuses on the company\'s dominance in e-commerce and cloud computing markets, raising concerns about potential anti-competitive practices.',
        source: 'MarketWatch',
        time: '12 hours ago',
        impact: 'negative',
        category: 'regulation',
        relatedStocks: ['AMZN'],
        url: 'https://www.marketwatch.com/newsview'
      },
      {
        id: 7,
        title: 'NVIDIA Reports Record GPU Sales',
        summary: 'NVIDIA continues to dominate the AI chip market with record-breaking quarterly results.',
        content: 'NVIDIA Corporation (NVDA) reported record-breaking quarterly results, driven by surging demand for AI chips and data center solutions. The company\'s revenue grew 40% year-over-year, exceeding analyst expectations.',
        source: 'Seeking Alpha',
        time: '14 hours ago',
        impact: 'positive',
        category: 'earnings',
        relatedStocks: ['NVDA'],
        url: 'https://seekingalpha.com/news'
      },
      {
        id: 8,
        title: 'IPO Market Shows Signs of Recovery',
        summary: 'Several high-profile companies are preparing to go public, signaling a potential recovery in the IPO market.',
        content: 'The initial public offering (IPO) market is showing signs of recovery as several high-profile companies prepare to go public. This could signal renewed investor confidence and a potential uptick in market activity.',
        source: 'Investing.com',
        time: '16 hours ago',
        impact: 'positive',
        category: 'ipo',
        relatedStocks: [],
        url: 'https://www.investing.com/news/'
      }
    ];
    setNews(mockNews);
  };

  const loadBookmarks = () => {
    if (user) {
      const userBookmarksKey = `bookmarks_${user.id}`;
      const savedBookmarks = localStorage.getItem(userBookmarksKey);
      if (savedBookmarks) {
        setBookmarkedNews(new Set(JSON.parse(savedBookmarks)));
      }
    }
  };

  const saveBookmarks = (bookmarks: Set<number>) => {
    if (user) {
      const userBookmarksKey = `bookmarks_${user.id}`;
      localStorage.setItem(userBookmarksKey, JSON.stringify(Array.from(bookmarks)));
      setBookmarkedNews(bookmarks);
    }
  };

  const toggleBookmark = (newsId: number) => {
    const newBookmarks = new Set(bookmarkedNews);
    if (newBookmarks.has(newsId)) {
      newBookmarks.delete(newsId);
    } else {
      newBookmarks.add(newsId);
    }
    saveBookmarks(newBookmarks);
  };

  const filterNews = () => {
    let filtered = news;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Impact filter
    if (selectedImpact !== 'all') {
      filtered = filtered.filter(item => item.impact === selectedImpact);
    }

    setFilteredNews(filtered);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <FaArrowUp size={12} />;
      case 'negative': return <FaArrowDown size={12} />;
      default: return <FaClock size={12} />;
    }
  };

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'market', name: 'Market News' },
    { id: 'earnings', name: 'Earnings' },
    { id: 'ipo', name: 'IPOs' },
    { id: 'mergers', name: 'Mergers & Acquisitions' },
    { id: 'regulation', name: 'Regulation' },
    { id: 'technology', name: 'Technology' }
  ];

  const impacts = [
    { id: 'all', name: 'All Impact' },
    { id: 'positive', name: 'Positive' },
    { id: 'negative', name: 'Negative' },
    { id: 'neutral', name: 'Neutral' }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financial News</h1>
            <p className="text-gray-400">Stay updated with the latest market news and insights</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-secondary flex items-center gap-2">
              <FaBell />
              Notifications
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
                placeholder="Search news..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-full"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Impact Filter */}
          <div>
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="input-field w-full"
            >
              {impacts.map(impact => (
                <option key={impact.id} value={impact.id}>
                  {impact.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid gap-6">
          {filteredNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 mb-3 line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        item.impact === 'positive' ? 'bg-green-900/50 text-green-400' :
                        item.impact === 'negative' ? 'bg-red-900/50 text-red-400' :
                        'bg-gray-700/50 text-gray-400'
                      }`}>
                        {getImpactIcon(item.impact)}
                        {item.impact}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-400 mb-4 line-clamp-4">
                    {item.content}
                  </p>

                  {/* Related Stocks */}
                  {item.relatedStocks.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 mr-2">Related Stocks:</span>
                      {item.relatedStocks.map(stock => (
                        <a
                          key={stock}
                          href={`/stock/${stock}`}
                          className="inline-block bg-blue-900/20 text-blue-400 px-2 py-1 rounded text-sm mr-2 hover:bg-blue-800/30 transition-colors"
                        >
                          {stock}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{item.source}</span>
                      <span className="flex items-center gap-1">
                        <FaClock size={12} />
                        {item.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-2 rounded transition-colors ${
                          bookmarkedNews.has(item.id)
                            ? 'text-yellow-400 hover:text-yellow-300'
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                        title={bookmarkedNews.has(item.id) ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        <FaBookmark size={14} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Share"
                      >
                        <FaShare size={14} />
                      </button>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-sm flex items-center gap-2"
                          title="Read full article"
                        >
                          <FaExternalLinkAlt size={12} />
                          Read More
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-white mb-4">No news found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
} 