import { env } from '../config/env.js';
import { dashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** GET /api/dashboard — composed landing-page view for the owner. */
export const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboard(env.ownerUserId);
  res.json({ data });
});
