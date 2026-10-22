import { HttpError } from './HttpError.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Positive finite number, or undefined. */
function posNum(v) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/**
 * Validate and normalize a body-measurement payload. Weight is required;
 * body fat is optional (null when absent). Throws HttpError(400) on a bad
 * date or a missing/invalid weight.
 */
export function sanitizeMeasurementPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }
  if (typeof body.date !== 'string' || !DATE_RE.test(body.date)) {
    throw new HttpError(400, '`date` must be a YYYY-MM-DD string');
  }

  const weightKg = posNum(body.weightKg);
  if (weightKg === undefined) {
    throw new HttpError(400, '`weightKg` must be a positive number');
  }

  const fat = Number(body.bodyFatPct);
  const bodyFatPct =
    Number.isFinite(fat) && fat >= 0 && fat <= 100 ? fat : null;

  return { date: body.date, weightKg, bodyFatPct };
}
