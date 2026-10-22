import { configureStore } from '@reduxjs/toolkit';

import workoutsReducer from '../features/workouts/workoutsSlice';

/**
 * The application's single Redux store.
 *
 * Register feature reducers here. Each feature owns a slice and exposes its
 * reducer as the default export (see `src/features/*`).
 *
 * Note: the dashboard UI currently reads from mock fixtures (`src/mock/`),
 * not the store. The workouts slice is wired for when the API is connected.
 */
export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
});
