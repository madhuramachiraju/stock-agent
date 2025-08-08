'use client';

import { useState } from 'react';
import { FaSave, FaCheck, FaTimes, FaStar } from 'react-icons/fa';

interface PortfolioSaveOptionProps {
  symbol: string;
  name: string;
  currentPrice: number;
  onSave: (shares: number, avgPrice: number) => void;
  onCancel: () => void;
}

export default function PortfolioSaveOption({ 
  symbol, 
  name, 
  currentPrice, 
  onSave, 
  onCancel 
}: PortfolioSaveOptionProps) {
  const [shares, setShares] = useState(1);
  const [avgPrice, setAvgPrice] = useState(currentPrice);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(shares, avgPrice);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const totalValue = shares * avgPrice;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <FaSave className="text-2xl text-blue-400" />
        <h2 className="text-xl font-bold text-white">Save to Portfolio</h2>
      </div>

      {isSaved ? (
        <div className="text-center py-8">
          <FaCheck className="text-4xl text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-400 mb-2">Saved Successfully!</h3>
          <p className="text-gray-300">{symbol} has been added to your portfolio</p>
        </div>
      ) : (
        <>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">{symbol}</h3>
              <span className="text-sm text-gray-400">{name}</span>
            </div>
            <div className="text-2xl font-bold text-white">${currentPrice.toFixed(2)}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Shares
              </label>
              <input
                type="number"
                min="1"
                value={shares}
                onChange={(e) => setShares(parseInt(e.target.value) || 1)}
                className="input-field"
                placeholder="Enter number of shares"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Average Price per Share
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={avgPrice}
                onChange={(e) => setAvgPrice(parseFloat(e.target.value) || 0)}
                className="input-field"
                placeholder="Enter average price"
              />
            </div>

            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-700/50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Total Investment:</span>
                <span className="font-semibold text-blue-400">${totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <FaSave />
              Save to Portfolio
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
            <div className="flex items-center gap-2 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <span className="text-sm font-medium">Portfolio Tip</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Consider dollar-cost averaging for large positions and always set stop-loss orders to manage risk.
            </p>
          </div>
        </>
      )}
    </div>
  );
} 