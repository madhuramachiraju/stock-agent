'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  portfolio: any[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  loading: boolean;
  // Portfolio management functions
  addToPortfolio: (stock: any) => void;
  removeFromPortfolio: (symbol: string) => void;
  getPortfolio: () => any[];
  savePortfolio: (portfolio: any[]) => void;
  // User data management helpers
  getUserKey: (key: string) => string | null;
  saveUserData: (key: string, data: any) => void;
  loadUserData: (key: string, defaultValue?: any) => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage when user changes
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      // Convert NextAuth session to our User format
      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        avatar: session.user.image || undefined,
        portfolio: []
      };
      
      // Load user-specific portfolio from localStorage
      const userPortfolioKey = `portfolio_${session.user.id}`;
      const savedPortfolio = localStorage.getItem(userPortfolioKey);
      if (savedPortfolio) {
        try {
          userData.portfolio = JSON.parse(savedPortfolio);
          console.log(`Loaded portfolio for user ${session.user.id}:`, userData.portfolio.length, 'stocks');
        } catch (error) {
          console.error('Error loading portfolio:', error);
          userData.portfolio = [];
        }
      } else {
        console.log(`No saved portfolio found for user ${session.user.id}`);
      }
      
      setUser(userData);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, [session, status]);

  // Portfolio management functions
  const savePortfolio = (portfolio: any[]) => {
    if (user) {
      const userPortfolioKey = `portfolio_${user.id}`;
      localStorage.setItem(userPortfolioKey, JSON.stringify(portfolio));
      setUser(prev => prev ? { ...prev, portfolio } : null);
      console.log(`Saved portfolio for user ${user.id}:`, portfolio.length, 'stocks');
    }
  };

  const addToPortfolio = (stock: any) => {
    if (!user) return;
    
    const existingStock = user.portfolio.find(s => s.symbol === stock.symbol);
    let updatedPortfolio;
    
    if (existingStock) {
      // Update existing stock
      updatedPortfolio = user.portfolio.map(s => 
        s.symbol === stock.symbol 
          ? { ...s, shares: s.shares + stock.shares, avgPrice: ((s.avgPrice * s.shares) + (stock.avgPrice * stock.shares)) / (s.shares + stock.shares) }
          : s
      );
    } else {
      // Add new stock
      updatedPortfolio = [...user.portfolio, stock];
    }
    
    savePortfolio(updatedPortfolio);
  };

  const removeFromPortfolio = (symbol: string) => {
    if (!user) return;
    
    const updatedPortfolio = user.portfolio.filter(stock => stock.symbol !== symbol);
    savePortfolio(updatedPortfolio);
  };

  const getPortfolio = () => {
    return user?.portfolio || [];
  };

  // Helper function to get user-specific localStorage keys
  const getUserKey = (key: string) => {
    return user ? `${key}_${user.id}` : null;
  };

  // Helper function to save user-specific data
  const saveUserData = (key: string, data: any) => {
    const userKey = getUserKey(key);
    if (userKey) {
      try {
        localStorage.setItem(userKey, JSON.stringify(data));
      } catch (error) {
        console.error(`Error saving ${key}:`, error);
      }
    }
  };

  // Helper function to load user-specific data
  const loadUserData = (key: string, defaultValue: any = null) => {
    const userKey = getUserKey(key);
    if (userKey) {
      try {
        const saved = localStorage.getItem(userKey);
        return saved ? JSON.parse(saved) : defaultValue;
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user: userData, token } = await response.json();
        localStorage.setItem('token', token);
        setUser(userData);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const { user: userData, token } = await response.json();
        localStorage.setItem('token', token);
        setUser(userData);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      await signIn('apple', { callbackUrl: '/' });
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear user state immediately
      setUser(null);
      
      // Clear all localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Clear all user-specific data
      if (user?.id) {
        localStorage.removeItem(`portfolio_${user.id}`);
        localStorage.removeItem(`watchlist_${user.id}`);
        localStorage.removeItem(`settings_${user.id}`);
        localStorage.removeItem(`notification_preferences_${user.id}`);
        localStorage.removeItem(`bookmarks_${user.id}`);
      }
      
      // Sign out from NextAuth
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the local state
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      signInWithGoogle, 
      signInWithApple, 
      loading,
      addToPortfolio,
      removeFromPortfolio,
      getPortfolio,
      savePortfolio,
      getUserKey,
      saveUserData,
      loadUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 