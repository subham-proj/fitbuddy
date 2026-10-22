import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * A single exercise entry within a workout. Strength work uses sets/reps/weight;
 * for cardio/mobility these can stay 0 and the entry is just a named movement.
 */
const exerciseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number, min: 0, default: 0 },
    reps: { type: Number, min: 0, default: 0 },
    weightKg: { type: Number, min: 0, default: 0 },
  },
  { _id: false },
);

/**
 * A completed workout, logged in one go (there is no live-session concept in
 * this app). One document per logged session. In this single-user deployment
 * every workout is attributed to the owner (see OWNER_USER_ID), mirroring how
 * watch metrics are stored, so a per-user query path exists for later auth.
 */
const workoutSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: {
      type: String,
      required: [true, 'A workout title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['strength', 'cardio', 'mobility', 'other'],
      default: 'other',
    },
    durationMin: { type: Number, min: 0, default: 0 },
    // Calories burned is entered manually when logging — the watch tracks
    // all-day calories separately (see DailyMetric), not per-workout.
    caloriesBurned: { type: Number, min: 0, default: 0 },
    exercises: { type: [exerciseSchema], default: [] },
    notes: { type: String, trim: true, default: '' },
    performedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  },
);

/**
 * Total training volume in kilograms (Σ sets × reps × weight). Derived rather
 * than stored so it can never drift from the exercises it summarizes.
 */
workoutSchema.virtual('volumeKg').get(function volumeKg() {
  return (this.exercises || []).reduce(
    (total, ex) => total + (ex.sets || 0) * (ex.reps || 0) * (ex.weightKg || 0),
    0,
  );
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
