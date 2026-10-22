import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { env, isProduction } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Core middleware
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

// API routes
app.use('/api', routes);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

export default app;
