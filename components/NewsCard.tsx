'use client';

import { FaExternalLinkAlt, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

interface News {
  id: number;
  title: string;
  summary: string;
  source: string;
  time: string;
  impact: 'positive' | 'negative' | 'neutral';
  url?: string; // Add URL for external links
}

interface NewsCardProps {
  news: News;
  onReadMore?: (news: News) => void; // Add callback for read more action
}

export default function NewsCard({ news, onReadMore }: NewsCardProps) {
  const getImpactIcon = () => {
    switch (news.impact) {
      case 'positive':
        return <FaArrowUp className="text-success-600" />;
      case 'negative':
        return <FaArrowDown className="text-danger-600" />;
      default:
        return <FaMinus className="text-gray-500" />;
    }
  };

  const getImpactColor = () => {
    switch (news.impact) {
      case 'positive':
        return 'border-l-green-500 bg-green-900/20';
      case 'negative':
        return 'border-l-red-500 bg-red-900/20';
      default:
        return 'border-l-gray-500 bg-gray-800/50';
    }
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onReadMore) {
      // Use custom handler if provided
      onReadMore(news);
    } else if (news.url) {
      // Open external URL if available
      window.open(news.url, '_blank', 'noopener,noreferrer');
    } else {
      // Default behavior: navigate to news detail page
      window.location.href = `/news/${news.id}`;
    }
  };

  return (
    <div className={`stock-card border-l-4 ${getImpactColor()} hover:bg-gray-800/50 transition-all duration-200 cursor-pointer`} onClick={handleReadMore}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getImpactIcon()}
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {news.source}
          </span>
        </div>
        <span className="text-xs text-gray-500">{news.time}</span>
      </div>

      <h3 className="font-semibold text-white mb-2 line-clamp-2">
        {news.title}
      </h3>

      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
        {news.summary}
      </p>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          news.impact === 'positive' ? 'bg-green-900/50 text-green-300' :
          news.impact === 'negative' ? 'bg-red-900/50 text-red-300' :
          'bg-gray-800 text-gray-300'
        }`}>
          {news.impact.charAt(0).toUpperCase() + news.impact.slice(1)} Impact
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            handleReadMore(e);
          }}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
        >
          Read More
          <FaExternalLinkAlt className="text-xs" />
        </button>
      </div>
    </div>
  );
} 