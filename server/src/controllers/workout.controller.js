import { env } from '../config/env.js';
import { workoutService } from '../services/workout.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/HttpError.js';
import { sanitizeWorkoutPayload } from '../utils/sanitizeWorkoutPayload.js';

/** GET /api/workouts — logged workouts for the owner, newest first. */
export const listWorkouts = asyncHandler(async (req, res) => {
  const workouts = await workoutService.findAll(env.ownerUserId);
  res.json({ data: workouts });
});

/** GET /api/workouts/:id */
export const getWorkout = asyncHandler(async (req, res) => {
  const workout = await workoutService.findById(env.ownerUserId, req.params.id);
  if (!workout) throw new HttpError(404, 'Workout not found');
  res.json({ data: workout });
});

/** POST /api/workouts */
export const createWorkout = asyncHandler(async (req, res) => {
  const data = sanitizeWorkoutPayload(req.body); // throws 400 on bad input
  const workout = await workoutService.create(env.ownerUserId, data);
  res.status(201).json({ data: workout });
});

/** PUT /api/workouts/:id */
export const updateWorkout = asyncHandler(async (req, res) => {
  const data = sanitizeWorkoutPayload(req.body);
  const workout = await workoutService.update(env.ownerUserId, req.params.id, data);
  if (!workout) throw new HttpError(404, 'Workout not found');
  res.json({ data: workout });
});

/** DELETE /api/workouts/:id */
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await workoutService.remove(env.ownerUserId, req.params.id);
  if (!workout) throw new HttpError(404, 'Workout not found');
  res.status(204).send();
});
