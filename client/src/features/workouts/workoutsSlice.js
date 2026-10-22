import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { workoutsApi } from '../../services/workoutsApi';

/**
 * Workouts feature slice. Demonstrates the async data pattern with
 * `createAsyncThunk`: thunks call the API service, reducers track
 * loading/error state. Replicate this for other server-backed resources.
 */

export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchAll',
  async () => {
    const res = await workoutsApi.list();
    return res.data;
  },
);

export const createWorkout = createAsyncThunk(
  'workouts/create',
  async (workout) => {
    const res = await workoutsApi.create(workout);
    return res.data;
  },
);

export const deleteWorkout = createAsyncThunk(
  'workouts/delete',
  async (id) => {
    await workoutsApi.remove(id);
    return id;
  },
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkouts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.items = state.items.filter((w) => w.id !== action.payload);
      });
  },
});

// Selectors
export const selectWorkouts = (state) => state.workouts.items;
export const selectWorkoutsStatus = (state) => state.workouts.status;
export const selectWorkoutsError = (state) => state.workouts.error;

export default workoutsSlice.reducer;
