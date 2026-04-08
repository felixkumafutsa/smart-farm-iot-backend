const rateLimit = require('express-rate-limit');

/**
 * Standard rate limiting middleware.
 * Prevents DDoS and brute force.
 * Configured for Vercel deployment with proxy support.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests. Please try again later.' },
  // Use the X-Forwarded-For header for IP detection in Vercel
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

module.exports = {
  apiLimiter
};