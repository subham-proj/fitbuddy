import mongoose from 'mongoose';

const { Schema } = mongoose;

export const PLAN_TYPES = ['strength', 'cardio', 'mobility', 'other'];

/**
 * A planned entry for one calendar day in the owner's weekly plan. At most one
 * per user/day — either a planned workout (title + type, optionally a time) or
 * a rest day (isRest). `completed` is toggled by the user when the session is
 * done. This is the plan/schedule; logged sessions live in the Workout model.
 */
const plannedSessionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    title: { type: String, trim: true, default: '' },
    type: { type: String, enum: PLAN_TYPES, default: 'other' },
    // Optional free-text time of day, e.g. "6:30 PM".
    time: { type: String, trim: true, default: '' },
    isRest: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
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

// One plan entry per user per day.
plannedSessionSchema.index({ userId: 1, date: 1 }, { unique: true });

const PlannedSession = mongoose.model('PlannedSession', plannedSessionSchema);

export default PlannedSession;
