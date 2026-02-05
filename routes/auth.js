/**
 * Authentication Routes
 * /api/auth
 */

const express = require('express');
const router = express.Router();
const { login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const { validateLogin, validatePasswordChange } = require('../middleware/validation');

// Public routes
router.post('/login', authLimiter, validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/change-password', protect, validatePasswordChange, changePassword);

module.exports = router;
