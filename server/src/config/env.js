import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized, validated access to environment variables.
 * Import `env` anywhere instead of reading `process.env` directly.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || '',
};

export const isProduction = env.nodeEnv === 'production';
