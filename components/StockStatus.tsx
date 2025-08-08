'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaCircle, FaClock, FaExternalLinkAlt } from 'react-icons/fa';

interface StockStatusProps {
  symbol: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: string;
  marketCap?: string;
}

export default function StockStatus({ 
  symbol, 
  price, 
  change, 
  changePercent, 
  volume, 
  marketCap 
}: StockStatusProps) {
  const [isPositive, setIsPositive] = useState((change ?? 0) >= 0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    setIsPositive((change ?? 0) >= 0);
    setLastUpdate(new Date());
  }, [change]);

  const getStatusColor = () => {
    if (isPositive) return 'text-success-600';
    return 'text-danger-600';
  };

  const getStatusText = () => {
    if (isPositive) return 'Gaining';
    return 'Declining';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{symbol}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FaCircle className={`text-xs ${getStatusColor()}`} />
            <span>{getStatusText()}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FaClock className="text-xs" />
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">
            ${price !== undefined && price !== null ? price.toFixed(2) : '0.00'}
          </div>
          <div className={`flex items-center gap-1 text-lg ${getStatusColor()}`}>
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            <span>{isPositive ? '+' : ''}{change !== undefined && change !== null ? change.toFixed(2) : '0.00'}</span>
            <span>({isPositive ? '+' : ''}{changePercent !== undefined && changePercent !== null ? changePercent.toFixed(2) : '0.00'}%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400">Volume</div>
          <div className="font-semibold text-white">{volume || 'N/A'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400">Market Cap</div>
          <div className="font-semibold text-white">{marketCap || 'N/A'}</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 rounded-xl border border-blue-700/50">
        <div className="flex items-center gap-2 text-blue-300">
          <FaCircle className="text-xs animate-pulse" />
          <span className="text-sm font-medium">Live Market Data</span>
        </div>
      </div>

      {/* Review & Action Button */}
      <div className="mt-4">
        <a
          href={`/stock/${symbol}`}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <FaExternalLinkAlt className="text-sm" />
          Review & Action
        </a>
      </div>
    </div>
  );
} 