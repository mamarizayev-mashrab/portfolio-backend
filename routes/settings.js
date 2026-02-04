/**
 * Settings Routes
 * /api/settings
 */

const express = require('express');
const router = express.Router();
const {
    getSettings,
    updateSettings,
    updateSection
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getSettings);

// Protected routes (admin only)
router.put('/', protect, updateSettings);
router.patch('/:section', protect, updateSection);

module.exports = router;
