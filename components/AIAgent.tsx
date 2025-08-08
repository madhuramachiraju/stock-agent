'use client';

import { useState, useEffect } from 'react';
import { FaRobot, FaBrain, FaChartLine, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

interface AIAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  recommendation: string;
  reasoning: string[];
  riskFactors: string[];
  priceTarget: {
    shortTerm: number;
    longTerm: number;
  };
  actionItems: string[];
}

interface AIAgentProps {
  symbol: string;
  currentPrice: number;
  isLoggedIn: boolean;
}

export default function AIAgent({ symbol, currentPrice, isLoggedIn }: AIAgentProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(!isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && symbol) {
      generateAIAnalysis();
    }
  }, [symbol, isLoggedIn]);

  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: AIAnalysis = {
        sentiment: 'bullish',
        confidence: 78,
        recommendation: 'BUY',
        reasoning: [
          'Strong quarterly earnings exceeded analyst expectations',
          'Market share growth in key product segments',
          'Positive technical indicators showing upward momentum',
          'Institutional buying activity increased by 15%'
        ],
        riskFactors: [
          'Market volatility due to economic uncertainty',
          'Competition in emerging markets',
          'Regulatory changes in key markets'
        ],
        priceTarget: {
          shortTerm: currentPrice * 1.08,
          longTerm: currentPrice * 1.25
        },
        actionItems: [
          'Consider dollar-cost averaging for large positions',
          'Set stop-loss at $' + (currentPrice * 0.95).toFixed(2),
          'Monitor earnings announcements',
          'Review portfolio allocation'
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-success-600 bg-success-50';
      case 'bearish': return 'text-danger-600 bg-danger-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FaRobot className="text-2xl text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI Stock Analysis</h2>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FaLightbulb className="text-purple-600" />
            <h3 className="font-semibold text-gray-900">Unlock AI Insights</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get personalized AI-powered stock analysis, recommendations, and risk assessments. 
            Our AI agent analyzes market data, news sentiment, and technical indicators.
          </p>
          <button 
            onClick={() => setShowLoginPrompt(true)}
            className="btn-primary"
          >
            Login to Access AI Analysis
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FaRobot className="text-2xl text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI Stock Analysis</h2>
        </div>
        
        <div className="text-center py-8">
          <FaBrain className="text-4xl text-purple-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Agent Analyzing...</h3>
          <p className="text-gray-600">Processing market data and generating insights for {symbol}</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <FaRobot className="text-2xl text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">AI Stock Analysis</h2>
      </div>

      {/* Sentiment & Recommendation */}
      <div className="mb-6">
        <div className={`flex items-center gap-3 p-4 rounded-lg ${getSentimentColor(analysis.sentiment)}`}>
          <span className="text-2xl">{getSentimentIcon(analysis.sentiment)}</span>
          <div>
            <h3 className="font-bold text-lg">{analysis.recommendation}</h3>
            <p className="text-sm opacity-80">Confidence: {analysis.confidence}%</p>
          </div>
        </div>
      </div>

      {/* Price Targets */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-1">Short Term (1-3 months)</h4>
          <p className="text-2xl font-bold text-blue-600">${analysis.priceTarget.shortTerm.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-1">Long Term (6-12 months)</h4>
          <p className="text-2xl font-bold text-green-600">${analysis.priceTarget.longTerm.toFixed(2)}</p>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FaChartLine className="text-blue-600" />
          Analysis Reasoning
        </h3>
        <ul className="space-y-2">
          {analysis.reasoning.map((reason, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-gray-700">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Factors */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FaExclamationTriangle className="text-warning-600" />
          Risk Factors
        </h3>
        <ul className="space-y-2">
          {analysis.riskFactors.map((risk, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-warning-500 mt-1">⚠</span>
              <span className="text-gray-700">{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Items */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FaLightbulb className="text-purple-600" />
          Recommended Actions
        </h3>
        <ul className="space-y-2">
          {analysis.actionItems.map((action, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-purple-500 mt-1">•</span>
              <span className="text-gray-700">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-700 text-center">
          AI analysis is for informational purposes only. Always do your own research before making investment decisions.
        </p>
      </div>
    </div>
  );
} 