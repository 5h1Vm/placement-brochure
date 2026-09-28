/**
 * Simple in-memory rate limiter for API routes.
 * Tracks request counts per IP within a sliding time window.
 */

const rateMap = new Map<string, { count: number; resetTime: number }>()

// Clean up stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateMap) {
    if (now > value.resetTime) rateMap.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * Check if a request from a given identifier should be rate-limited.
 * @param identifier - Typically the client IP or a composite key
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if the request should be BLOCKED
 */
export function isRateLimited(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const now = Date.now()
  const entry = rateMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    rateMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return false
  }

  entry.count++
  return entry.count > maxRequests
}
