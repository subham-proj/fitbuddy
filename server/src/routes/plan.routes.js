import { Router } from 'express';

import {
  deletePlanDay,
  listPlan,
  setPlanDay,
} from '../controllers/plan.controller.js';

const router = Router();

// Weekly plan for the web app. One entry per day, keyed by date.
router.get('/', listPlan);
router.put('/:date', setPlanDay);
router.delete('/:date', deletePlanDay);

export default router;
