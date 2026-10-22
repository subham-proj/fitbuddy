import { env } from '../config/env.js';
import { planService } from '../services/plan.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/HttpError.js';
import { sanitizePlanPayload } from '../utils/sanitizePlanPayload.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function assertDate(date) {
  if (!DATE_RE.test(date)) {
    throw new HttpError(400, 'Date must be a YYYY-MM-DD string');
  }
}

/** GET /api/plan?from=&to= — planned entries for the owner in a date range. */
export const listPlan = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (from) assertDate(from);
  if (to) assertDate(to);
  const sessions = await planService.findRange(env.ownerUserId, from, to);
  res.json({ data: sessions });
});

/** PUT /api/plan/:date — set (upsert) the plan entry for one day. */
export const setPlanDay = asyncHandler(async (req, res) => {
  assertDate(req.params.date);
  const data = sanitizePlanPayload(req.body);
  const session = await planService.setDay(env.ownerUserId, req.params.date, data);
  res.json({ data: session });
});

/** DELETE /api/plan/:date — clear the plan entry for one day. */
export const deletePlanDay = asyncHandler(async (req, res) => {
  assertDate(req.params.date);
  const session = await planService.removeDay(env.ownerUserId, req.params.date);
  if (!session) throw new HttpError(404, 'No plan for that date');
  res.status(204).send();
});
