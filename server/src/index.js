import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(
    `🚀 FitBuddy server running in ${env.nodeEnv} mode on http://localhost:${env.port}`,
  );
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
