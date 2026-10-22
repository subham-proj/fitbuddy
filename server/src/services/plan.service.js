import PlannedSession from '../models/PlannedSession.js';

/**
 * Data-access layer for the weekly plan. One entry per user/day; setting a
 * day's plan is an upsert keyed by date, which maps directly to "edit this
 * day" in the UI. All queries are owner-scoped.
 */
export const planService = {
  /** Planned entries in [from, to] (inclusive), ordered by date. */
  findRange(userId, from, to) {
    const query = { userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }
    return PlannedSession.find(query).sort({ date: 1 }).exec();
  },

  /** Upsert the plan entry for one day. `data` is already sanitized. */
  setDay(userId, date, data) {
    return PlannedSession.findOneAndUpdate(
      { userId, date },
      { $set: data },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).exec();
  },

  /** Clear a day's plan. Returns the deleted doc or null if there was none. */
  removeDay(userId, date) {
    return PlannedSession.findOneAndDelete({ userId, date }).exec();
  },
};
