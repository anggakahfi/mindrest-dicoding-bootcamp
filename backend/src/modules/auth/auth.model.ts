import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      trim: true,
      maxlength: [100, 'Nama maksimal 100 karakter'],
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      select: false, // Never return password in queries by default
    },
    age: {
      type: Number,
      required: [true, 'Umur harus diisi'],
      min: [1, 'Umur minimal 1'],
      max: [150, 'Umur maksimal 150'],
    },
    gender: {
      type: String,
      required: [true, 'Jenis kelamin harus diisi'],
      enum: {
        values: ['male', 'female'],
        message: 'Jenis kelamin harus male atau female',
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
