import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevent clickjacking
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    // Block MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Enable XSS filter in older browsers
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // Control referrer information
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // Restrict browser features
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    // Force HTTPS
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    // Content Security Policy
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // Next.js needs these
      "style-src 'self' 'unsafe-inline'",                  // Tailwind needs inline styles
      "img-src 'self' data: blob: https: http:",           // Allow external images (faculty photos etc)
      "font-src 'self'",
      "frame-src https://maps.google.com https://www.google.com https://docs.google.com",  // Allow Maps and Forms
      "connect-src 'self' https://wa.me",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  }
]

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // Apply security headers to all routes
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  // Prevent source maps from being served in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
