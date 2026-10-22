import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { achievementsApi } from '../../services/goalsApi';

/**
 * Achievements slice (read-only). Milestone badges are derived server-side
 * from workout stats, so this just fetches and caches the evaluated list.
 */

export const fetchAchievements = createAsyncThunk(
  'achievements/fetch',
  async () => {
    const res = await achievementsApi.list();
    return res.data; // { stats, items }
  },
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectAchievements = (state) => state.achievements.items;
export const selectAchievementsStatus = (state) => state.achievements.status;

export default achievementsSlice.reducer;
