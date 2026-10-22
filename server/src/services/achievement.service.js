import { achievements } from '../config/achievements.js';
import Workout from '../models/Workout.js';

/** UTC day key "YYYY-MM-DD" for a Date (workouts are stored at local noon). */
function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

/** Whether `b` (YYYY-MM-DD) is exactly one calendar day after `a`. */
function isNextDay(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const diff = Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad);
  return diff === 24 * 60 * 60 * 1000;
}

/** Longest run of consecutive days present in a set of day keys. */
function longestStreak(dayKeys) {
  const days = [...new Set(dayKeys)].sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const day of days) {
    run = prev && isNextDay(prev, day) ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = day;
  }
  return longest;
}

/** Human progress note for a locked badge, by metric. */
function lockedNote(metric, current, threshold) {
  if (metric === 'streakDays') return `${current} / ${threshold} days`;
  if (metric === 'volumeKg') {
    return `${Math.floor(current / 1000)} / ${threshold / 1000} t`;
  }
  return `${current} / ${threshold}`; // count
}

/**
 * Computes workout-derived stats and evaluates the achievement catalog against
 * them. Read-only: nothing is persisted — badges reflect current data on every
 * request, so they light up as the owner logs more.
 */
export const achievementService = {
  async evaluate(userId) {
    // Only the fields the stats need; volumeKg is a virtual off `exercises`.
    const workouts = await Workout.find({ userId })
      .select('exercises performedAt')
      .exec();

    const stats = {
      count: workouts.length,
      volumeKg: workouts.reduce((sum, w) => sum + (w.volumeKg || 0), 0),
      streakDays: longestStreak(workouts.map((w) => dayKey(w.performedAt))),
    };

    const items = achievements.map((def) => {
      const current = stats[def.metric] ?? 0;
      const earned = current >= def.threshold;
      return {
        id: def.id,
        mark: def.mark,
        name: def.name,
        earned,
        note: earned ? 'Earned' : lockedNote(def.metric, current, def.threshold),
      };
    });

    return { stats, items };
  },
};
