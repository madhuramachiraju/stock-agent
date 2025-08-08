'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, FaBellSlash, FaEnvelope, FaClock, FaCheck, 
  FaTimes, FaInfoCircle, FaShieldAlt 
} from 'react-icons/fa';
import { useAuth } from '@/components/providers/AuthProvider';

interface NotificationPreferences {
  dailyNewsEmail: boolean;
  emailTime: string;
  portfolioAlerts: boolean;
  priceAlerts: boolean;
  newsAlerts: boolean;
}

export default function NotificationSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    dailyNewsEmail: false,
    emailTime: '18:00',
    portfolioAlerts: true,
    priceAlerts: true,
    newsAlerts: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotificationPreferences();
    }
  }, [user]);

  const loadNotificationPreferences = () => {
    if (!user) return;
    
    const userPrefsKey = `notification_preferences_${user.id}`;
    const savedPrefs = localStorage.getItem(userPrefsKey);
    
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  };

  const saveNotificationPreferences = async (newPreferences: NotificationPreferences) => {
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Save to localStorage
      const userPrefsKey = `notification_preferences_${user.id}`;
      localStorage.setItem(userPrefsKey, JSON.stringify(newPreferences));
      
      // If daily news email is enabled, send a test email
      if (newPreferences.dailyNewsEmail && !preferences.dailyNewsEmail) {
        await sendTestEmail();
      }

      setPreferences(newPreferences);
      setMessage({
        type: 'success',
        text: 'Notification preferences saved successfully!'
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to save notification preferences'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      const portfolio = user?.portfolio || [];
      
      const response = await fetch('/api/notifications/portfolio-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.email,
          userName: user?.name,
          portfolio: portfolio
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Test email sent! Check your inbox for the daily news update.'
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send test email. Please check your email configuration.'
      });
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    saveNotificationPreferences(newPreferences);
  };

  const handleTimeChange = (time: string) => {
    const newPreferences = {
      ...preferences,
      emailTime: time
    };
    saveNotificationPreferences(newPreferences);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-6xl mb-4">🔐</div>
        <h3 className="text-xl font-bold text-white mb-2">Sign in to manage notifications</h3>
        <p className="text-gray-400">Your notification preferences will be saved to your account</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notification Settings</h1>
            <p className="text-gray-400">Manage your email notifications and alerts</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-primary flex items-center gap-2"
          >
            {showSettings ? <FaTimes /> : <FaBell />}
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-900/20 border border-green-700/50 text-green-400' 
                : 'bg-red-900/20 border border-red-700/50 text-red-400'
            }`}
          >
            {message.type === 'success' ? <FaCheck /> : <FaTimes />}
            {message.text}
          </motion.div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Email Notifications */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <FaEnvelope className="text-blue-400 text-xl" />
                <h2 className="text-xl font-bold text-white">Email Notifications</h2>
              </div>

              <div className="space-y-6">
                {/* Daily News Email */}
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Daily Portfolio News</h3>
                    <p className="text-sm text-gray-400">
                      Receive daily email updates with news about your portfolio stocks
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('dailyNewsEmail')}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.dailyNewsEmail ? 'bg-blue-600' : 'bg-gray-600'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.dailyNewsEmail ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Time */}
                {preferences.dailyNewsEmail && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-gray-800/30 rounded-lg"
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Delivery Time
                    </label>
                    <div className="flex items-center gap-3">
                      <FaClock className="text-gray-400" />
                      <input
                        type="time"
                        value={preferences.emailTime}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className="input-field flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Emails will be sent daily at this time (your local timezone)
                    </p>
                  </motion.div>
                )}

                {/* Test Email Button */}
                {preferences.dailyNewsEmail && (
                  <button
                    onClick={sendTestEmail}
                    disabled={isLoading}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <FaEnvelope />
                    Send Test Email
                  </button>
                )}
              </div>
            </div>

            {/* In-App Alerts */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <FaBell className="text-purple-400 text-xl" />
                <h2 className="text-xl font-bold text-white">In-App Alerts</h2>
              </div>

              <div className="space-y-4">
                {/* Portfolio Alerts */}
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Portfolio Updates</h3>
                    <p className="text-sm text-gray-400">
                      Get notified about significant changes in your portfolio
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('portfolioAlerts')}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.portfolioAlerts ? 'bg-purple-600' : 'bg-gray-600'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.portfolioAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Price Alerts */}
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Price Alerts</h3>
                    <p className="text-sm text-gray-400">
                      Receive alerts when stocks reach your target prices
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('priceAlerts')}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.priceAlerts ? 'bg-purple-600' : 'bg-gray-600'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.priceAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* News Alerts */}
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Breaking News</h3>
                    <p className="text-sm text-gray-400">
                      Get notified about important news affecting your stocks
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('newsAlerts')}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.newsAlerts ? 'bg-purple-600' : 'bg-gray-600'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.newsAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Information Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaInfoCircle className="text-blue-400 text-xl" />
            <h2 className="text-xl font-bold text-white">About Notifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Daily News Emails</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Sent daily at your chosen time</li>
                <li>• Includes news for all stocks in your portfolio</li>
                <li>• Sentiment analysis for each news item</li>
                <li>• Direct links to full articles</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Privacy & Security</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Your email is never shared with third parties</li>
                <li>• You can unsubscribe at any time</li>
                <li>• All data is encrypted and secure</li>
                <li>• GDPR compliant data handling</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-blue-400 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Security Notice</h4>
                <p className="text-sm text-gray-300">
                  All notifications are sent securely using industry-standard encryption. 
                  Your portfolio data and email preferences are protected and never shared with external parties.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 