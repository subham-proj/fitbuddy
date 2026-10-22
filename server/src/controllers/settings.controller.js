import { env } from '../config/env.js';
import { settingsService } from '../services/settings.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeSettingsPayload } from '../utils/sanitizeSettingsPayload.js';

/** GET /api/settings — the owner's settings (created with defaults if absent). */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.get(env.ownerUserId);
  res.json({ data: settings });
});

/** PUT /api/settings — replace the editable sections. */
export const updateSettings = asyncHandler(async (req, res) => {
  const data = sanitizeSettingsPayload(req.body);
  const settings = await settingsService.update(env.ownerUserId, data);
  res.json({ data: settings });
});
