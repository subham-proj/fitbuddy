import dotenv from 'dotenv';

dotenv.config();

/**
 * Resolve the MongoDB connection string.
 *
 * Prefer a full `MONGO_URI` if provided; otherwise assemble an Atlas SRV URI
 * from its parts. Credentials are URL-encoded so special characters in the
 * username/password are handled correctly.
 */
function resolveMongoUri() {
  if (process.env.MONGO_URI?.trim()) {
    return process.env.MONGO_URI.trim();
  }

  const user = process.env.MONGO_USERNAME;
  const pass = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST || 'cluster0.rgujunx.mongodb.net';
  const db = process.env.MONGO_DB || 'fitbuddy';

  if (!user || !pass) return '';

  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(
    pass,
  )}@${host}/${db}?retryWrites=true&w=majority`;
}

/**
 * Centralized, validated access to environment variables.
 * Import `env` anywhere instead of reading `process.env` directly.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: resolveMongoUri(),
  // Shared secret the watch's phone-side service sends as `x-api-key`.
  watchKey: process.env.WATCH_KEY || '',
  // Single-user deployment: every watch sync is attributed to this user id.
  ownerUserId: process.env.OWNER_USER_ID || 'owner',
  // Number of proxies in front of the app (ngrok, nginx, a PaaS router…).
  // Set TRUST_PROXY=1 when running behind a tunnel/proxy so rate limiting can
  // read the real client IP. Defaults to 1 in production, 0 in development.
  trustProxy: Number(
    process.env.TRUST_PROXY ??
      (process.env.NODE_ENV === 'production' ? 1 : 0),
  ),
  // Optional override for where the built web app is served from in
  // production. Defaults to ../../client/dist relative to the server.
  clientDist: process.env.CLIENT_DIST || '',
};

export const isProduction = env.nodeEnv === 'production';

/**
 * Fail fast on misconfiguration before the server starts accepting traffic.
 * Called once at startup. In production we refuse to boot with a missing or
 * weak watch secret, since that endpoint is internet-facing and accepts writes.
 */
export function validateConfig() {
  const errors = [];

  if (!env.mongoUri) {
    errors.push('MONGO_URI (or MONGO_USERNAME/PASSWORD) is not set.');
  }

  if (isProduction) {
    if (!env.watchKey) {
      errors.push('WATCH_KEY must be set in production.');
    } else if (env.watchKey.length < 24) {
      errors.push('WATCH_KEY is too weak — use at least 24 random characters.');
    } else if (/dev-watch-key|replace_me|changeme|test/i.test(env.watchKey)) {
      errors.push('WATCH_KEY still looks like a placeholder — set a real secret.');
    }
  }

  if (errors.length) {
    throw new Error(`Invalid configuration:\n  - ${errors.join('\n  - ')}`);
  }
}
