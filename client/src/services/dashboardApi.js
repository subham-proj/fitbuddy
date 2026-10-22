import { api } from './api';

/**
 * Dashboard client. The landing-page view is composed server-side from watch
 * metrics, workouts, the weekly plan and the user's targets.
 */
export const dashboardApi = {
  get: () => api.get('/dashboard'),
};
