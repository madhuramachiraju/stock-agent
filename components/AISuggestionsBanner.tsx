'use client';

import { FaRobot, FaLock } from 'react-icons/fa';
import { useAuth } from './providers/AuthProvider';

export default function AISuggestionsBanner() {
  const { user } = useAuth();

  if (user) return null; // Don't show if user is logged in

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-900/50 rounded-full p-3">
            <FaRobot className="text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI-Powered Stock Insights</h3>
            <p className="text-sm text-gray-300">
              Get personalized AI recommendations and analysis for your investments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaLock className="text-gray-400 text-sm" />
          <span className="text-xs text-gray-400">Login Required</span>
        </div>
      </div>
    </div>
  );
} 