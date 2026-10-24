import Workout from '../models/Workout.js';

const pad = (n) => String(n).padStart(2, '0');

/** Local "YYYY-MM-DD" for a date-like value. */
export function dayKey(dateLike) {
  const d = new Date(dateLike);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function shiftKey(key, delta) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + delta));
}

function isNextDay(a, b) {
  return shiftKey(a, 1) === b;
}

/**
 * Derive streak stats from the set of days that have a logged workout.
 *
 * - `current`: consecutive days up to today. A one-day grace is allowed — if
 *   today has no workout yet but yesterday did, the run through yesterday still
 *   counts, so the streak doesn't "break" the instant midnight passes.
 * - `longest`: the longest consecutive run ever.
 * - `todayLogged`: whether today already has a workout.
 *
 * Pure so callers that already loaded workout days (e.g. the dashboard) can
 * reuse it without another query.
 */
export function streakFromDayKeys(keys, todayKey) {
  const set = new Set(keys);

  let longest = 0;
  let run = 0;
  let prev = null;
  for (const d of [...set].sort()) {
    run = prev && isNextDay(prev, d) ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = d;
  }

  const todayLogged = set.has(todayKey);
  let cursor = todayLogged ? todayKey : shiftKey(todayKey, -1);
  let current = 0;
  while (set.has(cursor)) {
    current += 1;
    cursor = shiftKey(cursor, -1);
  }

  return { current, longest, todayLogged };
}

/**
 * Data-access wrapper: load the owner's workout days and compute streak stats.
 */
export const streakService = {
  async compute(userId) {
    const workouts = await Workout.find({ userId }).select('performedAt').lean().exec();
    const keys = workouts.map((w) => dayKey(w.performedAt));
    return streakFromDayKeys(keys, dayKey(new Date()));
  },
};
