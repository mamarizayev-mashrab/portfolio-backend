/**
 * Skill Routes
 * /api/skills
 */

const express = require('express');
const router = express.Router();
const {
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');
const { validateSkill } = require('../middleware/validation');

// Public routes
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected routes (admin only)
router.post('/', protect, validateSkill, createSkill);
router.put('/:id', protect, validateSkill, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
