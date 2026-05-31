import Checkin, { ICheckin } from './checkin.model';
import Prediction from '../prediction/prediction.model';

interface CreateCheckinInput {
  userId: string;
  journalText: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

interface PaginatedResult {
  checkins: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get today's date at midnight UTC (strips time component)
 */
const getTodayUTC = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

/**
 * Create or update today's checkin (upsert)
 * Implements US-06: if checkin already exists today, update it
 */
export const createCheckin = async (
  input: CreateCheckinInput
): Promise<{ checkin: ICheckin; isUpdated: boolean }> => {
  const checkinDate = getTodayUTC();

  // Try to find existing checkin for today
  const existing = await Checkin.findOne({
    userId: input.userId,
    checkinDate,
  });

  if (existing) {
    // Update existing checkin
    existing.journalText = input.journalText;
    await existing.save();

    return { checkin: existing, isUpdated: true };
  }

  // Create new checkin
  const checkin = await Checkin.create({
    userId: input.userId,
    journalText: input.journalText,
    checkinDate,
  });

  return { checkin, isUpdated: false };
};

/**
 * Get paginated checkin history for a user, newest first
 * Each checkin is populated with its prediction summary (stressLevel, stressScore)
 */
export const getCheckinsByUser = async (
  userId: string,
  options: PaginationOptions
): Promise<PaginatedResult> => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [checkins, total] = await Promise.all([
    Checkin.find({ userId })
      .sort({ checkinDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Checkin.countDocuments({ userId }),
  ]);

  // Populate predictions for each checkin
  const checkinIds = checkins.map((c) => c._id);
  const predictions = await Prediction.find({ checkinId: { $in: checkinIds } })
    .select('checkinId stressLevel stressScore')
    .lean();

  // Map predictions to checkins
  const predictionMap = new Map(
    predictions.map((p) => [p.checkinId.toString(), p])
  );

  const checkinsWithPredictions = checkins.map((checkin) => ({
    ...checkin,
    prediction: predictionMap.get(checkin._id!.toString()) || null,
  }));

  return {
    checkins: checkinsWithPredictions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single checkin by ID (for prediction service)
 */
export const getCheckinById = async (
  checkinId: string,
  userId: string
): Promise<ICheckin> => {
  const checkin = await Checkin.findOne({ _id: checkinId, userId });

  if (!checkin) {
    const error = new Error('Checkin tidak ditemukan');
    (error as any).statusCode = 404;
    throw error;
  }

  return checkin;
};
