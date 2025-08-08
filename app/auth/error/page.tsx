'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaGoogle, FaApple, FaCog } from 'react-icons/fa';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'OAuthSignin':
        return 'OAuth credentials not configured';
      case 'OAuthCallback':
        return 'OAuth callback error';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account';
      case 'EmailCreateAccount':
        return 'Could not create email account';
      case 'Callback':
        return 'Callback error';
      case 'OAuthAccountNotLinked':
        return 'Email already exists with different provider';
      case 'EmailSignin':
        return 'Email sign-in error';
      case 'CredentialsSignin':
        return 'Invalid credentials';
      case 'SessionRequired':
        return 'Session required';
      default:
        return 'Authentication error occurred';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-800"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 rounded-full p-3">
              <FaExclamationTriangle className="text-red-400 text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-gray-300 mb-6">{getErrorMessage()}</p>

          {error === 'OAuthSignin' && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaCog className="text-blue-400" />
                Setup Required
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                To enable Google and Apple sign-in, you need to configure OAuth credentials.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FaGoogle className="text-red-400" />
                  <span className="text-gray-300">Google OAuth not configured</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaApple className="text-gray-400" />
                  <span className="text-gray-300">Apple Sign-In not configured</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Return to Home
            </Link>
            
            {error === 'OAuthSignin' && (
              <a 
                href="/OAUTH_SETUP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                View Setup Guide
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 