import { NextRequest, NextResponse } from 'next/server';
import { SecurityUtils } from './security';

// API Security wrapper
export class APISecurity {
  // Rate limiting store (in production, use Redis)
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  // Security configuration
  private static config = {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
    },
    maxBodySize: 1024 * 1024, // 1MB
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    requireAuth: ['POST', 'PUT', 'DELETE', 'PATCH'],
  };

  // Rate limiting check
  private static isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record || record.resetTime < now) {
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs,
      });
      return false;
    }

    if (record.count >= this.config.rateLimit.maxRequests) {
      return true;
    }

    record.count++;
    return false;
  }

  // Validate request method
  private static validateMethod(method: string): boolean {
    return this.config.allowedMethods.includes(method);
  }

  // Validate request body size
  private static validateBodySize(contentLength: string | null): boolean {
    if (!contentLength) return true;
    const size = parseInt(contentLength, 10);
    return size <= this.config.maxBodySize;
  }

  // Validate authentication requirement
  private static requiresAuth(method: string): boolean {
    return this.config.requireAuth.includes(method);
  }

  // Security audit for request
  private static auditRequest(req: NextRequest): { safe: boolean; issues: string[] } {
    const issues: string[] = [];
    const url = req.nextUrl.toString();
    const userAgent = req.headers.get('user-agent') || '';

    // Check for suspicious patterns
    if (SecurityUtils.containsSqlInjection(url)) {
      issues.push('Potential SQL injection in URL');
    }

    if (SecurityUtils.containsXSS(url)) {
      issues.push('Potential XSS in URL');
    }

    // Check user agent
    const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'dirb'];
    if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
      issues.push('Suspicious user agent detected');
    }

    // Check content length
    const contentLength = req.headers.get('content-length');
    if (!this.validateBodySize(contentLength)) {
      issues.push('Request body too large');
    }

    return {
      safe: issues.length === 0,
      issues,
    };
  }

  // Main security wrapper
  static withSecurity(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        const startTime = Date.now();
        const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
        const method = req.method;
        const url = req.nextUrl.pathname;

        // Log request
        console.log(`[${new Date().toISOString()}] ${method} ${url} from ${ip}`);

        // Validate method
        if (!this.validateMethod(method)) {
          return new NextResponse('Method Not Allowed', { status: 405 });
        }

        // Rate limiting
        const rateLimitKey = `${ip}:${method}:${url}`;
        if (this.isRateLimited(rateLimitKey)) {
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'Retry-After': '900',
              'X-RateLimit-Limit': this.config.rateLimit.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
            },
          });
        }

        // Security audit
        const audit = this.auditRequest(req);
        if (!audit.safe) {
          console.warn(`Security issues detected from ${ip}:`, audit.issues);
          return new NextResponse('Forbidden', { status: 403 });
        }

        // Execute handler
        const response = await handler(req);

        // Add security headers
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('X-Request-ID', SecurityUtils.generateSecureToken(16));

        // Log response time
        const responseTime = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${method} ${url} completed in ${responseTime}ms`);

        return response;
      } catch (error) {
        console.error('API Security wrapper error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
    };
  }

  // Authentication wrapper
  static withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      // Check for authentication token
      const authHeader = req.headers.get('authorization');
      const sessionToken = req.cookies.get('next-auth.session-token')?.value;

      if (!authHeader && !sessionToken) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      // Validate token format (basic check)
      if (authHeader && !authHeader.startsWith('Bearer ')) {
        return new NextResponse('Invalid authorization header', { status: 401 });
      }

      return this.withSecurity(handler)(req);
    };
  }

  // Input validation wrapper
  static withValidation(
    handler: (req: NextRequest) => Promise<NextResponse>,
    validationSchema: Record<string, 'email' | 'password' | 'stockSymbol' | 'username' | 'phone'>
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        // Parse request body
        const body = await req.json().catch(() => ({}));

        // Validate each field
        for (const [field, type] of Object.entries(validationSchema)) {
          const value = body[field];
          if (value && !SecurityUtils.validateInput(value, type)) {
            return new NextResponse(`Invalid ${field} format`, { status: 400 });
          }
        }

        return this.withSecurity(handler)(req);
      } catch (error) {
        return new NextResponse('Invalid request body', { status: 400 });
      }
    };
  }

  // CORS wrapper
  static withCORS(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const response = await this.withSecurity(handler)(req);

      // Add CORS headers
      const origin = req.headers.get('origin');
      const allowedOrigins = [
        'http://localhost:3000',
        'https://stockagent.com',
        'https://www.stockagent.com',
      ];

      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }

      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');

      return response;
    };
  }

  // Complete security wrapper (combines all)
  static withFullSecurity(
    handler: (req: NextRequest) => Promise<NextResponse>,
    options: {
      requireAuth?: boolean;
      validationSchema?: Record<string, 'email' | 'password' | 'stockSymbol' | 'username' | 'phone'>;
      enableCORS?: boolean;
    } = {}
  ) {
    let wrappedHandler = handler;

    // Apply validation if schema provided
    if (options.validationSchema) {
      wrappedHandler = this.withValidation(wrappedHandler, options.validationSchema);
    }

    // Apply authentication if required
    if (options.requireAuth) {
      wrappedHandler = this.withAuth(wrappedHandler);
    }

    // Apply CORS if enabled
    if (options.enableCORS) {
      wrappedHandler = this.withCORS(wrappedHandler);
    }

    // Always apply basic security
    return this.withSecurity(wrappedHandler);
  }
}

// Export for convenience
export const { withSecurity, withAuth, withValidation, withCORS, withFullSecurity } = APISecurity; 