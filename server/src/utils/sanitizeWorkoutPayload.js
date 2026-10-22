import { HttpError } from './HttpError.js';

const TYPES = ['strength', 'cardio', 'mobility', 'other'];
const MAX_EXERCISES = 60;
const MAX_STR = 200;

/** Coerce to a non-negative finite number, or `fallback` if it isn't one. */
function nonNegNum(v, fallback = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Trim a string and cap its length; returns '' for non-strings. */
function str(v, max = MAX_STR) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/** Normalize one exercise row into exactly the fields we store. */
function sanitizeExercise(raw) {
  const name = str(raw?.name, 120);
  return {
    name,
    sets: nonNegNum(raw?.sets),
    reps: nonNegNum(raw?.reps),
    weightKg: nonNegNum(raw?.weightKg),
  };
}

/**
 * Validate and normalize a workout payload (create/update) into exactly the
 * shape we persist. Unknown fields are dropped and arrays are capped so a
 * malformed client can't bloat a document. Throws HttpError(400) when the
 * title — the one truly required field — is missing.
 *
 * `volumeKg` is intentionally not accepted: it is a derived virtual on the
 * model and must never be set by a client.
 */
export function sanitizeWorkoutPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }

  const title = str(body.title);
  if (!title) {
    throw new HttpError(400, 'A workout title is required');
  }

  const type = TYPES.includes(body.type) ? body.type : 'other';

  const exercises = Array.isArray(body.exercises)
    ? body.exercises
        .slice(0, MAX_EXERCISES)
        .map(sanitizeExercise)
        .filter((ex) => ex.name) // drop rows with no name
    : [];

  // Accept a parseable date; otherwise let the schema default (now) apply.
  const performedAt = body.performedAt ? new Date(body.performedAt) : undefined;
  const hasValidDate =
    performedAt && !Number.isNaN(performedAt.getTime());

  return {
    title,
    type,
    durationMin: nonNegNum(body.durationMin),
    caloriesBurned: nonNegNum(body.caloriesBurned),
    notes: str(body.notes, 2000),
    exercises,
    ...(hasValidDate ? { performedAt } : {}),
  };
}
