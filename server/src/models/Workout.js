import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * A single exercise entry within a workout.
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
 * Example domain model for FitBuddy. Represents a logged workout session.
 * Use this as the template for additional models (users, goals, etc.).
 */
const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A workout title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'other'],
      default: 'other',
    },
    durationMin: { type: Number, min: 0, default: 0 },
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

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
