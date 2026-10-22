import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { dashboardApi } from '../../services/dashboardApi';

/**
 * Dashboard slice (read-only). Holds the composed landing-page view.
 */
export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  const res = await dashboardApi.get();
  return res.data;
});

const initialState = {
  data: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectDashboard = (state) => state.dashboard.data;
export const selectDashboardStatus = (state) => state.dashboard.status;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;
