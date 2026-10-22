import mongoose from 'mongoose';

import { ACTIVITY_LEVELS, defaultTargets } from '../config/defaultTargets.js';

const { Schema } = mongoose;

/** Daily targets — activity (rings) and nutrition (Nutrition page). */
const targetsSchema = new Schema(
  {
    steps: { type: Number, min: 0, default: defaultTargets.steps },
    moveKcal: { type: Number, min: 0, default: defaultTargets.moveKcal },
    exerciseMin: { type: Number, min: 0, default: defaultTargets.exerciseMin },
    calories: { type: Number, min: 0, default: defaultTargets.calories },
    protein: { type: Number, min: 0, default: defaultTargets.protein },
    carbs: { type: Number, min: 0, default: defaultTargets.carbs },
    fat: { type: Number, min: 0, default: defaultTargets.fat },
    fibre: { type: Number, min: 0, default: defaultTargets.fibre },
    waterGlasses: { type: Number, min: 1, default: defaultTargets.waterGlasses },
    glassMl: { type: Number, min: 1, default: defaultTargets.glassMl },
  },
  { _id: false },
);

const profileSchema = new Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    yearOfBirth: { type: Number, default: null },
    activityLevel: { type: String, enum: ACTIVITY_LEVELS, default: 'Active' },
  },
  { _id: false },
);

// Body metrics are stored canonically in metric; the client converts for
// display when the imperial unit is selected.
const bodyMetricsSchema = new Schema(
  {
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },
  },
  { _id: false },
);

/**
 * One settings document per user (singleton in this single-user deployment).
 * Created with defaults on first read.
 */
const userSettingsSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    profile: { type: profileSchema, default: () => ({}) },
    bodyMetrics: { type: bodyMetricsSchema, default: () => ({}) },
    targets: { type: targetsSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    minimize: false,
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

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

export default UserSettings;
