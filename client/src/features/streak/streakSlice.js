import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { streakApi } from '../../services/streakApi';

/**
 * App-wide workout streak shown in the sidebar on every page.
 */
export const fetchStreak = createAsyncThunk('streak/fetch', async () => {
  const res = await streakApi.get();
  return res.data; // { current, longest, todayLogged }
});

const initialState = {
  current: 0,
  longest: 0,
  todayLogged: false,
  status: 'idle',
};

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreak.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStreak.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload.current;
        state.longest = action.payload.longest;
        state.todayLogged = action.payload.todayLogged;
      })
      .addCase(fetchStreak.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectStreak = (state) => state.streak;

export default streakSlice.reducer;
