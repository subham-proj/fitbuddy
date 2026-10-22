import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { settingsApi } from '../../services/settingsApi';

/**
 * Settings feature slice. Loads the owner's settings (profile, units,
 * targets) and the watch sync status, and saves edits back.
 */

export const fetchSettings = createAsyncThunk('settings/fetch', async () => {
  const res = await settingsApi.get();
  return res.data;
});

export const saveSettings = createAsyncThunk('settings/save', async (settings) => {
  const res = await settingsApi.update(settings);
  return res.data;
});

export const fetchWatchStatus = createAsyncThunk(
  'settings/watchStatus',
  async () => {
    const res = await settingsApi.watchStatus();
    return res.data;
  },
);

const initialState = {
  data: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  saving: false,
  saveError: null,
  watch: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveSettings.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.error.message;
      })
      .addCase(fetchWatchStatus.fulfilled, (state, action) => {
        state.watch = action.payload;
      });
  },
});

// Selectors
export const selectSettings = (state) => state.settings.data;
export const selectSettingsStatus = (state) => state.settings.status;
export const selectSettingsError = (state) => state.settings.error;
export const selectSettingsSaving = (state) => state.settings.saving;
export const selectSettingsSaveError = (state) => state.settings.saveError;
export const selectWatchStatus = (state) => state.settings.watch;

export default settingsSlice.reducer;
