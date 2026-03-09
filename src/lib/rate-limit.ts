/**
 * IP-based rate limiting using in-memory Map
 * Limits reset after the window expires
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limits (per-endpoint)
const rateLimitStore = new Map<string, Map<string, RateLimitEntry>>();

// Default configs
export const RATE_LIMIT_CONFIGS = {
  auth: { maxRequests: 5, windowMs: 60 * 1000 },      // 5 req/min for auth
  posts: { maxRequests: 30, windowMs: 60 * 1000 },   // 30 req/min for posts
  comments: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 req/min for comments
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

/**
 * Check rate limit for a given IP and endpoint type
 * @returns { allowed: boolean, retryAfter?: number } - retryAfter is in seconds
 */
export function checkRateLimit(
  ip: string,
  type: RateLimitType
): { allowed: boolean; retryAfter?: number; remaining: number } {
  const config = RATE_LIMIT_CONFIGS[type];
  const now = Date.now();

  // Get or create store for this endpoint type
  if (!rateLimitStore.has(type)) {
    rateLimitStore.set(type, new Map());
  }
  const store = rateLimitStore.get(type)!;

  // Get or create entry for this IP
  let entry = store.get(ip);

  // If entry doesn't exist or window has expired, create new entry
  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    store.set(ip, entry);
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter, remaining: 0 };
  }

  return { allowed: true, remaining: config.maxRequests - entry.count };
}

/**
 * Clean up expired entries periodically
 * Call this on a timer if needed to prevent memory leaks
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [, store] of rateLimitStore) {
    for (const [ip, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(ip);
      }
    }
  }
}

// Auto-cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
