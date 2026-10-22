import { MEALS } from '../models/FoodEntry.js';
import { HttpError } from './HttpError.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Coerce to a non-negative finite number, or `fallback` if it isn't one. */
function nonNegNum(v, fallback = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Trim a string and cap its length; returns '' for non-strings. */
function str(v, max = 200) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Validate and normalize a food-logging payload into exactly the fields we
 * persist. Throws HttpError(400) on a missing name, a bad date, or an invalid
 * meal — the three fields the day view keys on.
 */
export function sanitizeFoodPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }

  const name = str(body.name, 160);
  if (!name) throw new HttpError(400, 'A food name is required');

  if (typeof body.date !== 'string' || !DATE_RE.test(body.date)) {
    throw new HttpError(400, '`date` must be a YYYY-MM-DD string');
  }

  if (!MEALS.includes(body.meal)) {
    throw new HttpError(400, `\`meal\` must be one of: ${MEALS.join(', ')}`);
  }

  return {
    date: body.date,
    meal: body.meal,
    name,
    detail: str(body.detail, 200),
    calories: nonNegNum(body.calories),
    protein: nonNegNum(body.protein),
    carbs: nonNegNum(body.carbs),
    fat: nonNegNum(body.fat),
    fibre: nonNegNum(body.fibre),
  };
}

/**
 * Validate a water-logging payload: a date and a non-negative glass count.
 * Capped so a bad client can't store an absurd value.
 */
export function sanitizeWaterPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }
  if (typeof body.date !== 'string' || !DATE_RE.test(body.date)) {
    throw new HttpError(400, '`date` must be a YYYY-MM-DD string');
  }
  return {
    date: body.date,
    glasses: Math.min(nonNegNum(body.glasses), 50),
  };
}
