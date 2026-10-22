import { ACTIVITY_LEVELS, defaultTargets } from '../config/defaultTargets.js';
import { HttpError } from './HttpError.js';

/** Non-negative finite number, or `fallback`. */
function nonNegNum(v, fallback = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Positive finite number (>= 1), or `fallback`. */
function posNum(v, fallback) {
  const n = nonNegNum(v, fallback);
  return n >= 1 ? n : fallback;
}

/** Finite number, or null (for optional measurements). */
function numOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(v, max = 160) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Validate and normalize a settings payload into exactly the stored shape.
 * The client sends the whole settings object; each subsection is replaced
 * wholesale, so every field is defaulted here to stay internally consistent.
 */
export function sanitizeSettingsPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }

  const t = body.targets ?? {};
  const p = body.profile ?? {};
  const b = body.bodyMetrics ?? {};
  const d = defaultTargets;

  return {
    units: body.units === 'imperial' ? 'imperial' : 'metric',
    profile: {
      name: str(p.name),
      email: str(p.email, 200),
      yearOfBirth: numOrNull(p.yearOfBirth),
      activityLevel: ACTIVITY_LEVELS.includes(p.activityLevel)
        ? p.activityLevel
        : 'Active',
    },
    bodyMetrics: {
      heightCm: numOrNull(b.heightCm),
      weightKg: numOrNull(b.weightKg),
    },
    targets: {
      steps: nonNegNum(t.steps, d.steps),
      moveKcal: nonNegNum(t.moveKcal, d.moveKcal),
      exerciseMin: nonNegNum(t.exerciseMin, d.exerciseMin),
      calories: nonNegNum(t.calories, d.calories),
      protein: nonNegNum(t.protein, d.protein),
      carbs: nonNegNum(t.carbs, d.carbs),
      fat: nonNegNum(t.fat, d.fat),
      fibre: nonNegNum(t.fibre, d.fibre),
      waterGlasses: posNum(t.waterGlasses, d.waterGlasses),
      glassMl: posNum(t.glassMl, d.glassMl),
    },
  };
}
