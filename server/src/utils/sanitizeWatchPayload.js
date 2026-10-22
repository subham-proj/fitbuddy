import { HttpError } from './HttpError.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Coerce to a finite number, or undefined if it isn't one. */
function num(v) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Coerce to an array of finite numbers, truncated to `max` entries. */
function numArray(v, max) {
  if (!Array.isArray(v)) return [];
  const out = [];
  for (let i = 0; i < v.length && out.length < max; i += 1) {
    const n = num(v[i]);
    if (n !== undefined) out.push(n);
  }
  return out;
}

/** Keep only the listed numeric keys from an object (undefined-safe). */
function numFields(obj, keys) {
  if (!obj || typeof obj !== 'object') return undefined;
  const out = {};
  for (const k of keys) {
    const n = num(obj[k]);
    if (n !== undefined) out[k] = n;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Validate and normalize a watch sync payload into exactly the shape we store.
 * Unknown fields are dropped and arrays are hard-capped, so a malformed or
 * hostile payload can't bloat the database. Throws HttpError(400) on a bad date.
 */
export function sanitizeWatchPayload(d) {
  if (!d || typeof d !== 'object') {
    throw new HttpError(400, 'Payload must be a JSON object');
  }
  if (typeof d.date !== 'string' || !DATE_RE.test(d.date)) {
    throw new HttpError(400, 'Payload `date` must be a YYYY-MM-DD string');
  }

  const sleepSrc = d.sleep && typeof d.sleep === 'object' ? d.sleep : {};
  const stages = Array.isArray(sleepSrc.stages)
    ? sleepSrc.stages.slice(0, 500).map((s) => ({
        model: num(s?.model),
        start: num(s?.start),
        stop: num(s?.stop),
      }))
    : [];

  return {
    date: d.date,
    syncedAt: num(d.syncedAt),
    steps: numFields(d.steps, ['current', 'target']),
    calories: numFields(d.calories, ['current', 'target']),
    heartRate: {
      last: num(d.heartRate?.last),
      current: num(d.heartRate?.current),
      today: numArray(d.heartRate?.today, 1440), // one per minute of day
    },
    sleep: {
      basic: numFields(sleepSrc.basic, [
        'score',
        'deepMin',
        'startTime',
        'endTime',
      ]),
      totalMin: num(sleepSrc.totalMin),
      stageModel:
        sleepSrc.stageModel && typeof sleepSrc.stageModel === 'object'
          ? sleepSrc.stageModel
          : undefined,
      stages,
      hr: numArray(sleepSrc.hr, 1440),
    },
    stress: numFields(d.stress, ['current', 'time']),
    spo2: {
      current: num(d.spo2?.current),
      time: num(d.spo2?.time),
      hourAvgofDay: numArray(d.spo2?.hourAvgofDay, 24),
    },
  };
}
