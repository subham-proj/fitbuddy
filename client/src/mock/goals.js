/**
 * Mock data for the Goals screen. Mirrors figma/source/Goals.dc.html.
 *
 * @typedef {'On track' | 'Behind' | 'Done'} GoalStatus
 */

export const mainGoal = {
  eyebrow: 'Main goal',
  title: 'Reach 70 kg by 31 December',
  detail: '72.4 kg now · 2.4 kg to go · 10 weeks left · on track',
  start: 'Start 78.5 kg',
  target: 'Target 70 kg',
  pct: 69,
};

export const goalTabs = ['Active', 'Completed'];

/** Status → bar fill color. "On track"/"Behind" also drive the badge tone. */
export const goalStatusColor = {
  'On track': 'var(--color-ink)',
  Behind: 'var(--color-orange)',
  Done: 'var(--color-olive)',
};

export const goals = [
  { id: 'g1', area: 'Strength', title: 'Bench press 90 kg', progress: '80 / 90 kg', pct: 89, due: 'Due 15 Dec', status: 'On track' },
  { id: 'g2', area: 'Cardio', title: 'Run 5 km under 25:00', progress: 'Best 26:12', pct: 70, due: 'Due 30 Nov', status: 'Behind' },
  { id: 'g3', area: 'Habit', title: '5 workouts every week', progress: '4 / 5 this week', pct: 80, due: 'Weekly', status: 'On track' },
  { id: 'g4', area: 'Nutrition', title: '150 g protein daily', progress: '5 of 7 days hit', pct: 71, due: 'Weekly', status: 'On track' },
  { id: 'g5', area: 'Activity', title: '10,000 steps a day', progress: 'Avg 8,606', pct: 86, due: 'Daily', status: 'Behind' },
  { id: 'g6', area: 'Recovery', title: 'Sleep 7 h+ a night', progress: 'Avg 7 h 05 m', pct: 100, due: 'Daily', status: 'On track' },
  { id: 'g7', area: 'Strength', title: 'Squat 100 kg', progress: '100 / 100 kg', pct: 100, due: 'Done 17 Oct', status: 'Done' },
  { id: 'g8', area: 'Strength', title: '10 strict pull-ups', progress: '14 / 10 reps', pct: 100, due: 'Done 8 Oct', status: 'Done' },
];

export const milestones = [
  { id: 'm1', mark: '1', name: 'First workout', note: 'Earned 2 Jun', earned: true },
  { id: 'm2', mark: '7', name: '7-day streak', note: 'Earned 14 Jul', earned: true },
  { id: 'm3', mark: '100', name: '100 km run', note: 'Earned 30 Aug', earned: true },
  { id: 'm4', mark: '50', name: '50 workouts', note: 'Earned 2 Oct', earned: true },
  { id: 'm5', mark: 'PR', name: 'Squat 100 kg', note: 'Earned 17 Oct', earned: true },
  { id: 'm6', mark: '30', name: '30-day streak', note: '12 / 30 days', earned: false },
  { id: 'm7', mark: 'T', name: '1,000 t lifted', note: '312 / 1,000 t', earned: false },
  { id: 'm8', mark: '100', name: '100 workouts', note: '46 / 100', earned: false },
];
