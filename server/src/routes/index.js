import { Router } from 'express';

import healthRoutes from './health.routes.js';
import workoutRoutes from './workout.routes.js';

const router = Router();

/**
 * Mount all feature routers here. Each feature owns its own routes file
 * and is mounted under a path prefix.
 */
router.use('/health', healthRoutes);
router.use('/workouts', workoutRoutes);

export default router;
