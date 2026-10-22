import mongoose from 'mongoose';

import { env, isProduction } from './env.js';

/**
 * Establish the MongoDB connection via Mongoose.
 *
 * Call once at startup (see `src/index.js`). Throws if MONGO_URI is missing or
 * the initial connection fails, so the process can exit instead of serving
 * requests against a dead database.
 */
export async function connectDB() {
  if (!env.mongoUri) {
    throw new Error(
      'MONGO_URI is not set. Add it to server/.env before starting the server.',
    );
  }

  // Surface query issues loudly outside production.
  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(env.mongoUri);

  if (!isProduction) {
    console.log(`🗄️  MongoDB connected: ${conn.connection.host}`);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });

  return conn;
}

/**
 * Cleanly close the connection — used during graceful shutdown.
 */
export async function disconnectDB() {
  await mongoose.connection.close();
}
