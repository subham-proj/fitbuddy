import { nutritionGoals } from '../config/nutritionGoals.js';
import DailyMetric from '../models/DailyMetric.js';
import FoodEntry, { MEALS } from '../models/FoodEntry.js';
import WaterLog from '../models/WaterLog.js';

const MACRO_KEYS = ['protein', 'carbs', 'fat', 'fibre'];

/** Empty { breakfast: [], lunch: [], ... } accumulator. */
function emptyMealGroups() {
  return MEALS.reduce((acc, meal) => ({ ...acc, [meal]: [] }), {});
}

/**
 * Data-access + composition layer for manual nutrition logging. Food is stored
 * per item (see FoodEntry); this service also composes the per-day view the
 * web app renders, pulling "burned" calories from the watch's DailyMetric so
 * logged intake and tracked expenditure appear together.
 */
export const nutritionService = {
  /** Compose the full day view: goals, totals, grouped meals and water. */
  async getDay(userId, date) {
    const [entries, water, metric] = await Promise.all([
      FoodEntry.find({ userId, date }).sort({ loggedAt: 1 }).exec(),
      WaterLog.findOne({ userId, date }).exec(),
      DailyMetric.findOne({ userId, date }).select('calories').lean().exec(),
    ]);

    const meals = emptyMealGroups();
    const macros = { protein: 0, carbs: 0, fat: 0, fibre: 0 };
    let eaten = 0;

    for (const entry of entries) {
      const json = entry.toJSON();
      (meals[json.meal] ??= []).push(json);
      eaten += json.calories;
      for (const key of MACRO_KEYS) macros[key] += json[key];
    }

    // All-day calories burned as reported by the watch for this date, if any.
    const burned = Number(metric?.calories?.current) || 0;
    const target = nutritionGoals.calories;

    return {
      date,
      goals: nutritionGoals,
      summary: {
        target,
        eaten,
        burned,
        left: target - eaten,
        pct: target > 0 ? Math.round((eaten / target) * 100) : 0,
        macros,
      },
      meals,
      water: { glasses: water?.glasses ?? 0 },
    };
  },

  /** Add one food item. `data` is already sanitized. */
  addFood(userId, data) {
    return FoodEntry.create({ ...data, userId });
  },

  /** Remove one food item owned by the user. Returns the deleted doc or null. */
  removeFood(userId, id) {
    return FoodEntry.findOneAndDelete({ _id: id, userId }).exec();
  },

  /** Set the water glass count for a day (upsert). Returns the glass count. */
  async setWater(userId, { date, glasses }) {
    const doc = await WaterLog.findOneAndUpdate(
      { userId, date },
      { $set: { glasses } },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
    ).exec();
    return { glasses: doc.glasses };
  },
};
