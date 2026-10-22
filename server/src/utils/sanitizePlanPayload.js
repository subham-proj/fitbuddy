import { PLAN_TYPES } from '../models/PlannedSession.js';
import { HttpError } from './HttpError.js';

/** Trim a string and cap its length; returns '' for non-strings. */
function str(v, max = 160) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Validate and normalize a plan-entry payload for a single day. The date is
 * taken from the URL, not the body. A non-rest day must name a workout.
 * Throws HttpError(400) otherwise.
 */
export function sanitizePlanPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }

  const isRest = Boolean(body.isRest);
  const title = str(body.title);

  if (!isRest && !title) {
    throw new HttpError(400, 'A workout title is required for a non-rest day');
  }

  return {
    // A rest day carries no workout details.
    title: isRest ? '' : title,
    type: !isRest && PLAN_TYPES.includes(body.type) ? body.type : 'other',
    time: isRest ? '' : str(body.time, 40),
    isRest,
    completed: !isRest && Boolean(body.completed),
  };
}
