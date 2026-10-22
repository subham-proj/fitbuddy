import { env } from '../config/env.js';
import { nutritionService } from '../services/nutrition.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/HttpError.js';
import {
  sanitizeFoodPayload,
  sanitizeWaterPayload,
} from '../utils/sanitizeFoodPayload.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** GET /api/nutrition/:date — composed day view (goals, totals, meals, water). */
export const getNutritionDay = asyncHandler(async (req, res) => {
  const { date } = req.params;
  if (!DATE_RE.test(date)) {
    throw new HttpError(400, 'Date must be a YYYY-MM-DD string');
  }
  const day = await nutritionService.getDay(env.ownerUserId, date);
  res.json({ data: day });
});

/** POST /api/nutrition/food — log one food item. */
export const logFood = asyncHandler(async (req, res) => {
  const data = sanitizeFoodPayload(req.body); // throws 400 on bad input
  const entry = await nutritionService.addFood(env.ownerUserId, data);
  res.status(201).json({ data: entry });
});

/** DELETE /api/nutrition/food/:id — remove one food item. */
export const deleteFood = asyncHandler(async (req, res) => {
  const entry = await nutritionService.removeFood(env.ownerUserId, req.params.id);
  if (!entry) throw new HttpError(404, 'Food entry not found');
  res.status(204).send();
});

/** PUT /api/nutrition/water — set the water glass count for a day. */
export const setWater = asyncHandler(async (req, res) => {
  const data = sanitizeWaterPayload(req.body);
  const water = await nutritionService.setWater(env.ownerUserId, data);
  res.json({ data: water });
});
