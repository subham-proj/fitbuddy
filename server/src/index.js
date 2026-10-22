import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env, validateConfig } from './config/env.js';

let server;

async function start() {
  try {
    validateConfig();
    await connectDB();

    server = app.listen(env.port, () => {
      console.log(
        `🚀 FitBuddy server running in ${env.nodeEnv} mode on http://localhost:${env.port}`,
      );
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await disconnectDB();
  console.log('Server closed.');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
