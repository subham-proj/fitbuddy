import { Router } from 'express';

import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
  updateWorkout,
} from '../controllers/workout.controller.js';

const router = Router();

router.route('/').get(listWorkouts).post(createWorkout);
router.route('/:id').get(getWorkout).put(updateWorkout).delete(deleteWorkout);

export default router;
