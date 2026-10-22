import DailyMetric from '../models/DailyMetric.js';

/** Summarize a per-minute heart-rate array into avg/min/max of valid readings. */
function hrStats(arr = []) {
  const v = (Array.isArray(arr) ? arr : []).filter(
    (n) => typeof n === 'number' && n > 0 && n < 255,
  );
  if (!v.length) return null;
  const sum = v.reduce((a, b) => a + b, 0);
  return {
    avg: Math.round(sum / v.length),
    min: Math.min(...v),
    max: Math.max(...v),
  };
}

/**
 * Data-access layer for watch-synced daily metrics. Shares the single Mongoose
 * connection established in config/db.js, so these records live in the same
 * `fitbuddy` database the rest of the app uses.
 */
export const dailyMetricService = {
  /** Upsert one user/day document from a watch sync payload. */
  async upsertFromSync(userId, payload) {
    const update = {
      syncedAt: payload.syncedAt,
      steps: payload.steps,
      calories: payload.calories,
      heartRate: {
        ...(payload.heartRate || {}),
        summary: hrStats(payload.heartRate?.today),
      },
      sleep: payload.sleep,
      stress: payload.stress,
      spo2: payload.spo2,
    };

    // userId/date come from the filter and are applied automatically on insert.
    return DailyMetric.findOneAndUpdate(
      { userId, date: payload.date },
      { $set: update },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).exec();
  },

  /** Lean list of days in [from, to], heavy per-minute arrays projected out. */
  findRange(userId, from, to) {
    const query = { userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }
    return DailyMetric.find(query)
      .select('-heartRate.today -sleep.hr')
      .sort({ date: 1 })
      .exec();
  },

  /** Full single-day document, including per-minute heart rate for charts. */
  findByDate(userId, date) {
    return DailyMetric.findOne({ userId, date }).exec();
  },

  /** Most recently synced day (by server receipt time), or null. */
  findLatest(userId) {
    return DailyMetric.findOne({ userId })
      .select('date syncedAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  },
};
