import { Router } from 'express';

import {
  deleteFood,
  getNutritionDay,
  logFood,
  setWater,
} from '../controllers/nutrition.controller.js';

const router = Router();

// Manual nutrition logging for the web app.
router.get('/:date', getNutritionDay);
router.post('/food', logFood);
router.delete('/food/:id', deleteFood);
router.put('/water', setWater);

export default router;
