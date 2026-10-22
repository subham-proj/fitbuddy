import Workout from '../models/Workout.js';

/**
 * Data-access layer for workouts. Controllers call these functions and stay
 * free of Mongoose specifics, which keeps business logic testable and the
 * persistence layer swappable.
 *
 * Every query is scoped by `userId` so the data path is already multi-user
 * safe; today that id is always the configured owner (see OWNER_USER_ID).
 */
export const workoutService = {
  findAll(userId, { sort = '-performedAt', limit = 100 } = {}) {
    return Workout.find({ userId }).sort(sort).limit(limit).exec();
  },

  findById(userId, id) {
    return Workout.findOne({ _id: id, userId }).exec();
  },

  create(userId, data) {
    return Workout.create({ ...data, userId });
  },

  update(userId, id, data) {
    return Workout.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    }).exec();
  },

  remove(userId, id) {
    return Workout.findOneAndDelete({ _id: id, userId }).exec();
  },
};
