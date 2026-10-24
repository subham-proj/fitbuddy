import DailyMetric from '../models/DailyMetric.js';
import Workout from '../models/Workout.js';
import { planService } from './plan.service.js';
import { settingsService } from './settings.service.js';
import { streakFromDayKeys } from './streak.service.js';

const pad = (n) => String(n).padStart(2, '0');
const dayKey = (dateLike) => {
  const d = new Date(dateLike);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const shiftKey = (key, delta) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + delta));
};
const mondayOf = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  const offset = (new Date(y, m - 1, d).getDay() + 6) % 7;
  return shiftKey(key, -offset);
};
const weekdayShort = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short' });
};
const volumeOf = (ex = []) =>
  ex.reduce((t, e) => t + (e.sets || 0) * (e.reps || 0) * (e.weightKg || 0), 0);

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/**
 * Composes the dashboard from every data source: watch metrics (today's steps,
 * calories, resting HR), logged workouts (active minutes, recent list, 7-day
 * series, streak), the weekly plan, and the user's targets. One read for the
 * whole landing page.
 */
export const dashboardService = {
  async getDashboard(userId) {
    const today = dayKey(new Date());
    const weekFrom = shiftKey(today, -6);
    const monday = mondayOf(today);

    const [targets, settings, todayMetric, weekMetrics, workouts, planWeek] =
      await Promise.all([
        settingsService.getTargets(userId),
        settingsService.get(userId),
        DailyMetric.findOne({ userId, date: today })
          .select('steps calories heartRate')
          .lean()
          .exec(),
        DailyMetric.find({ userId, date: { $gte: weekFrom, $lte: today } })
          .select('date steps calories')
          .lean()
          .exec(),
        Workout.find({ userId })
          .select('title type exercises durationMin caloriesBurned performedAt')
          .sort({ performedAt: -1 })
          .lean()
          .exec(),
        planService.findRange(userId, monday, shiftKey(monday, 6)),
      ]);

    // Index workouts by day for minutes/streak/series.
    const minutesByDay = new Map();
    const daySet = new Set();
    for (const w of workouts) {
      const key = dayKey(w.performedAt);
      daySet.add(key);
      minutesByDay.set(key, (minutesByDay.get(key) || 0) + num(w.durationMin));
    }
    const metricByDay = new Map(weekMetrics.map((m) => [m.date, m]));

    // --- Today's stats --------------------------------------------------
    const steps = num(todayMetric?.steps?.current);
    const calories = num(todayMetric?.calories?.current);
    const activeMinutes = minutesByDay.get(today) || 0;
    const restingHr = todayMetric?.heartRate?.summary?.min ?? null;

    // --- 7-day series ---------------------------------------------------
    const days = [];
    const stepsSeries = [];
    const kcalSeries = [];
    const minutesSeries = [];
    for (let i = 6; i >= 0; i -= 1) {
      const key = shiftKey(today, -i);
      const m = metricByDay.get(key);
      days.push(weekdayShort(key));
      stepsSeries.push(num(m?.steps?.current));
      kcalSeries.push(num(m?.calories?.current));
      minutesSeries.push(minutesByDay.get(key) || 0);
    }

    // --- Recent workouts ------------------------------------------------
    const recentWorkouts = workouts.slice(0, 4).map((w) => ({
      id: String(w._id),
      title: w.title,
      type: w.type,
      durationMin: num(w.durationMin),
      volumeKg: volumeOf(w.exercises),
      caloriesBurned: num(w.caloriesBurned),
      performedAt: w.performedAt,
    }));

    // --- Weekly goal (from the plan) ------------------------------------
    const planned = planWeek.filter((p) => !p.isRest);
    const doneCount = planned.filter((p) => p.completed).length;
    const upNextDoc = planned
      .filter((p) => !p.completed && p.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    const upNext = upNextDoc
      ? {
          title: upNextDoc.title,
          detail: `${weekdayShort(upNextDoc.date)}${upNextDoc.time ? ` · ${upNextDoc.time}` : ''}`,
        }
      : null;

    const streak = streakFromDayKeys([...daySet], today);

    return {
      user: { name: settings.profile?.name || '', streakDays: streak.current },
      stats: {
        steps: { value: steps, target: targets.steps },
        activeMinutes: { value: activeMinutes, target: targets.exerciseMin },
        caloriesBurned: { value: calories, target: targets.moveKcal },
        restingHr: { value: restingHr },
      },
      rings: {
        move: [calories, targets.moveKcal],
        exercise: [activeMinutes, targets.exerciseMin],
        steps: [steps, targets.steps],
      },
      week: { days, minutes: minutesSeries, steps: stepsSeries, kcal: kcalSeries },
      recentWorkouts,
      weeklyGoal: { done: doneCount, target: planned.length, upNext },
    };
  },
};
