import { env } from '../config/env.js';
import { streakService } from '../services/streak.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** GET /api/streak — current/longest workout streak for the owner. */
export const getStreak = asyncHandler(async (req, res) => {
  const data = await streakService.compute(env.ownerUserId);
  res.json({ data });
});
