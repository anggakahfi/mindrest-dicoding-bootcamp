import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import checkinRoutes from './modules/checkin/checkin.routes';
import predictionRoutes from './modules/prediction/prediction.routes';

const app = express();

// ========================
// Global Middleware
// ========================

// CORS — allow frontend origins
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Frontend dev
      'http://localhost:5173', // Vite dev (jika diperlukan)
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ========================
// Request Logging
// ========================

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ========================
// Health Check
// ========================

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'TweetMind API is running',
    timestamp: new Date().toISOString(),
  });
});

// ========================
// API Routes
// ========================

app.use('/api/auth', authRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/predictions', predictionRoutes);

// ========================
// 404 Handler
// ========================

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

// ========================
// Global Error Handler (must be last)
// ========================

app.use(errorMiddleware);

export default app;
