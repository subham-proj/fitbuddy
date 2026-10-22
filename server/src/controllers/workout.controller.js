import { workoutService } from '../services/workout.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/HttpError.js';

/** GET /api/workouts */
export const listWorkouts = asyncHandler(async (req, res) => {
  const workouts = await workoutService.findAll();
  res.json({ data: workouts });
});

/** GET /api/workouts/:id */
export const getWorkout = asyncHandler(async (req, res) => {
  const workout = await workoutService.findById(req.params.id);
  if (!workout) throw new HttpError(404, 'Workout not found');
  res.json({ data: workout });
});

/** POST /api/workouts */
export const createWorkout = asyncHandler(async (req, res) => {
  const workout = await workoutService.create(req.body);
  res.status(201).json({ data: workout });
});

/** PUT /api/workouts/:id */
export const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await workoutService.update(req.params.id, req.body);
  if (!workout) throw new HttpError(404, 'Workout not found');
  res.json({ data: workout });
});

/** DELETE /api/workouts/:id */
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await workoutService.remove(req.params.id);
  if (!workout) throw new HttpError(404, 'Workout not found');
  res.status(204).send();
});
