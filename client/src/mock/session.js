/**
 * Mock data for the live workout session. Mirrors
 * figma/source/Workout-Session.dc.html.
 */

export const session = {
  name: 'Lower body hypertrophy',
  elapsed: '24:18',
};

/** Exercises in the session. `status`: done | current | next. */
export const exercises = [
  { id: 'e1', name: 'Back squat', meta: '4 sets · 80 kg', status: 'done', mark: '✓' },
  { id: 'e2', name: 'Leg press', meta: '3 sets · 160 kg', status: 'done', mark: '✓' },
  { id: 'e3', name: 'Romanian deadlift', meta: '2 of 4 sets', status: 'current', mark: '3' },
  { id: 'e4', name: 'Bulgarian split squat', meta: '3 × 10 each leg', status: 'next', mark: '4' },
  { id: 'e5', name: 'Seated calf raise', meta: '4 × 15', status: 'next', mark: '5' },
];

export const doneCount = 2;
export const totalExercises = exercises.length;

/** Current exercise detail + its set table. `done` is the default per-set state. */
export const currentExercise = {
  index: 3,
  total: 5,
  name: 'Romanian deadlift',
  target: 'Target 4 × 8–10 · Rest 90 s · Hamstrings, glutes',
  nextName: 'Bulgarian split squat',
};

export const sets = [
  { n: 1, previous: '60 kg × 10', kg: '62.5', reps: '10', done: true },
  { n: 2, previous: '60 kg × 10', kg: '62.5', reps: '9', done: true },
  { n: 3, previous: '60 kg × 9', kg: '62.5', reps: '9', done: false },
  { n: 4, previous: '60 kg × 8', kg: '62.5', reps: '8', done: false },
];
