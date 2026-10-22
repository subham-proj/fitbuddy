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
};

export const isProduction = env.nodeEnv === 'production';
