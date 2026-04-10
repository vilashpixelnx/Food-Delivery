const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Validation Rules ─────────────────────────────────────────

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'manager']).withMessage('Role must be admin or manager'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─── Routes ───────────────────────────────────────────────────

// POST /api/auth/register  — Create a new user
router.post('/register', registerValidation, register);

// POST /api/auth/login     — Login and receive JWT
router.post('/login', loginValidation, login);

// GET  /api/auth/me        — Get logged-in user profile (protected)
router.get('/me', protect, getMe);

// POST /api/auth/logout    — Logout (protected)
router.post('/logout', protect, logout);

module.exports = router;
