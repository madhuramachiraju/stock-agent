'use client';

import { FaArrowUp, FaArrowDown, FaExternalLinkAlt } from 'react-icons/fa';

interface Stock {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

interface PortfolioCardProps {
  stock: Stock;
}

export default function PortfolioCard({ stock }: PortfolioCardProps) {
  const totalValue = stock.shares * stock.currentPrice;
  const totalCost = stock.shares * stock.avgPrice;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = ((gainLoss / totalCost) * 100);
  const isPositive = gainLoss >= 0;

  return (
    <div className="stock-card hover:bg-gray-800/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{stock.symbol}</h3>
          <p className="text-sm text-gray-400">{stock.shares} shares</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-white">${totalValue.toFixed(2)}</p>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'positive-change' : 'negative-change'}`}>
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            <span>{gainLossPercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Avg Price</p>
          <p className="font-medium text-white">${stock.avgPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Current Price</p>
          <p className="font-medium text-white">${stock.currentPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {isPositive ? 'Gain' : 'Loss'}: ${Math.abs(gainLoss).toFixed(2)}
          </span>
          <a
            href={`/stock/${stock.symbol}`}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
          >
            View Details
            <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
} 