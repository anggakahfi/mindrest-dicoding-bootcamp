import Prediction, { IPrediction } from './prediction.model';
import Checkin from '../checkin/checkin.model';

type StressLevel = 'Rendah' | 'Sedang' | 'Tinggi';

interface FastAPIResponse {
  stress_level: StressLevel;
  stress_score: number;
  recommendation: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  days?: number;
}

/**
 * Fallback static recommendations when FastAPI is unavailable (US-05)
 * Matches the fallbackRecommendations in frontend/lib/mock-data.ts
 */
const FALLBACK_RECOMMENDATIONS: Record<StressLevel, string> = {
  Rendah:
    'Pertahankan kebiasaan baikmu hari ini. Tidur cukup untuk menjaga energimu tetap stabil.',
  Sedang:
    'Sempatkan istirahat sejenak dari layar dan tarik napas panjang selama beberapa menit.',
  Tinggi:
    'Coba luangkan 10 menit untuk pernapasan dalam atau dengarkan musik tenang sebelum tidur.',
};

/**
 * Generate a mock prediction when FastAPI is not available
 * Uses simple random values — will be replaced by real inference
 */
const generateMockPrediction = (): FastAPIResponse => {
  const score = Math.random();
  let level: StressLevel;

  if (score < 0.33) {
    level = 'Rendah';
  } else if (score < 0.66) {
    level = 'Sedang';
  } else {
    level = 'Tinggi';
  }

  return {
    stress_level: level,
    stress_score: parseFloat(score.toFixed(2)),
    recommendation: FALLBACK_RECOMMENDATIONS[level],
  };
};

/**
 * Call FastAPI /predict endpoint
 * Falls back to mock prediction if FastAPI is unavailable
 */
const callFastAPI = async (text: string): Promise<FastAPIResponse> => {
  const fastApiUrl = process.env.FASTAPI_URL;

  if (!fastApiUrl) {
    console.warn('⚠️ FASTAPI_URL not configured, using mock prediction');
    return generateMockPrediction();
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout (US-04)

    const response = await fetch(`${fastApiUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`FastAPI returned ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.warn('⚠️ FastAPI unavailable, using mock prediction:', error.message);
    return generateMockPrediction();
  }
};

/**
 * Create a prediction for a given checkin
 */
export const createPrediction = async (
  checkinId: string,
  userId: string
): Promise<IPrediction> => {
  // Verify checkin exists and belongs to user
  const checkin = await Checkin.findOne({ _id: checkinId, userId });
  if (!checkin) {
    const error = new Error('Checkin tidak ditemukan');
    (error as any).statusCode = 404;
    throw error;
  }

  // Check if prediction already exists for this checkin
  const existing = await Prediction.findOne({ checkinId });
  if (existing) {
    const error = new Error('Prediksi untuk checkin ini sudah ada');
    (error as any).statusCode = 409;
    (error as any).data = { existingPrediction: existing };
    throw error;
  }

  // Call FastAPI (or fallback)
  const aiResult = await callFastAPI(checkin.journalText);

  // Save prediction to database
  const prediction = await Prediction.create({
    checkinId,
    userId,
    stressLevel: aiResult.stress_level,
    stressScore: aiResult.stress_score,
    recommendation: aiResult.recommendation,
  });

  return prediction;
};

/**
 * Get paginated prediction history for a user
 * Supports optional `days` filter for chart data (US-08)
 */
export const getPredictionsByUser = async (
  userId: string,
  options: PaginationOptions
) => {
  const { page, limit, days } = options;
  const skip = (page - 1) * limit;

  // Build query filter
  const filter: any = { userId };

  if (days) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    filter.createdAt = { $gte: fromDate };
  }

  const [predictions, total] = await Promise.all([
    Prediction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'checkinId',
        select: 'journalText checkinDate',
      })
      .lean(),
    Prediction.countDocuments(filter),
  ]);

  // Reshape: move populated checkin data to `checkin` field
  const formatted = predictions.map((p) => {
    const { checkinId, ...rest } = p;
    return {
      ...rest,
      checkinId: (checkinId as any)?._id || checkinId,
      checkin: checkinId
        ? {
            journalText: (checkinId as any).journalText,
            checkinDate: (checkinId as any).checkinDate,
          }
        : null,
    };
  });

  return {
    predictions: formatted,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
