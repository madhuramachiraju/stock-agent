'use client';

import { useState } from 'react';
import { FaApple, FaSync, FaCheck, FaTimes } from 'react-icons/fa';

interface AppleStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export default function AppleStocksSync() {
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedStocks, setSyncedStocks] = useState<AppleStock[]>([]);
  const [userWantsSync, setUserWantsSync] = useState(false);

  const handleSyncRequest = () => {
    setShowSyncModal(true);
  };

  const handleSyncConfirm = async () => {
    setIsSyncing(true);
    
    // Simulate API call to Apple Stocks
    setTimeout(() => {
      const mockAppleStocks: AppleStock[] = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.25 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 320.75, change: -1.25 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 135.25, change: 0.75 },
      ];
      
      setSyncedStocks(mockAppleStocks);
      setIsSyncing(false);
      setUserWantsSync(true);
      setShowSyncModal(false);
    }, 2000);
  };

  const handleSyncCancel = () => {
    setShowSyncModal(false);
    setUserWantsSync(false);
  };

  return (
    <>
      {/* Sync Button */}
      <button
        onClick={handleSyncRequest}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <FaApple />
        <span>Sync Apple Stocks</span>
      </button>

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full p-6 my-8">
            <div className="flex items-center gap-3 mb-4">
              <FaApple className="text-2xl" />
              <h2 className="text-xl font-bold text-white">Sync with Apple Stocks</h2>
            </div>
            
            <p className="text-gray-300 mb-6">
              Would you like to sync your Apple Stocks app data with Stock Agent? 
              This will import your selected stocks and their current data.
            </p>

            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <h3 className="font-medium text-white mb-2">What will be synced:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Your selected stocks from Apple Stocks app</li>
                  <li>• Current prices and market data</li>
                  <li>• Stock symbols and company names</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSyncCancel}
                className="flex-1 btn-secondary"
                disabled={isSyncing}
              >
                Cancel
              </button>
              <button
                onClick={handleSyncConfirm}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <FaSync className="animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <FaSync />
                    Sync Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Synced Stocks Display */}
      {userWantsSync && syncedStocks.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaCheck className="text-green-600" />
            <h3 className="font-medium text-green-800">Successfully synced with Apple Stocks!</h3>
          </div>
          <div className="space-y-2">
            {syncedStocks.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between text-sm">
                <span className="font-medium">{stock.symbol} - {stock.name}</span>
                <span className={`${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stock.price.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
} 