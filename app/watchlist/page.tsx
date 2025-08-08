'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEye, FaPlus, FaTrash, FaStar, FaBell,
  FaArrowUp, FaArrowDown, FaDollarSign
} from 'react-icons/fa';
import Header from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import StockSearch from '@/components/StockSearch';

interface WatchlistItem {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  targetPrice?: number;
  notes?: string;
}

export default function WatchlistPage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  useEffect(() => {
    if (user) {
      // Load watchlist from localStorage
      const userWatchlistKey = `watchlist_${user.id}`;
      const savedWatchlist = localStorage.getItem(userWatchlistKey);
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    }
  }, [user]);

  const saveWatchlist = (newWatchlist: WatchlistItem[]) => {
    if (user) {
      const userWatchlistKey = `watchlist_${user.id}`;
      localStorage.setItem(userWatchlistKey, JSON.stringify(newWatchlist));
      setWatchlist(newWatchlist);
    }
  };

  const addToWatchlist = (stock: any) => {
    const watchlistItem: WatchlistItem = {
      symbol: stock.symbol,
      name: stock.name,
      currentPrice: stock.price,
      change: stock.change,
      changePercent: stock.changePercent
    };

    const existingIndex = watchlist.findIndex(item => item.symbol === stock.symbol);
    if (existingIndex >= 0) {
      // Update existing item
      const updatedWatchlist = watchlist.map((item, index) => 
        index === existingIndex ? { ...item, ...watchlistItem } : item
      );
      saveWatchlist(updatedWatchlist);
    } else {
      // Add new item
      saveWatchlist([...watchlist, watchlistItem]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    const updatedWatchlist = watchlist.filter(item => item.symbol !== symbol);
    saveWatchlist(updatedWatchlist);
  };

  const updateTargetPrice = (symbol: string, targetPrice: number) => {
    const updatedWatchlist = watchlist.map(item => 
      item.symbol === symbol ? { ...item, targetPrice } : item
    );
    saveWatchlist(updatedWatchlist);
  };

  const updateNotes = (symbol: string, notes: string) => {
    const updatedWatchlist = watchlist.map(item => 
      item.symbol === symbol ? { ...item, notes } : item
    );
    saveWatchlist(updatedWatchlist);
  };

  const handleViewStock = (symbol: string) => {
    window.location.href = `/stock/${symbol}`;
  };

  const filteredWatchlist = watchlist.filter(item => {
    if (filter === 'gainers') return item.changePercent > 0;
    if (filter === 'losers') return item.changePercent < 0;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-white mb-4">Sign in to manage your watchlist</h1>
            <p className="text-gray-400 mb-8">Your watchlist will be saved to your account</p>
            <button className="btn-primary text-lg px-8 py-3">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Watchlist</h1>
            <p className="text-gray-400">Track stocks you're interested in</p>
          </div>
          <button 
            onClick={() => setShowSearch(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus />
            Add Stock
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              filter === 'all' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            All ({watchlist.length})
          </button>
          <button
            onClick={() => setFilter('gainers')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              filter === 'gainers' 
                ? 'border-green-500 text-green-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Gainers ({watchlist.filter(item => item.changePercent > 0).length})
          </button>
          <button
            onClick={() => setFilter('losers')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              filter === 'losers' 
                ? 'border-red-500 text-red-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Losers ({watchlist.filter(item => item.changePercent < 0).length})
          </button>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">👀</div>
            <h2 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8">Start tracking stocks you're interested in</p>
            <button 
              onClick={() => setShowSearch(true)}
              className="btn-primary text-lg px-8 py-3"
            >
              Add Your First Stock
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredWatchlist.map((item, index) => (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
                        <p className="text-gray-400">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">${item.currentPrice.toFixed(2)}</div>
                        <div className={`flex items-center gap-1 ${
                          item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {item.changePercent >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} 
                          ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    {/* Target Price and Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Target Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.targetPrice || ''}
                          onChange={(e) => updateTargetPrice(item.symbol, parseFloat(e.target.value) || 0)}
                          className="input-field"
                          placeholder="Set target price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => updateNotes(item.symbol, e.target.value)}
                          className="input-field"
                          placeholder="Add notes..."
                        />
                      </div>
                    </div>

                    {/* Target Price Progress */}
                    {item.targetPrice && item.targetPrice > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Progress to target</span>
                          <span>{((item.currentPrice / item.targetPrice) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.currentPrice >= item.targetPrice ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ 
                              width: `${Math.min((item.currentPrice / item.targetPrice) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleViewStock(item.symbol)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      title="View Details"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(item.symbol)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Remove from Watchlist"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Stock Search Modal */}
      {showSearch && (
        <StockSearch 
          onClose={() => setShowSearch(false)} 
          onAddToPortfolio={(stock) => {
            addToWatchlist(stock);
            setShowSearch(false);
          }}
        />
      )}
    </div>
  );
} 