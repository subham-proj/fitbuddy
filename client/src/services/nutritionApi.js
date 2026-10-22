import { api } from './api';

/**
 * Nutrition resource client. Maps to the Express `/api/nutrition` routes:
 * a composed day view plus per-item food logging and per-day water.
 */
export const nutritionApi = {
  getDay: (date) => api.get(`/nutrition/${date}`),
  logFood: (entry) => api.post('/nutrition/food', entry),
  deleteFood: (id) => api.del(`/nutrition/food/${id}`),
  setWater: (date, glasses) => api.put('/nutrition/water', { date, glasses }),
};
