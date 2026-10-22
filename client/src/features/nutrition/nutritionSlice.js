import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { nutritionApi } from '../../services/nutritionApi';
import { toDateInputValue } from '../../utils/format';

/**
 * Nutrition feature slice. The server composes the whole day view (totals,
 * grouped meals, water, goals), so after any mutation we re-fetch that day
 * rather than re-summing on the client — one source of truth for the numbers.
 */

export const fetchNutritionDay = createAsyncThunk(
  'nutrition/fetchDay',
  async (date) => {
    const res = await nutritionApi.getDay(date);
    return res.data;
  },
);

export const logFood = createAsyncThunk(
  'nutrition/logFood',
  async (entry, { dispatch }) => {
    await nutritionApi.logFood(entry);
    // Re-fetch so calorie/macro totals and meal grouping stay authoritative.
    await dispatch(fetchNutritionDay(entry.date)).unwrap();
  },
);

export const deleteFood = createAsyncThunk(
  'nutrition/deleteFood',
  async ({ id, date }, { dispatch }) => {
    await nutritionApi.deleteFood(id);
    await dispatch(fetchNutritionDay(date)).unwrap();
  },
);

export const setWater = createAsyncThunk(
  'nutrition/setWater',
  async ({ date, glasses }) => {
    const res = await nutritionApi.setWater(date, glasses);
    return res.data; // { glasses }
  },
);

const initialState = {
  date: toDateInputValue(), // YYYY-MM-DD, today in local time
  day: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    // Change the viewed day; the page effect fetches it.
    setDate(state, action) {
      state.date = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutritionDay.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNutritionDay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.date = action.payload.date;
        state.day = action.payload;
      })
      .addCase(fetchNutritionDay.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Optimistic water: reflect the tap immediately, reconcile on response.
      .addCase(setWater.pending, (state, action) => {
        if (state.day && state.day.date === action.meta.arg.date) {
          state.day.water.glasses = action.meta.arg.glasses;
        }
      })
      .addCase(setWater.fulfilled, (state, action) => {
        if (state.day) state.day.water.glasses = action.payload.glasses;
      })
      .addCase(setWater.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setDate } = nutritionSlice.actions;

// Selectors
export const selectNutritionDate = (state) => state.nutrition.date;
export const selectNutritionDay = (state) => state.nutrition.day;
export const selectNutritionStatus = (state) => state.nutrition.status;
export const selectNutritionError = (state) => state.nutrition.error;

export default nutritionSlice.reducer;
