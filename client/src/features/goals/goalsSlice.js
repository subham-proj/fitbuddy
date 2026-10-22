import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { goalsApi } from '../../services/goalsApi';

/**
 * Goals feature slice. CRUD over the owner's goals. Because at most one goal
 * is primary (the server enforces it), create/update re-fetch the list so the
 * primary flag stays consistent across cards rather than guessing locally.
 */

export const fetchGoals = createAsyncThunk('goals/fetchAll', async () => {
  const res = await goalsApi.list();
  return res.data;
});

export const saveGoal = createAsyncThunk(
  'goals/save',
  async ({ id, data }, { dispatch }) => {
    if (id) await goalsApi.update(id, data);
    else await goalsApi.create(data);
    await dispatch(fetchGoals()).unwrap();
  },
);

export const deleteGoal = createAsyncThunk('goals/delete', async (id) => {
  await goalsApi.remove(id);
  return id;
});

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

// Selectors
export const selectGoals = (state) => state.goals.items;
export const selectGoalsStatus = (state) => state.goals.status;
export const selectGoalsError = (state) => state.goals.error;
export const selectPrimaryGoal = (state) =>
  state.goals.items.find((g) => g.isPrimary) ?? null;

export default goalsSlice.reducer;
