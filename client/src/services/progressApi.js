import { api } from './api';

/**
 * Progress client. The composed progress view is derived server-side from
 * workouts + measurements; logging a weigh-in posts a body measurement.
 */
export const progressApi = {
  get: (range) => api.get(`/progress?range=${range}`),
  logMeasurement: (measurement) => api.post('/progress/measurement', measurement),
};
