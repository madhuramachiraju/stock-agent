import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 500, // Increased to 500 requests per window
  },
  blockedIPs: new Set<string>(), // Add IPs to block here
  allowedOrigins: [
    'http://localhost:3000',
    'https://stockagent.com',
    'https://www.stockagent.com',
  ],
};

// Rate limiting function
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - SECURITY_CONFIG.rateLimit.windowMs;
  
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    // Reset or create new record
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.rateLimit.windowMs,
    });
    return false;
  }
  
  if (record.count >= SECURITY_CONFIG.rateLimit.maxRequests) {
    return true;
  }
  
  record.count++;
  return false;
}

// Clean up old rate limit records
function cleanupRateLimitStore() {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([ip, record]) => {
    if (record.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  });
}

// Security validation functions
function validateRequest(req: NextRequest): { valid: boolean; reason?: string } {
  const url = req.nextUrl;
  const userAgent = req.headers.get('user-agent') || '';
  const origin = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';
  
  // Block suspicious user agents
  const suspiciousUserAgents = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java',
    'sqlmap', 'nikto', 'nmap', 'masscan', 'dirb', 'gobuster'
  ];
  
  // Temporarily disabled for testing
  /*
  if (suspiciousUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return { valid: false, reason: 'Suspicious user agent' };
  }
  */
  
  // Validate origin for API routes
  if (url.pathname.startsWith('/api/') && origin) {
    if (!SECURITY_CONFIG.allowedOrigins.includes(origin)) {
      return { valid: false, reason: 'Invalid origin' };
    }
  }
  
  // Block common attack patterns
  const attackPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /eval\s*\(/i, // Code injection
    /document\.cookie/i, // Cookie theft attempts
  ];
  
  const fullUrl = url.toString();
  if (attackPatterns.some(pattern => pattern.test(fullUrl))) {
    return { valid: false, reason: 'Malicious request pattern detected' };
  }
  
  return { valid: true };
}

// Main middleware function
export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const url = request.nextUrl;
  
  // Clean up rate limit store periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupRateLimitStore();
  }
  
  // Block specific IPs
  if (SECURITY_CONFIG.blockedIPs.has(ip)) {
    return new NextResponse('Access Denied', { status: 403 });
  }
  
  // Rate limiting
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
      }
    });
  }
  
  // Security validation
  const validation = validateRequest(request);
  if (!validation.valid) {
    console.warn(`Security violation from ${ip}: ${validation.reason}`);
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Add security headers to response
  const response = NextResponse.next();
  
  // Additional security headers
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Cache control for sensitive routes
  if (url.pathname.startsWith('/api/auth/') || url.pathname.startsWith('/api/user/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  // Log security events
  if (url.pathname.startsWith('/api/')) {
    console.log(`API Request: ${request.method} ${url.pathname} from ${ip}`);
  }
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 