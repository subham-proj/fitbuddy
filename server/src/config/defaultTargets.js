/**
 * Default daily targets for a new user. These seed a user's settings and are
 * the fallback when settings haven't been saved yet. Activity targets drive
 * the dashboard rings; the nutrition targets drive the Nutrition page (which
 * reads them via the settings service, not from here directly).
 */
export const defaultTargets = {
  // Activity
  steps: 10000,
  moveKcal: 600,
  exerciseMin: 60,
  // Nutrition
  calories: 2300,
  protein: 150,
  carbs: 250,
  fat: 75,
  fibre: 30,
  waterGlasses: 8,
  glassMl: 250,
};

export const ACTIVITY_LEVELS = ['Lightly active', 'Active', 'Very active'];
