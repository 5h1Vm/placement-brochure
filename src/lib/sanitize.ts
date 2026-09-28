/**
 * Input sanitisation helpers.
 * Strips dangerous characters to prevent XSS and injection attacks.
 */

/** Strip HTML tags and trim whitespace */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, '')          // strip all HTML tags
    .replace(/[<>"'`;(){}]/g, '')     // strip dangerous chars
    .trim()
    .slice(0, 1000)                    // enforce max length
}

/** Validate and sanitize a hex color value */
export function sanitizeColor(input: string | null | undefined): string {
  if (!input) return '#000000'
  // Only allow valid hex colors
  const match = input.match(/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/)
  if (!match) return '#000000'
  return input.startsWith('#') ? input : `#${input}`
}

/** Validate email format loosely */
export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

/** Validate URL format */
export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

/** Sanitize a URL - only allow http/https */
export function sanitizeUrl(input: string | null | undefined): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null
  if (!isValidUrl(trimmed)) return null
  return trimmed
}

/** Sanitize a slug - only lowercase alphanumeric and hyphens */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 100)
}
