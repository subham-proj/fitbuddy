import Workout from '../models/Workout.js';

/**
 * Data-access layer for workouts. Controllers call these functions and stay
 * free of Mongoose specifics, which keeps business logic testable and the
 * persistence layer swappable.
 */
export const workoutService = {
  findAll({ sort = '-performedAt' } = {}) {
    return Workout.find().sort(sort).exec();
  },

  findById(id) {
    return Workout.findById(id).exec();
  },

  create(data) {
    return Workout.create(data);
  },

  update(id, data) {
    return Workout.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  },

  remove(id) {
    return Workout.findByIdAndDelete(id).exec();
  },
};
