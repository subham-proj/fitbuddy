import { env } from '../config/env.js';
import { measurementService } from '../services/measurement.service.js';
import { progressService } from '../services/progress.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeMeasurementPayload } from '../utils/sanitizeMeasurementPayload.js';

/** GET /api/progress?range=4W|3M|6M|1Y — composed progress view for the owner. */
export const getProgress = asyncHandler(async (req, res) => {
  const data = await progressService.getProgress(env.ownerUserId, req.query.range);
  res.json({ data });
});

/** POST /api/progress/measurement — log a weigh-in (syncs latest weight). */
export const logMeasurement = asyncHandler(async (req, res) => {
  const payload = sanitizeMeasurementPayload(req.body); // throws 400 on bad input
  const entry = await measurementService.upsert(env.ownerUserId, payload);
  res.status(201).json({ data: entry });
});
