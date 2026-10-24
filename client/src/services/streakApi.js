import { api } from './api';

/**
 * Streak client. The workout streak is derived server-side; the sidebar shows
 * it on every page.
 */
export const streakApi = {
  get: () => api.get('/streak'),
};
