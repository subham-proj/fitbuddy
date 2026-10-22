import { api } from './api';

/**
 * Weekly plan resource client. Maps to the Express `/api/plan` routes.
 * One entry per day, keyed by date.
 */
export const planApi = {
  list: (from, to) => api.get(`/plan?from=${from}&to=${to}`),
  setDay: (date, data) => api.put(`/plan/${date}`, data),
  removeDay: (date) => api.del(`/plan/${date}`),
};
