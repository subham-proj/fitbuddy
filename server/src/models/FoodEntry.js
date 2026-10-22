import mongoose from 'mongoose';

const { Schema } = mongoose;

export const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'];

/**
 * A single logged food item. Nutrition is logged per item (not per day) so
 * each entry can be added and removed independently; the day view groups them
 * into meals and sums the totals. Attributed to the owner in this single-user
 * deployment, mirroring workouts and watch metrics.
 */
const foodEntrySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    // Local calendar date, YYYY-MM-DD — the unit the day view queries by.
    date: { type: String, required: true },
    meal: { type: String, enum: MEALS, required: true },
    name: { type: String, required: [true, 'A food name is required'], trim: true },
    // Free-text portion/description, e.g. "1 bowl · 18 g protein".
    detail: { type: String, trim: true, default: '' },
    calories: { type: Number, min: 0, default: 0 },
    protein: { type: Number, min: 0, default: 0 },
    carbs: { type: Number, min: 0, default: 0 },
    fat: { type: Number, min: 0, default: 0 },
    fibre: { type: Number, min: 0, default: 0 },
    loggedAt: { type: Date, default: Date.now },
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

// The day view reads every entry for one user/day, ordered by when it was logged.
foodEntrySchema.index({ userId: 1, date: 1, loggedAt: 1 });

const FoodEntry = mongoose.model('FoodEntry', foodEntrySchema);

export default FoodEntry;
