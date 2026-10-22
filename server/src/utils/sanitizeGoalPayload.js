import { GOAL_AREAS, GOAL_STATUSES } from '../models/Goal.js';
import { HttpError } from './HttpError.js';

/** Coerce to a finite number, or `fallback` if it isn't one. */
function num(v, fallback = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Trim a string and cap its length; returns '' for non-strings. */
function str(v, max = 160) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Validate and normalize a goal payload (create/update) into the fields we
 * persist. `pct` is derived on the model and never accepted from a client.
 * Throws HttpError(400) when the title is missing.
 */
export function sanitizeGoalPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }

  const title = str(body.title);
  if (!title) throw new HttpError(400, 'A goal title is required');

  return {
    title,
    area: GOAL_AREAS.includes(body.area) ? body.area : 'other',
    unit: str(body.unit, 20),
    startValue: num(body.startValue),
    currentValue: num(body.currentValue),
    targetValue: num(body.targetValue),
    due: str(body.due, 40),
    status: GOAL_STATUSES.includes(body.status) ? body.status : 'on-track',
    isPrimary: Boolean(body.isPrimary),
  };
}
