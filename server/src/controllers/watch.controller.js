import { env } from '../config/env.js';
import { dailyMetricService } from '../services/dailyMetric.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/HttpError.js';
import { sanitizeWatchPayload } from '../utils/sanitizeWatchPayload.js';

/** POST /api/watch/sync — receive a watch payload and upsert the day's metrics. */
export const syncWatch = asyncHandler(async (req, res) => {
  const payload = sanitizeWatchPayload(req.body); // throws 400 on bad input
  await dailyMetricService.upsertFromSync(env.ownerUserId, payload);
  res.json({ ok: true });
});

/** GET /api/metrics?from=&to= — lean list of daily metrics for the owner. */
export const listMetrics = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const docs = await dailyMetricService.findRange(env.ownerUserId, from, to);
  res.json({ data: docs });
});

/** GET /api/metrics/:date — full single-day document including per-minute HR. */
export const getMetricByDate = asyncHandler(async (req, res) => {
  const doc = await dailyMetricService.findByDate(
    env.ownerUserId,
    req.params.date,
  );
  if (!doc) throw new HttpError(404, 'No metrics for that date');
  res.json({ data: doc });
});
