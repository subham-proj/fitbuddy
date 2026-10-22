import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * A body measurement (weigh-in) for one user/day. At most one per day — a new
 * reading for the same date upserts. These form the body-weight trend on the
 * Progress page; the latest weight is mirrored into UserSettings.
 */
const bodyMeasurementSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    weightKg: { type: Number, min: 0, required: true },
    bodyFatPct: { type: Number, min: 0, max: 100, default: null },
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

// One measurement per user per day.
bodyMeasurementSchema.index({ userId: 1, date: 1 }, { unique: true });

const BodyMeasurement = mongoose.model('BodyMeasurement', bodyMeasurementSchema);

export default BodyMeasurement;
