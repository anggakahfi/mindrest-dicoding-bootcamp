import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  checkinId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  stressLevel: 'Rendah' | 'Sedang' | 'Tinggi';
  stressScore: number;
  recommendation: string;
  ringkasan: string;
  rekomendasi: string[];
  pesanDukungan: string;
  createdAt: Date;
  updatedAt: Date;
}

const predictionSchema = new Schema<IPrediction>(
  {
    checkinId: {
      type: Schema.Types.ObjectId,
      ref: 'Checkin',
      required: [true, 'checkinId harus diisi'],
      unique: true, // 1 prediction per 1 checkin
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId harus diisi'],
      index: true, // Denormalized for efficient user-level queries
    },
    stressLevel: {
      type: String,
      required: [true, 'Tingkat stres harus diisi'],
      enum: {
        values: ['Rendah', 'Sedang', 'Tinggi'],
        message: 'Tingkat stres harus Rendah, Sedang, atau Tinggi',
      },
    },
    stressScore: {
      type: Number,
      required: [true, 'Skor stres harus diisi'],
      min: [0, 'Skor minimal 0'],
      max: [1, 'Skor maksimal 1'],
    },
    recommendation: {
      type: String,
      required: [true, 'Rekomendasi harus diisi'],
    },
    ringkasan: {
      type: String,
      default: '',
    },
    rekomendasi: {
      type: [String],
      default: [],
    },
    pesanDukungan: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user history queries sorted by newest
predictionSchema.index({ userId: 1, createdAt: -1 });

const Prediction = mongoose.model<IPrediction>('Prediction', predictionSchema);

export default Prediction;
