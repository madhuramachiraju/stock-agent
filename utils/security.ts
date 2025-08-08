import crypto from 'crypto';

// Security utility functions
export class SecurityUtils {
  // Input validation patterns
  private static readonly VALIDATION_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    stockSymbol: /^[A-Z]{1,5}$/,
    username: /^[a-zA-Z0-9_-]{3,20}$/,
    phone: /^\+?[\d\s\-\(\)]{10,15}$/,
  };

  // XSS prevention - HTML entity encoding
  static escapeHtml(text: string): string {
    const htmlEscapes: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    
    return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
  }

  // SQL Injection prevention - Basic pattern matching
  static containsSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(WAITFOR|DELAY)\b)/i,
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // XSS prevention - Script tag detection
  static containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    // Escape HTML
    sanitized = this.escapeHtml(sanitized);
    
    // Remove control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    
    return sanitized;
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    const sanitized = this.sanitizeInput(email);
    return this.VALIDATION_PATTERNS.email.test(sanitized);
  }

  // Validate password strength
  static isValidPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate stock symbol
  static isValidStockSymbol(symbol: string): boolean {
    if (!symbol || typeof symbol !== 'string') {
      return false;
    }
    
    const sanitized = this.sanitizeInput(symbol);
    return this.VALIDATION_PATTERNS.stockSymbol.test(sanitized);
  }

  // Generate secure random token
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash password (for when you implement server-side auth)
  static async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  // Verify password hash
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString('hex'));
      });
    });
  }

  // Rate limiting helper
  static generateRateLimitKey(identifier: string, action: string): string {
    return `rate_limit:${action}:${identifier}`;
  }

  // CSRF token generation
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate CSRF token
  static validateCSRFToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) {
      return false;
    }
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(storedToken, 'hex')
    );
  }

  // Input validation wrapper
  static validateInput(input: any, type: 'email' | 'password' | 'stockSymbol' | 'username' | 'phone'): boolean {
    if (!input || typeof input !== 'string') {
      return false;
    }
    
    const sanitized = this.sanitizeInput(input);
    
    switch (type) {
      case 'email':
        return this.isValidEmail(sanitized);
      case 'password':
        return this.isValidPassword(sanitized).valid;
      case 'stockSymbol':
        return this.isValidStockSymbol(sanitized);
      case 'username':
        return this.VALIDATION_PATTERNS.username.test(sanitized);
      case 'phone':
        return this.VALIDATION_PATTERNS.phone.test(sanitized);
      default:
        return false;
    }
  }

  // Security audit for user input
  static auditInput(input: string): { safe: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!input || typeof input !== 'string') {
      return { safe: false, issues: ['Input is not a valid string'] };
    }
    
    if (this.containsSqlInjection(input)) {
      issues.push('Potential SQL injection detected');
    }
    
    if (this.containsXSS(input)) {
      issues.push('Potential XSS attack detected');
    }
    
    if (input.length > 10000) {
      issues.push('Input too long (max 10,000 characters)');
    }
    
    return {
      safe: issues.length === 0,
      issues
    };
  }
}

// Export individual functions for convenience
export const {
  escapeHtml,
  containsSqlInjection,
  containsXSS,
  sanitizeInput,
  isValidEmail,
  isValidPassword,
  isValidStockSymbol,
  generateSecureToken,
  hashPassword,
  verifyPassword,
  generateRateLimitKey,
  generateCSRFToken,
  validateCSRFToken,
  validateInput,
  auditInput,
} = SecurityUtils; 