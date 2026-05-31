import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Mongoose connection options
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.error('💡 Pastikan:');
    console.error('   1. Connection string di .env sudah benar');
    console.error('   2. IP address sudah di-whitelist di MongoDB Atlas');
    console.error('   3. Username dan password sudah benar');
    console.error('   4. Koneksi internet aktif');
    process.exit(1);
  }
};

export default connectDB;
