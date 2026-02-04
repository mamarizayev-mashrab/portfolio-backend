/**
 * Experience Routes
 * /api/experiences
 */

const express = require('express');
const router = express.Router();
const {
    getExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
} = require('../controllers/experienceController');
const { protect } = require('../middleware/auth');
const { validateExperience } = require('../middleware/validation');

// Public routes
router.get('/', getExperiences);
router.get('/:id', getExperience);

// Protected routes (admin only)
router.post('/', protect, validateExperience, createExperience);
router.put('/:id', protect, validateExperience, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;
