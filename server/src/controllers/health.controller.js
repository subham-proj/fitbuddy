import { env } from '../config/env.js';

/**
 * Health check — returns basic liveness info. Useful for uptime monitors and
 * for confirming the frontend proxy reaches the backend.
 */
export function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'fitbuddy-server',
    environment: env.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
