import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, RateLimitType } from '@/lib/rate-limit';

/**
 * Middleware for rate limiting API endpoints
 * Applies different limits based on endpoint type
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Only apply rate limiting to POST requests on specific endpoints
  if (method !== 'POST') {
    return NextResponse.next();
  }

  // Get client IP (handle proxies)
  const ip = getClientIp(request);

  // Determine rate limit type based on path
  let rateLimitType: RateLimitType | null = null;

  if (pathname.startsWith('/api/auth/')) {
    rateLimitType = 'auth';
  } else if (pathname === '/api/posts') {
    rateLimitType = 'posts';
  } else if (pathname === '/api/comments') {
    rateLimitType = 'comments';
  }

  // No rate limit for this endpoint
  if (!rateLimitType) {
    return NextResponse.next();
  }

  // Check rate limit
  const { allowed, retryAfter, remaining } = checkRateLimit(ip, rateLimitType);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  return response;
}

function getClientIp(request: NextRequest): string {
  // Check common proxy headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default (in production, this should rarely happen)
  return 'unknown';
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/posts',
    '/api/comments',
  ],
};
