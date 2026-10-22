import { env } from '../config/env.js';
import { goalService } from '../services/goal.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/HttpError.js';
import { sanitizeGoalPayload } from '../utils/sanitizeGoalPayload.js';

/** GET /api/goals — the owner's goals, newest first. */
export const listGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.findAll(env.ownerUserId);
  res.json({ data: goals });
});

/** POST /api/goals */
export const createGoal = asyncHandler(async (req, res) => {
  const data = sanitizeGoalPayload(req.body); // throws 400 on bad input
  const goal = await goalService.create(env.ownerUserId, data);
  res.status(201).json({ data: goal });
});

/** PUT /api/goals/:id */
export const updateGoal = asyncHandler(async (req, res) => {
  const data = sanitizeGoalPayload(req.body);
  const goal = await goalService.update(env.ownerUserId, req.params.id, data);
  if (!goal) throw new HttpError(404, 'Goal not found');
  res.json({ data: goal });
});

/** DELETE /api/goals/:id */
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.remove(env.ownerUserId, req.params.id);
  if (!goal) throw new HttpError(404, 'Goal not found');
  res.status(204).send();
});
