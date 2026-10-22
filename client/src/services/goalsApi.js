import { api } from './api';

/**
 * Goals + achievements clients. Goals map to `/api/goals`; achievement badges
 * are read-only and derived server-side from workout stats.
 */
export const goalsApi = {
  list: () => api.get('/goals'),
  create: (goal) => api.post('/goals', goal),
  update: (id, goal) => api.put(`/goals/${id}`, goal),
  remove: (id) => api.del(`/goals/${id}`),
};

export const achievementsApi = {
  list: () => api.get('/achievements'),
};
