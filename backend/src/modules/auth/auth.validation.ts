import { body } from 'express-validator';

/**
 * Validation rules for POST /api/auth/register
 * Aligned with US-01 acceptance criteria
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nama harus diisi')
    .isLength({ max: 100 })
    .withMessage('Nama maksimal 100 karakter'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email harus diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password harus diisi')
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter')
    .isLength({ max: 128 })
    .withMessage('Password maksimal 128 karakter'),

  body('age')
    .notEmpty()
    .withMessage('Umur harus diisi')
    .isInt({ min: 1, max: 150 })
    .withMessage('Umur harus antara 1 dan 150'),

  body('gender')
    .notEmpty()
    .withMessage('Jenis kelamin harus diisi')
    .isIn(['male', 'female'])
    .withMessage('Jenis kelamin harus male atau female'),
];

/**
 * Validation rules for POST /api/auth/login
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email harus diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password harus diisi'),
];
