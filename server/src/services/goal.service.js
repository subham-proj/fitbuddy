import Goal from '../models/Goal.js';

/** Clear the primary flag on every other goal so at most one is featured. */
function clearOtherPrimaries(userId, keepId) {
  return Goal.updateMany(
    { userId, _id: { $ne: keepId }, isPrimary: true },
    { $set: { isPrimary: false } },
  ).exec();
}

/**
 * Data-access layer for goals. Owner-scoped. Maintains the invariant that at
 * most one goal is primary at a time.
 */
export const goalService = {
  findAll(userId) {
    return Goal.find({ userId }).sort('-createdAt').exec();
  },

  findById(userId, id) {
    return Goal.findOne({ _id: id, userId }).exec();
  },

  async create(userId, data) {
    const goal = await Goal.create({ ...data, userId });
    if (goal.isPrimary) await clearOtherPrimaries(userId, goal._id);
    return goal;
  },

  async update(userId, id, data) {
    const goal = await Goal.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    }).exec();
    if (goal && goal.isPrimary) await clearOtherPrimaries(userId, goal._id);
    return goal;
  },

  remove(userId, id) {
    return Goal.findOneAndDelete({ _id: id, userId }).exec();
  },
};
