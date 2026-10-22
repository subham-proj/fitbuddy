import { env } from '../config/env.js';
import { achievementService } from '../services/achievement.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** GET /api/achievements — milestone badges evaluated from the owner's stats. */
export const listAchievements = asyncHandler(async (req, res) => {
  const result = await achievementService.evaluate(env.ownerUserId);
  res.json({ data: result });
});
