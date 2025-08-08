'use client';

import { FaChartLine, FaRocket } from 'react-icons/fa';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-2 text-white shadow-lg">
          <FaChartLine className="text-white" />
        </div>
        <div className="absolute -top-1 -right-1 bg-success-500 rounded-full p-1">
          <FaRocket className="text-xs text-white" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ${sizeClasses[size]}`}>
            Stock Agent
          </h1>
          <span className="text-xs text-gray-400 -mt-1">Smart Portfolio Manager</span>
        </div>
      )}
    </div>
  );
} 