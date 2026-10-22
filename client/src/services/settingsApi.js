import { api } from './api';

/**
 * Settings client. The owner's profile, units and targets live at
 * `/api/settings`; watch sync status is a read off the metrics pipeline.
 */
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (settings) => api.put('/settings', settings),
  watchStatus: () => api.get('/watch/status'),
};
