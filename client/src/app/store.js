import { configureStore } from '@reduxjs/toolkit';

import achievementsReducer from '../features/goals/achievementsSlice';
import goalsReducer from '../features/goals/goalsSlice';
import nutritionReducer from '../features/nutrition/nutritionSlice';
import planReducer from '../features/workouts/planSlice';
import workoutsReducer from '../features/workouts/workoutsSlice';

/**
 * The application's single Redux store.
 *
 * Register feature reducers here. Each feature owns a slice and exposes its
 * reducer as the default export (see `src/features/*`).
 *
 * Pages are migrated off the mock fixtures (`src/mock/`) onto these slices one
 * at a time; any page still on mock data simply doesn't read from the store.
 */
export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    plan: planReducer,
    nutrition: nutritionReducer,
    goals: goalsReducer,
    achievements: achievementsReducer,
  },
});
