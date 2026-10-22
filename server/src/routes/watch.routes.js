import { Router } from 'express';

import { syncWatch } from '../controllers/watch.controller.js';
import { syncLimiter } from '../middleware/rateLimit.js';
import { requireWatchKey } from '../middleware/watchAuth.js';

const router = Router();

// Write path from the watch's phone-side service. Rate-limited + API-key protected.
router.post('/sync', syncLimiter, requireWatchKey, syncWatch);

export default router;
