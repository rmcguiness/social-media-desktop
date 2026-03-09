import { NextResponse } from 'next/server';

/**
 * Sanitize error responses for production
 * In development: return full error message
 * In production: return generic message (stack traces never exposed)
 */
export function handleApiError(
  error: unknown,
  context: string,
  statusCode: number = 500
): NextResponse {
  // Always log the full error for debugging
  console.error(`[${context}] Error:`, error);

  // Determine the error message
  const isDev = process.env.NODE_ENV !== 'production';
  
  let message: string;
  if (isDev && error instanceof Error) {
    // In development, show the actual error message (but never stack traces)
    message = error.message;
  } else {
    // In production, use generic messages based on context
    message = getGenericErrorMessage(context, statusCode);
  }

  return NextResponse.json(
    { error: message },
    { status: statusCode }
  );
}

function getGenericErrorMessage(context: string, statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Invalid request';
    case 401:
      return 'Authentication failed';
    case 403:
      return 'Access denied';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Resource conflict';
    case 429:
      return 'Too many requests';
    default:
      return 'An unexpected error occurred';
  }
}

/**
 * Create a rate limit exceeded response with Retry-After header
 */
export function rateLimitExceeded(retryAfter: number): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    }
  );
}
