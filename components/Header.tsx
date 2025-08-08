'use client';

import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa';
import { useAuth } from './providers/AuthProvider';
import LoginModal from './LoginModal';
import Logo from './Logo';

export default function Header() {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
      // The redirect will be handled by NextAuth signOut
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      window.location.href = '/';
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    window.location.href = '/profile';
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    window.location.href = '/settings';
  };

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { id: 'watchlist', label: 'Watchlist', href: '/watchlist' },
    { id: 'news', label: 'News', href: '/news' },
    { id: 'notifications', label: 'Notifications', href: '/notifications' }
  ];

  return (
    <Fragment>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Logo size="md" />
            </motion.div>

            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNav(item.id)}
                  className={`nav-link px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeNav === item.id 
                      ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            {/* Enhanced User Actions */}
            <div className="flex items-center space-x-3">

              {/* Enhanced User Menu */}
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-gray-600/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white ring-2 ring-blue-500/30">
                        <FaUser />
                      </div>
                    )}
                    <span className="hidden md:block text-gray-300 font-medium">{user.name}</span>
                    <motion.div
                      animate={{ rotate: showUserMenu ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown className="text-gray-400" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-700/30">
                          <p className="text-sm text-gray-400">Signed in as</p>
                          <p className="text-white font-medium truncate">{user.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <motion.button
                            onClick={handleProfileClick}
                            className="flex items-center w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                            whileHover={{ x: 5 }}
                          >
                            <FaUser className="mr-3 text-blue-400" />
                            Profile
                          </motion.button>
                          <motion.button
                            onClick={handleSettingsClick}
                            className="flex items-center w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                            whileHover={{ x: 5 }}
                          >
                            <FaCog className="mr-3 text-purple-400" />
                            Settings
                          </motion.button>
                        </div>
                        
                        <div className="border-t border-gray-700/30 pt-2">
                          <motion.button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                            whileHover={{ x: 5 }}
                          >
                            <FaSignOutAlt className="mr-3 text-red-400" />
                            Logout
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowLoginModal(true)}
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser />
                  Sign In
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>
    </Fragment>
  );
} 