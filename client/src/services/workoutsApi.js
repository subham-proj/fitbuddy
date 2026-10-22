import { api } from './api';

/**
 * Workouts resource client. Maps to the Express `/api/workouts` routes.
 */
export const workoutsApi = {
  list: () => api.get('/workouts'),
  get: (id) => api.get(`/workouts/${id}`),
  create: (workout) => api.post('/workouts', workout),
  update: (id, workout) => api.put(`/workouts/${id}`, workout),
  remove: (id) => api.del(`/workouts/${id}`),
};
