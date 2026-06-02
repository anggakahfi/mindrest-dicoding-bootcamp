import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckin extends Document {
  userId: mongoose.Types.ObjectId;
  journalText: string;
  checkinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const checkinSchema = new Schema<ICheckin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId harus diisi'],
      index: true,
    },
    journalText: {
      type: String,
      required: [true, 'Jurnal harus diisi'],
      minlength: [10, 'Jurnal minimal 10 karakter'],
      maxlength: [1000, 'Jurnal maksimal 1000 karakter'],
    },
    checkinDate: {
      type: Date,
      required: [true, 'Tanggal checkin harus diisi'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: speeds up history queries sorted by newest
checkinSchema.index({ userId: 1, checkinDate: -1 });

const Checkin = mongoose.model<ICheckin>('Checkin', checkinSchema, 'daily_checkins');

export default Checkin;
