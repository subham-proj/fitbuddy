/**
 * Achievement catalog. Each badge is evaluated against stats derived from the
 * owner's logged workouts (see achievement.service.js). Thresholds use three
 * metrics we can compute truthfully today:
 *   - count:      number of logged workouts
 *   - streakDays: longest run of consecutive days with a workout
 *   - volumeKg:   total training volume lifted (Σ workout volumeKg)
 *
 * Distance- and PR-based badges are intentionally omitted until the data
 * model supports them, so no badge is ever shown on data we don't have.
 */
export const achievements = [
  { id: 'first-workout', name: 'First workout', mark: '1', metric: 'count', threshold: 1 },
  { id: 'workouts-10', name: '10 workouts', mark: '10', metric: 'count', threshold: 10 },
  { id: 'workouts-50', name: '50 workouts', mark: '50', metric: 'count', threshold: 50 },
  { id: 'workouts-100', name: '100 workouts', mark: '100', metric: 'count', threshold: 100 },
  { id: 'streak-7', name: '7-day streak', mark: '7', metric: 'streakDays', threshold: 7 },
  { id: 'streak-30', name: '30-day streak', mark: '30', metric: 'streakDays', threshold: 30 },
  { id: 'volume-100t', name: '100 t lifted', mark: '100t', metric: 'volumeKg', threshold: 100_000 },
  { id: 'volume-1000t', name: '1,000 t lifted', mark: '1kt', metric: 'volumeKg', threshold: 1_000_000 },
];
