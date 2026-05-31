import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { registerValidation, loginValidation } from './auth.validation';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register — Public
router.post('/register', registerValidation, validate, register);

// POST /api/auth/login — Public
router.post('/login', loginValidation, validate, login);

// GET /api/auth/me — Protected
router.get('/me', authMiddleware, getMe);

export default router;
