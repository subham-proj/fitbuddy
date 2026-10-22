import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * One document per user per calendar day, upserted on every watch sync so
 * repeated syncs never create duplicates. The metric groups are stored as
 * loose subdocuments because Zepp OS 1.0 sensor payloads vary by model and
 * firmware — we keep whatever the watch sent and guard reads downstream.
 */
const dailyMetricSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    // Local calendar date from the watch, formatted YYYY-MM-DD.
    date: { type: String, required: true },
    // Epoch millis of the watch-side collection, from the device clock.
    syncedAt: { type: Number },

    steps: { type: Schema.Types.Mixed }, // { current, target }
    calories: { type: Schema.Types.Mixed }, // { current, target }
    // { last, current, today: number[], summary: { avg, min, max } }
    heartRate: { type: Schema.Types.Mixed },
    sleep: { type: Schema.Types.Mixed },
    stress: { type: Schema.Types.Mixed }, // { current, time }
    spo2: { type: Schema.Types.Mixed }, // { current, time, hourAvgofDay: number[] }
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

// One record per user per day.
dailyMetricSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyMetric = mongoose.model('DailyMetric', dailyMetricSchema);

export default DailyMetric;
