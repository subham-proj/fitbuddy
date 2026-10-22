import BodyMeasurement from '../models/BodyMeasurement.js';
import { settingsService } from './settings.service.js';

/**
 * Data-access layer for body measurements (weigh-ins). Owner-scoped, one per
 * day (upsert). After any change the latest weight is mirrored into the user's
 * settings so the profile and Progress trend never disagree.
 */
export const measurementService = {
  /** Measurements with date >= `from`, oldest first (for the trend chart). */
  findSince(userId, from) {
    const query = { userId };
    if (from) query.date = { $gte: from };
    return BodyMeasurement.find(query).sort({ date: 1 }).lean().exec();
  },

  /** Upsert a weigh-in, then sync the latest weight into settings. */
  async upsert(userId, data) {
    const doc = await BodyMeasurement.findOneAndUpdate(
      { userId, date: data.date },
      { $set: { weightKg: data.weightKg, bodyFatPct: data.bodyFatPct } },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).exec();

    const latest = await BodyMeasurement.findOne({ userId })
      .sort({ date: -1 })
      .select('weightKg')
      .lean()
      .exec();
    if (latest) await settingsService.setWeight(userId, latest.weightKg);

    return doc;
  },
};
