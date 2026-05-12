import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { sendSuccess, sendError } from '../../utils/response';
import * as predictionService from './prediction.service';

/**
 * Validation rules for POST /api/predictions
 */
export const createPredictionValidation = [
  body('checkinId')
    .notEmpty()
    .withMessage('checkinId harus diisi')
    .isMongoId()
    .withMessage('checkinId tidak valid'),
];

/**
 * POST /api/predictions
 */
export const createPrediction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { checkinId } = req.body;

    const prediction = await predictionService.createPrediction(
      checkinId,
      userId
    );

    sendSuccess(res, 201, 'Prediksi berhasil', { prediction });
  } catch (error: any) {
    if (error.statusCode === 409) {
      sendError(res, 409, error.message);
      return;
    }
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    next(error);
  }
};

/**
 * GET /api/predictions
 */
export const getPredictions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const days = req.query.days ? parseInt(req.query.days as string) : undefined;

    const result = await predictionService.getPredictionsByUser(userId, {
      page,
      limit,
      days,
    });

    const message =
      result.pagination.total > 0
        ? 'Riwayat prediksi berhasil diambil'
        : 'Belum ada riwayat prediksi';

    sendSuccess(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};
