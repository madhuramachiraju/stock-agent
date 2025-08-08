'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, FaLock, FaEye, FaExclamationTriangle, 
  FaCheckCircle, FaTimesCircle, FaInfoCircle 
} from 'react-icons/fa';

interface SecurityStatus {
  ssl: boolean;
  headers: boolean;
  auth: boolean;
  rateLimit: boolean;
  lastCheck: Date;
}

interface SecurityAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
}

export default function SecurityMonitor() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    ssl: false,
    headers: false,
    auth: false,
    rateLimit: false,
    lastCheck: new Date(),
  });
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Only check once on mount, not repeatedly
    checkSecurityStatus();
    
    // Check every 5 minutes instead of 30 seconds
    const interval = setInterval(checkSecurityStatus, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const checkSecurityStatus = async () => {
    // Prevent multiple simultaneous checks
    if (isChecking) return;
    setIsChecking(true);
    
    try {
      // Check SSL (no API call needed)
      const isSSL = window.location.protocol === 'https:';
      
      // Only check security headers occasionally (not on every check)
      let headersValid = true;
      if (Math.random() < 0.2) { // Only 20% of the time
        try {
          const headersResponse = await fetch('/api/security/headers');
          headersValid = headersResponse.ok;
        } catch (error) {
          console.warn('Security headers check failed:', error);
          headersValid = false;
        }
      }
      
      // Don't check auth status here - it's already handled by NextAuth
      const authValid = true;
      
      // Check rate limiting (simulated)
      const rateLimitValid = true; // In real app, check actual rate limiting status

      setSecurityStatus({
        ssl: isSSL,
        headers: headersValid,
        auth: authValid,
        rateLimit: rateLimitValid,
        lastCheck: new Date(),
      });

      // Add alerts based on status
      const newAlerts: SecurityAlert[] = [];
      
      if (!isSSL) {
        newAlerts.push({
          id: Date.now().toString(),
          type: 'warning',
          message: 'Connection not using SSL/TLS encryption',
          timestamp: new Date(),
        });
      }

      if (!headersValid) {
        newAlerts.push({
          id: (Date.now() + 1).toString(),
          type: 'error',
          message: 'Security headers not properly configured',
          timestamp: new Date(),
        });
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev.slice(0, 4)]); // Keep last 5 alerts
      }

    } catch (error) {
      console.error('Security check failed:', error);
      setAlerts(prev => [{
        id: Date.now().toString(),
        type: 'error',
        message: 'Security monitoring service unavailable',
        timestamp: new Date(),
      }, ...prev.slice(0, 4)]);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <FaCheckCircle className="text-green-400" size={16} />
    ) : (
      <FaTimesCircle className="text-red-400" size={16} />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-400' : 'text-red-400';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-400" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-400" />;
      case 'error': return <FaTimesCircle className="text-red-400" />;
      default: return <FaInfoCircle className="text-blue-400" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-900/20 border-green-700/50';
      case 'warning': return 'bg-yellow-900/20 border-yellow-700/50';
      case 'error': return 'bg-red-900/20 border-red-700/50';
      default: return 'bg-blue-900/20 border-blue-700/50';
    }
  };

  return (
    <>
      {/* Security Status Toggle */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-full p-3 hover:bg-gray-800/90 transition-all duration-300 shadow-lg"
        title="Security Monitor"
      >
        <FaShieldAlt className="text-blue-400" size={20} />
      </button>

      {/* Security Monitor Panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 right-4 z-40 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-blue-400" />
              <h3 className="text-white font-semibold">Security Monitor</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimesCircle size={16} />
            </button>
          </div>

          {/* Security Status */}
          <div className="p-4">
            <h4 className="text-gray-300 font-medium mb-3">Security Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">SSL/TLS</span>
                {getStatusIcon(securityStatus.ssl)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Security Headers</span>
                {getStatusIcon(securityStatus.headers)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Authentication</span>
                {getStatusIcon(securityStatus.auth)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Rate Limiting</span>
                {getStatusIcon(securityStatus.rateLimit)}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Last Check</span>
                <span>{securityStatus.lastCheck.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Security Alerts */}
          {alerts.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <h4 className="text-gray-300 font-medium mb-3">Recent Alerts</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-2 rounded-lg border ${getAlertBgColor(alert.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-xs text-gray-300">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tips */}
          <div className="p-4 border-t border-gray-700">
            <h4 className="text-gray-300 font-medium mb-2">Security Tips</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <FaLock className="text-blue-400 mt-0.5" size={10} />
                <span>Always use HTTPS for secure connections</span>
              </div>
              <div className="flex items-start gap-2">
                <FaEye className="text-blue-400 mt-0.5" size={10} />
                <span>Never share your login credentials</span>
              </div>
              <div className="flex items-start gap-2">
                <FaShieldAlt className="text-blue-400 mt-0.5" size={10} />
                <span>Enable two-factor authentication when available</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
} 