import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Water intake for one user/day, stored as a glass count and upserted on every
 * change so repeated taps never create duplicates. Separate from FoodEntry
 * because water is a single per-day value, not a list of items.
 */
const waterLogSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    glasses: { type: Number, min: 0, default: 0 },
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

// One water record per user per day.
waterLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WaterLog = mongoose.model('WaterLog', waterLogSchema);

export default WaterLog;
