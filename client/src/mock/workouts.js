/**
 * Mock data for the Workouts screen. Mirrors figma/source/Workouts.dc.html.
 *
 * @typedef {'Strength' | 'Cardio' | 'Mobility'} WorkoutType
 * @typedef {'done' | 'today' | 'planned' | 'rest'} DayStatus
 */

/** This week's plan. `status` drives the WeekDayCard appearance. */
export const week = [
  { day: 'Mon', date: '19', name: 'Mobility flow', status: 'done', statusLabel: 'Done' },
  { day: 'Tue', date: '20', name: 'Easy run', status: 'done', statusLabel: 'Done' },
  { day: 'Wed', date: '21', name: 'Upper body strength', status: 'done', statusLabel: 'Done' },
  { day: 'Thu', date: '22', name: 'Lower body hypertrophy', status: 'today', statusLabel: 'Today · 6:30 PM' },
  { day: 'Fri', date: '23', name: 'Rest', status: 'rest', statusLabel: 'Rest day' },
  { day: 'Sat', date: '24', name: 'Interval sprints', status: 'planned', statusLabel: 'Planned' },
  { day: 'Sun', date: '25', name: 'Rest', status: 'rest', statusLabel: 'Rest day' },
];

export const weekSummary = '4 of 5 planned sessions done';

/** Type filter options. */
export const typeFilters = ['All', 'Strength', 'Cardio', 'Mobility'];

/** Color chip per workout type. */
export const typeChipColor = {
  Strength: 'var(--color-chip-lime)',
  Cardio: 'var(--color-chip-orange)',
  Mobility: 'var(--color-chip-violet)',
};

/** Saved workout templates. */
export const templates = [
  { id: 't1', type: 'Strength', name: 'Upper body strength', meta: '6 exercises · 24 sets', focus: 'Chest · Back · Shoulders · Arms', duration: '55 min' },
  { id: 't2', type: 'Strength', name: 'Lower body hypertrophy', meta: '5 exercises · 20 sets', focus: 'Quads · Hamstrings · Glutes', duration: '50 min' },
  { id: 't3', type: 'Strength', name: 'Full body 5×5', meta: '3 exercises · 15 sets', focus: 'Squat · Bench · Row', duration: '45 min' },
  { id: 't4', type: 'Cardio', name: 'Easy run', meta: 'Zone 2 · 5 km target', focus: 'Aerobic base', duration: '35 min' },
  { id: 't5', type: 'Cardio', name: 'Interval sprints', meta: '8 × 400 m · 90 s rest', focus: 'Speed · VO2 max', duration: '30 min' },
  { id: 't6', type: 'Mobility', name: 'Mobility flow', meta: '12 movements', focus: 'Hips · Spine · Shoulders', duration: '25 min' },
];

/** Workout history rows. */
export const history = [
  { id: 'h1', date: 'Wed, 21 Oct', name: 'Upper body strength', duration: '52 min', volume: '8,450 kg', kcal: '412 kcal', prs: '1' },
  { id: 'h2', date: 'Tue, 20 Oct', name: 'Easy run', duration: '34 min', volume: '5.2 km', kcal: '338 kcal', prs: '—' },
  { id: 'h3', date: 'Mon, 19 Oct', name: 'Mobility flow', duration: '25 min', volume: '—', kcal: '96 kcal', prs: '—' },
  { id: 'h4', date: 'Sat, 17 Oct', name: 'Lower body hypertrophy', duration: '58 min', volume: '11,200 kg', kcal: '465 kcal', prs: '2' },
  { id: 'h5', date: 'Fri, 16 Oct', name: 'Interval sprints', duration: '29 min', volume: '3.2 km', kcal: '301 kcal', prs: '—' },
  { id: 'h6', date: 'Wed, 14 Oct', name: 'Upper body strength', duration: '55 min', volume: '8,120 kg', kcal: '420 kcal', prs: '—' },
];
