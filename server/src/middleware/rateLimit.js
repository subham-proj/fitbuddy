import rateLimit from 'express-rate-limit';

/**
 * General limiter for the whole API — a safety net against runaway clients.
 * Generous because the dashboard may fan out several reads per page load.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'TooManyRequests', message: 'Rate limit exceeded.' },
});

/**
 * Tight limiter for the public write endpoint. The watch syncs at most a
 * handful of times per app-open, so anything above this is abuse.
 */
export const syncLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'TooManyRequests', message: 'Sync rate limit exceeded.' },
});
