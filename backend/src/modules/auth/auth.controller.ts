import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import * as authService from './auth.service';

/**
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, age, gender } = req.body;

    const result = await authService.registerUser({
      name,
      email,
      password,
      age,
      gender,
    });

    sendSuccess(res, 201, 'Registrasi berhasil', result);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    sendSuccess(res, 200, 'Login berhasil', result);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId!;

    const user = await authService.getUserById(userId);

    sendSuccess(res, 200, 'Profil berhasil diambil', { user });
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    next(error);
  }
};
