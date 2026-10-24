import path from 'node:path';
import { fileURLToPath } from 'node:url';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env, isProduction } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import routes from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In production the built client is served from here (see Dockerfile layout).
const clientDist = env.clientDist || path.resolve(__dirname, '../../client/dist');

const app = express();

// Behind a reverse proxy/tunnel (Caddy/nginx/ngrok/PaaS) so that client IPs
// for rate limiting are read correctly. Controlled by TRUST_PROXY.
if (env.trustProxy) {
  app.set('trust proxy', env.trustProxy);
}

// Security headers. The CSP is tuned for this SPA: self-hosted JS, Google
// Fonts (stylesheet + font files), and inline style attributes used for
// progress bars / ring fills.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'connect-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'style-src': ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
      },
    },
  }),
);

// Core middleware
app.use(compression());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
// Cap body size — watch payloads are a few KB; 1mb is a generous ceiling.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

// API routes (general rate-limit as a safety net)
app.use('/api', apiLimiter, routes);

// In production the same service serves the built web app. Static assets are
// content-hashed, so they cache well; everything else falls back to index.html
// for client-side routing. API paths are excluded so they still 404 as JSON.
if (isProduction) {
  app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
  app.get(/^\/(?!api\/).*/, (req, res, next) => {
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

// Fallbacks
app.use(notFound);
app.use(errorHandler);

export default app;
