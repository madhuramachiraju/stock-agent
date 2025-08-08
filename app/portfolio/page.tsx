'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaPlus, FaTrash, FaEdit, FaEye, 
  FaArrowUp, FaArrowDown, FaDollarSign,
  FaPercentage, FaCalculator, FaHistory
} from 'react-icons/fa';
import Header from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import StockSearch from '@/components/StockSearch';

interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  bestPerformer: any;
  worstPerformer: any;
}

export default function PortfolioPage() {
  const { user, getPortfolio, addToPortfolio, removeFromPortfolio } = useAuth();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const userPortfolio = getPortfolio();
      setPortfolio(userPortfolio);
      calculateStats(userPortfolio);
    }
  }, [user, getPortfolio]);

  const calculateStats = (stocks: any[]) => {
    if (stocks.length === 0) {
      setStats(null);
      return;
    }

    const totalValue = stocks.reduce((sum, stock) => sum + (stock.shares * stock.currentPrice), 0);
    const totalCost = stocks.reduce((sum, stock) => sum + (stock.shares * stock.avgPrice), 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    const bestPerformer = stocks.reduce((best, stock) => {
      const gain = stock.currentPrice - stock.avgPrice;
      const gainPercent = (gain / stock.avgPrice) * 100;
      if (!best || gainPercent > best.gainPercent) {
        return { ...stock, gain, gainPercent };
      }
      return best;
    }, null);

    const worstPerformer = stocks.reduce((worst, stock) => {
      const gain = stock.currentPrice - stock.avgPrice;
      const gainPercent = (gain / stock.avgPrice) * 100;
      if (!worst || gainPercent < worst.gainPercent) {
        return { ...stock, gain, gainPercent };
      }
      return worst;
    }, null);

    setStats({
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent,
      bestPerformer,
      worstPerformer
    });
  };

  const handleRemoveStock = (symbol: string) => {
    removeFromPortfolio(symbol);
    const updatedPortfolio = portfolio.filter(stock => stock.symbol !== symbol);
    setPortfolio(updatedPortfolio);
    calculateStats(updatedPortfolio);
  };

  const handleViewStock = (symbol: string) => {
    window.location.href = `/stock/${symbol}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-white mb-4">Sign in to view your portfolio</h1>
            <p className="text-gray-400 mb-8">Your portfolio will be saved to your account</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Your Portfolio</h1>
            <p className="text-gray-400">Manage and track your investments</p>
          </div>
          <button 
            onClick={() => setShowSearch(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus />
            Add Stock
          </button>
        </div>

        {portfolio.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-white mb-4">Your portfolio is empty</h2>
            <p className="text-gray-400 mb-8">Start building your portfolio by adding stocks</p>
            <button 
              onClick={() => setShowSearch(true)}
              className="btn-primary text-lg px-8 py-3"
            >
              Add Your First Stock
            </button>
          </div>
        ) : (
          <>
            {/* Portfolio Stats */}
            {stats && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                <div className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <FaDollarSign className="text-blue-400" />
                    <span className="text-gray-400">Total Value</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${stats.totalValue.toLocaleString()}
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalculator className="text-green-400" />
                    <span className="text-gray-400">Total Cost</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${stats.totalCost.toLocaleString()}
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <FaArrowUp className="text-green-400" />
                    <span className="text-gray-400">Total Gain/Loss</span>
                  </div>
                  <div className={`text-2xl font-bold ${stats.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.totalGain >= 0 ? '+' : ''}${stats.totalGain.toLocaleString()}
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <FaPercentage className="text-purple-400" />
                    <span className="text-gray-400">Gain %</span>
                  </div>
                  <div className={`text-2xl font-bold ${stats.totalGainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.totalGainPercent >= 0 ? '+' : ''}{stats.totalGainPercent.toFixed(2)}%
                  </div>
                </div>
              </motion.div>
            )}

            {/* Best/Worst Performers */}
            {stats && (stats.bestPerformer || stats.worstPerformer) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {stats.bestPerformer && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FaArrowUp className="text-green-400" />
                      Best Performer
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stock:</span>
                        <span className="font-semibold text-white">{stats.bestPerformer.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gain:</span>
                        <span className="text-green-400 font-semibold">
                          +${stats.bestPerformer.gain.toFixed(2)} ({stats.bestPerformer.gainPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {stats.worstPerformer && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FaArrowDown className="text-red-400" />
                      Worst Performer
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stock:</span>
                        <span className="font-semibold text-white">{stats.worstPerformer.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Loss:</span>
                        <span className="text-red-400 font-semibold">
                          {stats.worstPerformer.gain.toFixed(2)} ({stats.worstPerformer.gainPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Portfolio Holdings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-white mb-6">Your Holdings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Stock</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Shares</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Avg Price</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Current Price</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Value</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Gain/Loss</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((stock, index) => {
                      const totalValue = stock.shares * stock.currentPrice;
                      const totalCost = stock.shares * stock.avgPrice;
                      const gain = totalValue - totalCost;
                      const gainPercent = totalCost > 0 ? (gain / totalCost) * 100 : 0;

                      return (
                        <motion.tr 
                          key={stock.symbol}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-white">{stock.symbol}</div>
                              <div className="text-sm text-gray-400">{stock.name}</div>
                            </div>
                          </td>
                          <td className="text-right py-4 px-4 text-white">{stock.shares}</td>
                          <td className="text-right py-4 px-4 text-white">${stock.avgPrice.toFixed(2)}</td>
                          <td className="text-right py-4 px-4 text-white">${stock.currentPrice.toFixed(2)}</td>
                          <td className="text-right py-4 px-4 text-white">${totalValue.toFixed(2)}</td>
                          <td className={`text-right py-4 px-4 font-semibold ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercent.toFixed(2)}%)
                          </td>
                          <td className="text-right py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewStock(stock.symbol)}
                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                title="View Details"
                              >
                                <FaEye size={14} />
                              </button>
                              <button
                                onClick={() => handleRemoveStock(stock.symbol)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                title="Remove from Portfolio"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </main>

      {/* Stock Search Modal */}
      {showSearch && (
        <StockSearch 
          onClose={() => setShowSearch(false)} 
          onAddToPortfolio={addToPortfolio}
        />
      )}
    </div>
  );
} 