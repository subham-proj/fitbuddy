/**
 * Mock dashboard data. Mirrors the sample values in the design handoff
 * (figma/source/Main.dc.html `renderVals()`). Swap these for API-backed data
 * later — the components only depend on the shapes below.
 *
 * @typedef {'minutes' | 'steps' | 'kcal'} Metric
 */

export const user = {
  name: 'Alex',
  dateLabel: 'Thursday, 22 October',
  streakDays: 12,
};

/** Seven-day activity series, keyed by metric. */
export const weekSeries = {
  days: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
  minutes: { label: 'Active min', unit: 'min', values: [42, 64, 12, 38, 55, 31, 46] },
  steps: { label: 'Steps', unit: 'steps', values: [9120, 11840, 4210, 8760, 10230, 7650, 8432] },
  kcal: { label: 'Calories', unit: 'kcal', values: [2140, 2380, 1690, 2010, 2290, 1940, 1820] },
};

/** Metric toggle options for the 7-day chart. */
export const metricOptions = [
  { value: 'minutes', label: 'Active min' },
  { value: 'steps', label: 'Steps' },
  { value: 'kcal', label: 'Calories' },
];

/** "Today at a glance" stat cards. */
export const stats = [
  { id: 'steps', label: 'Steps', value: '8,432', unit: '/ 10,000', badge: '84%', pct: 84, color: 'var(--color-ink)' },
  { id: 'active', label: 'Active minutes', value: '46', unit: '/ 60 min', badge: '77%', pct: 77, color: 'var(--color-orange)' },
  { id: 'calories', label: 'Calories burned', value: '1,820', unit: 'kcal', badge: '+6%', pct: 72, color: 'var(--color-lime)' },
  { id: 'rhr', label: 'Resting heart rate', value: '62', unit: 'bpm', badge: '−2', pct: 55, color: 'var(--color-violet)' },
];

/** Today's activity rings — each is [value, goal]. */
export const rings = {
  move: [504, 600], // kcal
  exercise: [46, 60], // min
  stand: [9, 12], // hrs
};

export const ringLegend = [
  { id: 'move', label: 'Move', value: '504 / 600 kcal', color: 'var(--color-lime)' },
  { id: 'exercise', label: 'Exercise', value: '46 / 60 min', color: 'var(--color-orange)' },
  { id: 'stand', label: 'Stand', value: '9 / 12 hrs', color: 'var(--color-violet)' },
];

/** Recent workouts list. */
export const recentWorkouts = [
  { id: 'w1', initials: 'UB', color: 'var(--color-chip-lime)', name: 'Upper body strength', meta: '52 min · 6 exercises · 8,450 kg volume', kcal: '412 kcal', when: 'Yesterday' },
  { id: 'w2', initials: 'RN', color: 'var(--color-chip-orange)', name: 'Easy run', meta: '34 min · 5.2 km · 6:32 /km', kcal: '338 kcal', when: 'Tue' },
  { id: 'w3', initials: 'YG', color: 'var(--color-chip-violet)', name: 'Mobility flow', meta: '25 min · Recovery', kcal: '96 kcal', when: 'Mon' },
  { id: 'w4', initials: 'LB', color: 'var(--color-chip-lime)', name: 'Lower body strength', meta: '58 min · 5 exercises · 11,200 kg volume', kcal: '465 kcal', when: 'Sat' },
];

/** Weekly goal summary. */
export const weeklyGoal = {
  done: 4,
  target: 5,
  upNext: {
    title: 'Lower body · Hypertrophy',
    detail: 'Planned for today, 6:30 PM · 50 min',
  },
};
