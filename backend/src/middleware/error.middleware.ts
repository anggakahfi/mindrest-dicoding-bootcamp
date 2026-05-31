import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns consistent response
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Unhandled Error:', err.message);
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    sendError(res, 400, 'Validasi gagal', [
      { field: 'general', message: err.message },
    ]);
    return;
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    sendError(res, 409, `${field} sudah terdaftar`);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 400, 'ID tidak valid');
    return;
  }

  // Default server error
  sendError(res, 500, 'Terjadi kesalahan pada server');
};
