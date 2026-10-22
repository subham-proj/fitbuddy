import { Router } from 'express';

import {
  createGoal,
  deleteGoal,
  listGoals,
  updateGoal,
} from '../controllers/goal.controller.js';

const router = Router();

router.route('/').get(listGoals).post(createGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);

export default router;
