import { Request, Response, NextFunction } from 'express';
import { body, query } from 'express-validator';
import { sendSuccess } from '../../utils/response';
import * as checkinService from './checkin.service';

/**
 * Validation rules for POST /api/checkins
 * Aligned with US-03: min 10, max 1000 characters
 */
export const createCheckinValidation = [
  body('journalText')
    .trim()
    .notEmpty()
    .withMessage('Jurnal harus diisi')
    .isLength({ min: 10 })
    .withMessage('Jurnal minimal 10 karakter')
    .isLength({ max: 1000 })
    .withMessage('Jurnal maksimal 1000 karakter'),
];

/**
 * POST /api/checkins
 */
export const createCheckin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { journalText } = req.body;

    const result = await checkinService.createCheckin({ userId, journalText });

    const statusCode = result.isUpdated ? 200 : 201;
    const message = result.isUpdated
      ? 'Jurnal hari ini berhasil diperbarui'
      : 'Jurnal berhasil disimpan';

    sendSuccess(res, statusCode, message, result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/checkins
 */
export const getCheckins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

    const result = await checkinService.getCheckinsByUser(userId, { page, limit });

    const message =
      result.pagination.total > 0
        ? 'Riwayat jurnal berhasil diambil'
        : 'Belum ada riwayat jurnal';

    sendSuccess(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};
