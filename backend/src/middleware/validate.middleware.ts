import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/response';

/**
 * Validation Middleware
 * Runs after express-validator checks, formats and returns errors if any
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: (err as any).path || 'unknown',
      message: err.msg,
    }));

    sendError(res, 400, 'Validasi gagal', formattedErrors);
    return;
  }

  next();
};
