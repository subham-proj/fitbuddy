import { Router } from 'express';

import healthRoutes from './health.routes.js';

const router = Router();

/**
 * Mount all feature routers here. Each feature owns its own routes file
 * (e.g. `workouts.routes.js`) and is mounted under a path prefix.
 */
router.use('/health', healthRoutes);

export default router;
