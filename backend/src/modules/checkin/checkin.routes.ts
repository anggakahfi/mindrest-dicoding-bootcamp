import { Router } from 'express';
import {
  createCheckin,
  getCheckins,
  createCheckinValidation,
} from './checkin.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All checkin routes require authentication
router.use(authMiddleware);

// POST /api/checkins — Create or update today's checkin
router.post('/', createCheckinValidation, validate, createCheckin);

// GET /api/checkins — Get checkin history
router.get('/', getCheckins);

export default router;
