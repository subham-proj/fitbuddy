import { Router } from 'express';

import { getWatchStatus, syncWatch } from '../controllers/watch.controller.js';
import { syncLimiter } from '../middleware/rateLimit.js';
import { requireWatchKey } from '../middleware/watchAuth.js';

const router = Router();

// Write path from the watch's phone-side service. Rate-limited + API-key protected.
router.post('/sync', syncLimiter, requireWatchKey, syncWatch);

// Read path for the web app: has the watch synced, and when. Owner-scoped read,
// same as the metrics dashboard reads (no API key).
router.get('/status', getWatchStatus);

export default router;
