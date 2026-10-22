/**
 * Daily nutrition targets.
 *
 * TEMPORARY: these are fixed defaults. They are really per-user settings and
 * will move to a user/settings resource when the Settings page is built; the
 * nutrition day view reads them from here so there is a single swap point.
 */
export const nutritionGoals = {
  calories: 2300, // kcal/day
  macros: {
    protein: 150, // g
    carbs: 250,
    fat: 75,
    fibre: 30,
  },
  water: {
    goalGlasses: 8,
    glassMl: 250,
  },
};
