import mongoose from 'mongoose';

const { Schema } = mongoose;

export const GOAL_AREAS = [
  'strength',
  'cardio',
  'habit',
  'nutrition',
  'activity',
  'recovery',
  'other',
];

export const GOAL_STATUSES = ['on-track', 'behind', 'done'];

/**
 * A user-defined goal with manual progress. The owner enters start / current /
 * target values; `pct` is derived so progress can never drift from them, and
 * it handles both increasing goals (lift more) and decreasing ones (lose
 * weight) via the start→target direction. One goal may be flagged primary and
 * is featured in the page hero.
 */
const goalSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    area: { type: String, enum: GOAL_AREAS, default: 'other' },
    title: { type: String, required: [true, 'A goal title is required'], trim: true },
    unit: { type: String, trim: true, default: '' },
    startValue: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    targetValue: { type: Number, default: 0 },
    // Free-text due label, e.g. "15 Dec", "Weekly", "Daily".
    due: { type: String, trim: true, default: '' },
    status: { type: String, enum: GOAL_STATUSES, default: 'on-track' },
    isPrimary: { type: Boolean, default: false },
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

/** Progress 0–100, measured along the start→target span in either direction. */
goalSchema.virtual('pct').get(function pct() {
  const { startValue: s, currentValue: c, targetValue: t } = this;
  if (t === s) return c >= t ? 100 : 0;
  const raw = ((c - s) / (t - s)) * 100;
  return Math.max(0, Math.min(Math.round(raw), 100));
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
