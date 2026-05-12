import { Router } from 'express';
import {
  createPrediction,
  getPredictions,
  createPredictionValidation,
} from './prediction.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All prediction routes require authentication
router.use(authMiddleware);

// POST /api/predictions — Create prediction for a checkin
router.post('/', createPredictionValidation, validate, createPrediction);

// GET /api/predictions — Get prediction history
router.get('/', getPredictions);

export default router;
