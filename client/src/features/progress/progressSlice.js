import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { progressApi } from '../../services/progressApi';

/**
 * Progress feature slice. Holds the composed view for the selected range.
 * Logging a measurement re-fetches so the trend, stats and settings weight
 * stay consistent.
 */

export const fetchProgress = createAsyncThunk('progress/fetch', async (range) => {
  const res = await progressApi.get(range);
  return res.data;
});

export const logMeasurement = createAsyncThunk(
  'progress/logMeasurement',
  async (measurement, { getState, dispatch }) => {
    await progressApi.logMeasurement(measurement);
    await dispatch(fetchProgress(getState().progress.range)).unwrap();
  },
);

const initialState = {
  range: '3M',
  data: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setRange(state, action) {
      state.range = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.range = action.payload.range;
        state.data = action.payload;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setRange } = progressSlice.actions;

// Selectors
export const selectProgressRange = (state) => state.progress.range;
export const selectProgress = (state) => state.progress.data;
export const selectProgressStatus = (state) => state.progress.status;
export const selectProgressError = (state) => state.progress.error;

export default progressSlice.reducer;
