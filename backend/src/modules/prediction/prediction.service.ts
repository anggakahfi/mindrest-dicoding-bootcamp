import Prediction, { IPrediction } from './prediction.model';
import Checkin from '../checkin/checkin.model';

type StressLevel = 'Rendah' | 'Sedang' | 'Tinggi';

/**
 * Response shape from AI Service (FastAPI) POST /analyze
 * Matches ai-service/app/schemas/analyze_schema.py → AnalyzeResponse
 */
interface AIServiceResponse {
  input_text: string;
  prediction: {
    label: 'Buruk' | 'Cukup' | 'Bagus';
    confidence: number;
    probabilities: Record<string, number>;
  };
  ringkasan: string;
  rekomendasi: string[];
  pesan_dukungan: string;
}

/**
 * Normalized result used internally after calling AI service (or fallback)
 */
interface NormalizedAIResult {
  stressLevel: StressLevel;
  stressScore: number;
  recommendation: string;
  ringkasan: string;
  rekomendasi: string[];
  pesanDukungan: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  days?: number;
}

/**
 * Map AI model labels (Buruk/Cukup/Bagus) → app stress levels (Tinggi/Sedang/Rendah)
 *   Buruk  → Tinggi  (bad mental condition = high stress)
 *   Cukup  → Sedang  (moderate = medium stress)
 *   Bagus  → Rendah  (good condition = low stress)
 */
const LABEL_TO_STRESS: Record<string, StressLevel> = {
  Buruk: 'Tinggi',
  Cukup: 'Sedang',
  Bagus: 'Rendah',
};

/**
 * Fallback static recommendations when FastAPI is unavailable (US-05)
 */
const FALLBACK_DATA: Record<StressLevel, Omit<NormalizedAIResult, 'stressLevel' | 'stressScore'>> = {
  Rendah: {
    recommendation: 'Pertahankan kebiasaan baikmu hari ini. Tidur cukup untuk menjaga energimu tetap stabil.',
    ringkasan: 'Kondisi pengguna terlihat cukup positif dan stabil.',
    rekomendasi: [
      'Pertahankan kebiasaan baik yang membuatmu merasa nyaman.',
      'Tetap jaga pola tidur, makan, dan aktivitas harian.',
      'Luangkan waktu untuk hal-hal yang membuatmu merasa lebih tenang.',
    ],
    pesanDukungan: 'Senang melihat kamu berada dalam kondisi yang cukup baik.',
  },
  Sedang: {
    recommendation: 'Sempatkan istirahat sejenak dari layar dan tarik napas panjang selama beberapa menit.',
    ringkasan: 'Kondisi pengguna terlihat cukup netral, namun tetap perlu menjaga keseimbangan diri.',
    rekomendasi: [
      'Coba luangkan waktu untuk memahami perasaanmu hari ini.',
      'Jaga rutinitas sederhana seperti tidur cukup dan makan teratur.',
      'Lakukan aktivitas ringan yang bisa membantu menenangkan pikiran.',
    ],
    pesanDukungan: 'Tidak apa-apa mengambil waktu untuk dirimu sendiri.',
  },
  Tinggi: {
    recommendation: 'Coba luangkan 10 menit untuk pernapasan dalam atau dengarkan musik tenang sebelum tidur.',
    ringkasan: 'Kondisi pengguna menunjukkan adanya tekanan emosional yang cukup tinggi.',
    rekomendasi: [
      'Coba ceritakan perasaanmu kepada orang yang kamu percaya.',
      'Berikan waktu untuk istirahat dan kurangi aktivitas yang terlalu membebani.',
      'Jika perasaan ini terus berlanjut, pertimbangkan untuk menghubungi konselor atau profesional.',
    ],
    pesanDukungan: 'Kamu tidak harus menghadapi semuanya sendirian.',
  },
};

/**
 * Generate a fallback prediction when FastAPI is not available
 */
const generateFallbackPrediction = (): NormalizedAIResult => {
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
    stressLevel: level,
    stressScore: parseFloat(score.toFixed(2)),
    ...FALLBACK_DATA[level],
  };
};

/**
 * Normalize AI service response into the shape we store in MongoDB
 */
const normalizeAIResponse = (aiResponse: AIServiceResponse): NormalizedAIResult => {
  const label = aiResponse.prediction.label;
  const stressLevel = LABEL_TO_STRESS[label] || 'Sedang';

  return {
    stressLevel,
    stressScore: aiResponse.prediction.confidence,
    recommendation: aiResponse.rekomendasi?.[0] || FALLBACK_DATA[stressLevel].recommendation,
    ringkasan: aiResponse.ringkasan,
    rekomendasi: aiResponse.rekomendasi,
    pesanDukungan: aiResponse.pesan_dukungan,
  };
};

/**
 * Call FastAPI POST /analyze endpoint
 * Falls back to mock prediction if FastAPI is unavailable
 */
const callAIService = async (text: string): Promise<NormalizedAIResult> => {
  const fastApiUrl = process.env.FASTAPI_URL;

  if (!fastApiUrl) {
    console.warn('⚠️ FASTAPI_URL not configured, using fallback prediction');
    return generateFallbackPrediction();
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout (Gemini can be slow)

    const response = await fetch(`${fastApiUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`AI Service returned ${response.status}`);
    }

    const aiResponse: AIServiceResponse = await response.json();
    return normalizeAIResponse(aiResponse);
  } catch (error: any) {
    console.warn('⚠️ AI Service unavailable, using fallback prediction:', error.message);
    return generateFallbackPrediction();
  }
};

/**
 * Create or update a prediction for a given checkin
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

  // Call AI Service (or fallback)
  const aiResult = await callAIService(checkin.journalText);

  // Check if prediction already exists for this checkin
  const existing = await Prediction.findOne({ checkinId });
  
  if (existing) {
    // Update the existing prediction with new AI results
    existing.stressLevel = aiResult.stressLevel;
    existing.stressScore = aiResult.stressScore;
    existing.recommendation = aiResult.recommendation;
    existing.ringkasan = aiResult.ringkasan;
    existing.rekomendasi = aiResult.rekomendasi;
    existing.pesanDukungan = aiResult.pesanDukungan;
    
    await existing.save();
    return existing;
  }

  // Create new prediction if it doesn't exist
  const prediction = await Prediction.create({
    checkinId,
    userId,
    stressLevel: aiResult.stressLevel,
    stressScore: aiResult.stressScore,
    recommendation: aiResult.recommendation,
    ringkasan: aiResult.ringkasan,
    rekomendasi: aiResult.rekomendasi,
    pesanDukungan: aiResult.pesanDukungan,
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
