import { configureStore } from '@reduxjs/toolkit';

import dashboardReducer from '../features/dashboard/dashboardSlice';
import achievementsReducer from '../features/goals/achievementsSlice';
import goalsReducer from '../features/goals/goalsSlice';
import nutritionReducer from '../features/nutrition/nutritionSlice';
import progressReducer from '../features/progress/progressSlice';
import settingsReducer from '../features/settings/settingsSlice';
import streakReducer from '../features/streak/streakSlice';
import planReducer from '../features/workouts/planSlice';
import workoutsReducer from '../features/workouts/workoutsSlice';

/**
 * The application's single Redux store.
 *
 * Register feature reducers here. Each feature owns a slice and exposes its
 * reducer as the default export (see `src/features/*`). Every page is now
 * backed by the API through these slices.
 */
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    workouts: workoutsReducer,
    plan: planReducer,
    nutrition: nutritionReducer,
    goals: goalsReducer,
    achievements: achievementsReducer,
    settings: settingsReducer,
    progress: progressReducer,
    streak: streakReducer,
  },
});
