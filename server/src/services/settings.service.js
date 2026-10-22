import UserSettings from '../models/UserSettings.js';

/**
 * Data-access layer for the owner's settings singleton. Other features read
 * targets from here (see nutrition.service) so there is one source of truth.
 */
export const settingsService = {
  /** The owner's settings, created with defaults on first access. */
  async get(userId) {
    const existing = await UserSettings.findOne({ userId }).exec();
    if (existing) return existing;
    // Schema defaults fill in profile/units/targets on insert.
    return UserSettings.create({ userId });
  },

  /** Replace the editable sections with sanitized values (upsert). */
  update(userId, data) {
    return UserSettings.findOneAndUpdate(
      { userId },
      { $set: data },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).exec();
  },

  /** Daily targets only — the shape other features depend on. */
  async getTargets(userId) {
    const settings = await this.get(userId);
    return settings.targets;
  },

  /** Mirror the latest weigh-in into the profile without touching other fields. */
  setWeight(userId, weightKg) {
    return UserSettings.findOneAndUpdate(
      { userId },
      { $set: { 'bodyMetrics.weightKg': weightKg } },
      { upsert: true, setDefaultsOnInsert: true },
    ).exec();
  },
};
