import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * JWT Authentication Middleware
 * Verifies Bearer token from Authorization header
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'Token tidak ditemukan. Silakan login terlebih dahulu');
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      sendError(res, 500, 'JWT secret tidak dikonfigurasi');
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 401, 'Token telah kedaluwarsa. Silakan login kembali');
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, 401, 'Token tidak valid');
      return;
    }

    sendError(res, 500, 'Terjadi kesalahan pada autentikasi');
  }
};
