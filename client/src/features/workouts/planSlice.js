import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { planApi } from '../../services/planApi';

/**
 * Weekly-plan slice. Holds the plan entries for the currently viewed range
 * (one per day). The Workouts page computes the week's date range and derives
 * each day's status from these entries.
 */

export const fetchPlan = createAsyncThunk(
  'plan/fetch',
  async ({ from, to }) => {
    const res = await planApi.list(from, to);
    return res.data;
  },
);

export const setPlanDay = createAsyncThunk(
  'plan/setDay',
  async ({ date, data }) => {
    const res = await planApi.setDay(date, data);
    return res.data;
  },
);

export const removePlanDay = createAsyncThunk(
  'plan/removeDay',
  async (date) => {
    await planApi.removeDay(date);
    return date;
  },
);

/** Replace the entry for a date in-place, or append it. */
function upsert(items, entry) {
  const i = items.findIndex((e) => e.date === entry.date);
  if (i === -1) items.push(entry);
  else items[i] = entry;
}

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlan.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(setPlanDay.fulfilled, (state, action) => {
        upsert(state.items, action.payload);
      })
      .addCase(removePlanDay.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.date !== action.payload);
      });
  },
});

// Selectors
export const selectPlanItems = (state) => state.plan.items;
export const selectPlanStatus = (state) => state.plan.status;
export const selectPlanError = (state) => state.plan.error;

export default planSlice.reducer;
