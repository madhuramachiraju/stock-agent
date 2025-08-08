import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // This endpoint checks if security headers are properly configured
  // In a real application, you might want to check against a security policy
  
  const securityHeaders = {
    'X-Frame-Options': req.headers.get('x-frame-options'),
    'X-Content-Type-Options': req.headers.get('x-content-type-options'),
    'X-XSS-Protection': req.headers.get('x-xss-protection'),
    'Strict-Transport-Security': req.headers.get('strict-transport-security'),
    'Content-Security-Policy': req.headers.get('content-security-policy'),
    'Referrer-Policy': req.headers.get('referrer-policy'),
    'Permissions-Policy': req.headers.get('permissions-policy'),
  };

  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options', 
    'X-XSS-Protection'
  ];

  const missingHeaders = requiredHeaders.filter(
    header => !securityHeaders[header as keyof typeof securityHeaders]
  );

  const isValid = missingHeaders.length === 0;

  return NextResponse.json({
    valid: isValid,
    headers: securityHeaders,
    missing: missingHeaders,
    timestamp: new Date().toISOString(),
  });
} 