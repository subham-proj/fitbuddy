import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env, isProduction } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import routes from './routes/index.js';

const app = express();

// Behind a reverse proxy/tunnel (ngrok/nginx/Caddy/Render/etc.) so that client
// IPs for rate limiting are read correctly. Controlled by TRUST_PROXY.
if (env.trustProxy) {
  app.set('trust proxy', env.trustProxy);
}

// Core middleware
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
// Cap body size — watch payloads are a few KB; 1mb is a generous ceiling.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

// API routes (general rate-limit as a safety net)
app.use('/api', apiLimiter, routes);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

export default app;
