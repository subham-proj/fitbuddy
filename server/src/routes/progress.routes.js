import { Router } from 'express';

import {
  getProgress,
  logMeasurement,
} from '../controllers/progress.controller.js';

const router = Router();

router.get('/', getProgress);
router.post('/measurement', logMeasurement);

export default router;
