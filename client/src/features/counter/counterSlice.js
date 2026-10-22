import { createSlice } from '@reduxjs/toolkit';

/**
 * Example slice demonstrating the Redux Toolkit pattern used across features.
 * Replace or remove this once real feature slices exist.
 */
const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: () => initialState,
  },
});

export const { increment, decrement, incrementByAmount, reset } =
  counterSlice.actions;

// Selectors
export const selectCount = (state) => state.counter.value;

export default counterSlice.reducer;
