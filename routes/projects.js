/**
 * Project Routes
 * /api/projects
 */

const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes (admin only)
router.post('/', protect, validateProject, createProject);
router.put('/reorder', protect, reorderProjects);
router.put('/:id', protect, validateProject, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
