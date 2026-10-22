import { Router } from 'express';

import healthRoutes from './health.routes.js';
import metricsRoutes from './metrics.routes.js';
import nutritionRoutes from './nutrition.routes.js';
import planRoutes from './plan.routes.js';
import watchRoutes from './watch.routes.js';
import workoutRoutes from './workout.routes.js';

const router = Router();

/**
 * Mount all feature routers here. Each feature owns its own routes file
 * and is mounted under a path prefix.
 */
router.use('/health', healthRoutes);
router.use('/workouts', workoutRoutes);
router.use('/plan', planRoutes); // weekly plan
router.use('/watch', watchRoutes); // watch sync (write)
router.use('/metrics', metricsRoutes); // dashboard reads
router.use('/nutrition', nutritionRoutes); // manual food/water logging

export default router;
