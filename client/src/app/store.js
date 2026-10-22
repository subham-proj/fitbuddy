import { configureStore } from '@reduxjs/toolkit';

import counterReducer from '../features/counter/counterSlice';
import workoutsReducer from '../features/workouts/workoutsSlice';

/**
 * The application's single Redux store.
 *
 * Register feature reducers here. Each feature owns a slice and exposes its
 * reducer as the default export (see `src/features/*`).
 */
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    workouts: workoutsReducer,
  },
});
