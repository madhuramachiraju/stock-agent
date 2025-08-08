'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSearch, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

interface StockSearchProps {
  onClose: () => void;
  onAddToPortfolio?: (stock: any) => void;
}

interface SearchResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isWatched?: boolean;
}

export default function StockSearch({ onClose, onAddToPortfolio }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [watchedStocks, setWatchedStocks] = useState<Set<string>>(new Set());

  // Mock search results - replace with actual API call
  const mockSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) return [];
    
    const mockResults: SearchResult[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.50,
        change: 2.25,
        changePercent: 1.30
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 320.75,
        change: -1.25,
        changePercent: -0.39
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 135.25,
        change: 0.75,
        changePercent: 0.56
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 145.80,
        change: 3.20,
        changePercent: 2.24
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 245.60,
        change: -5.40,
        changePercent: -2.15
      }
    ];

    return mockResults.filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const searchStocks = async () => {
      if (query.trim()) {
        setLoading(true);
        const searchResults = await mockSearch(query);
        setResults(searchResults);
        setLoading(false);
      } else {
        setResults([]);
      }
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleAddToPortfolio = (stock: SearchResult) => {
    // Convert SearchResult to portfolio format
    const portfolioStock = {
      symbol: stock.symbol,
      name: stock.name,
      shares: 1, // Default to 1 share
      avgPrice: stock.price,
      currentPrice: stock.price,
      change: stock.change,
      changePercent: stock.changePercent
    };
    
    if (onAddToPortfolio) {
      onAddToPortfolio(portfolioStock);
      // Show success message
      alert(`${stock.symbol} has been added to your portfolio!`);
    }
    onClose();
  };

  const handleToggleWatch = (symbol: string) => {
    const newWatchedStocks = new Set(watchedStocks);
    if (newWatchedStocks.has(symbol)) {
      newWatchedStocks.delete(symbol);
    } else {
      newWatchedStocks.add(symbol);
    }
    setWatchedStocks(newWatchedStocks);
  };

  const handleViewStock = (symbol: string) => {
    window.open(`/stock/${symbol}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-hidden my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Search Stocks</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-6 border-b border-gray-700">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by symbol or company name..."
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-400">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {results.map((stock) => (
                  <div key={stock.symbol} className="p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white">{stock.symbol}</h3>
                          <span className="text-sm text-gray-400">{stock.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-gray-300">${stock.price.toFixed(2)}</span>
                          <span className={`flex items-center gap-1 ${
                            stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                            ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      
                                             <div className="flex items-center gap-2">
                         <button
                           onClick={() => handleViewStock(stock.symbol)}
                           className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                           title="View Details"
                         >
                           <FaExternalLinkAlt />
                         </button>
                         <button
                           onClick={() => handleToggleWatch(stock.symbol)}
                           className={`p-2 rounded-lg transition-colors ${
                             watchedStocks.has(stock.symbol)
                               ? 'bg-red-900/50 text-red-400 hover:bg-red-800/50'
                               : 'bg-green-900/50 text-green-400 hover:bg-green-800/50'
                           }`}
                           title={watchedStocks.has(stock.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                         >
                           {watchedStocks.has(stock.symbol) ? <FaTimes /> : <FaPlus />}
                         </button>
                         <button
                           onClick={() => handleAddToPortfolio(stock)}
                           className="btn-primary text-sm flex items-center gap-1"
                         >
                           <FaPlus />
                           Portfolio
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="p-6 text-center text-gray-400">
                No stocks found matching "{query}"
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                Start typing to search for stocks
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 