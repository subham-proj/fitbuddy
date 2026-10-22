import { Router } from 'express';

import {
  getMetricByDate,
  listMetrics,
} from '../controllers/watch.controller.js';

const router = Router();

// Read path for the web app dashboard. Served from the same `fitbuddy` DB.
router.get('/', listMetrics);
router.get('/:date', getMetricByDate);

export default router;
