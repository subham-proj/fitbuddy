import BodyMeasurement from '../models/BodyMeasurement.js';
import Workout from '../models/Workout.js';

const RANGE_DAYS = { '4W': 28, '3M': 90, '6M': 180, '1Y': 365 };
const RANGE_LABELS = {
  '4W': '4 weeks ago',
  '3M': '3 months ago',
  '6M': '6 months ago',
  '1Y': '1 year ago',
};
const HEATMAP_WEEKS = 12;
const PR_LIMIT = 6;

const pad = (n) => String(n).padStart(2, '0');

/** Local "YYYY-MM-DD" for a date-like value. */
function dayKey(dateLike) {
  const d = new Date(dateLike);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Shift a day key by whole days. */
function shiftKey(key, deltaDays) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + deltaDays));
}

/** Monday of the week containing `key`. */
function mondayOf(key) {
  const [y, m, d] = key.split('-').map(Number);
  const offset = (new Date(y, m - 1, d).getDay() + 6) % 7;
  return shiftKey(key, -offset);
}

const round1 = (n) => Math.round(n * 10) / 10;
const volumeOf = (ex = []) =>
  ex.reduce((t, e) => t + (e.sets || 0) * (e.reps || 0) * (e.weightKg || 0), 0);
const setsOf = (ex = []) => ex.reduce((t, e) => t + (e.sets || 0), 0);

/** Day volume → heatmap level 0–3 (a logged day is always at least 1). */
function heatLevel(volume, hasWorkout) {
  if (!hasWorkout) return 0;
  if (volume >= 6000) return 3;
  if (volume >= 2000) return 2;
  return 1;
}

/**
 * Composes the Progress page for a range from logged workouts and body
 * measurements. All stats are derived; nothing is stored precomputed.
 */
export const progressService = {
  async getProgress(userId, rawRange) {
    const range = RANGE_DAYS[rawRange] ? rawRange : '3M';
    const days = RANGE_DAYS[range];

    const today = dayKey(new Date());
    const fromKey = shiftKey(today, -(days - 1));
    const prevFromKey = shiftKey(fromKey, -days);

    const [workouts, measurements] = await Promise.all([
      Workout.find({ userId }).select('type exercises performedAt').lean().exec(),
      BodyMeasurement.find({ userId }).sort({ date: 1 }).lean().exec(),
    ]);

    // Annotate workouts with a day key + derived volume once.
    const marked = workouts.map((w) => ({
      day: dayKey(w.performedAt),
      type: w.type,
      volume: volumeOf(w.exercises),
      sets: setsOf(w.exercises),
      exercises: w.exercises || [],
    }));

    const inRange = marked.filter((w) => w.day >= fromKey && w.day <= today);
    const inPrev = marked.filter((w) => w.day >= prevFromKey && w.day < fromKey);

    // --- Summary: workouts + volume -------------------------------------
    const volCurrent = inRange.reduce((t, w) => t + w.volume, 0);
    const volPrev = inPrev.reduce((t, w) => t + w.volume, 0);
    const volumeDeltaPct =
      volPrev > 0 ? Math.round(((volCurrent - volPrev) / volPrev) * 100) : null;

    // --- Volume (sets) by workout type ----------------------------------
    const setsByType = {};
    for (const w of inRange) setsByType[w.type] = (setsByType[w.type] || 0) + w.sets;
    const maxSets = Math.max(0, ...Object.values(setsByType));
    const volumeByType = Object.entries(setsByType)
      .map(([type, sets]) => ({
        type,
        sets,
        pct: maxSets > 0 ? Math.round((sets / maxSets) * 100) : 0,
      }))
      .sort((a, b) => b.sets - a.sets);

    // --- Personal records: heaviest weight per exercise (all-time) ------
    const prMap = new Map();
    for (const w of marked) {
      for (const ex of w.exercises) {
        if (!ex.name || !(ex.weightKg > 0)) continue;
        const best = prMap.get(ex.name);
        if (!best || ex.weightKg > best.weightKg) {
          prMap.set(ex.name, { name: ex.name, weightKg: ex.weightKg, date: w.day });
        }
      }
    }
    const prs = [...prMap.values()]
      .sort((a, b) => b.weightKg - a.weightKg)
      .slice(0, PR_LIMIT);

    // --- Body weight series + body-fat ----------------------------------
    const rangeMeasurements = measurements.filter((m) => m.date >= fromKey);
    const weightValues = rangeMeasurements.map((m) => m.weightKg);
    const firstW = rangeMeasurements[0];
    const lastW = rangeMeasurements[rangeMeasurements.length - 1];
    const latestOverall = measurements[measurements.length - 1] ?? null;

    const fatPoints = rangeMeasurements.filter((m) => m.bodyFatPct != null);
    const firstFat = fatPoints[0];
    const lastFat = fatPoints[fatPoints.length - 1];

    const weightSeries = {
      values: weightValues,
      startLabel: RANGE_LABELS[range],
      start: firstW?.weightKg ?? null,
      end: lastW?.weightKg ?? null,
      diff: firstW && lastW ? round1(lastW.weightKg - firstW.weightKg) : null,
    };

    // --- Consistency heatmap: last 12 weeks -----------------------------
    const perDayVol = new Map();
    const perDayCount = new Map();
    for (const w of marked) {
      perDayVol.set(w.day, (perDayVol.get(w.day) || 0) + w.volume);
      perDayCount.set(w.day, (perDayCount.get(w.day) || 0) + 1);
    }
    const heatStart = shiftKey(mondayOf(today), -(HEATMAP_WEEKS - 1) * 7);
    const levels = [];
    let activeDays = 0;
    for (let i = 0; i < HEATMAP_WEEKS * 7; i += 1) {
      const key = shiftKey(heatStart, i);
      const has = perDayCount.has(key);
      if (has) activeDays += 1;
      levels.push(heatLevel(perDayVol.get(key) || 0, has));
    }

    return {
      range,
      summary: {
        weight: { value: latestOverall?.weightKg ?? null, deltaKg: weightSeries.diff },
        bodyFat: {
          value: (lastFat ?? latestOverall)?.bodyFatPct ?? null,
          deltaPts:
            firstFat && lastFat ? round1(lastFat.bodyFatPct - firstFat.bodyFatPct) : null,
        },
        workouts: { count: inRange.length, perWeek: round1(inRange.length / (days / 7)) },
        volume: { totalKg: Math.round(volCurrent), deltaPct: volumeDeltaPct },
      },
      weightSeries,
      prs,
      volumeByType,
      heatmap: { levels, weeks: HEATMAP_WEEKS, activeDays },
    };
  },
};
