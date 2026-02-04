/**
 * Project Controller
 * CRUD operations for portfolio projects
 */

const Project = require('../models/Project');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res) => {
    try {
        const { status, featured } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;
        if (featured === 'true') query.featured = true;

        const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching projects'
        });
    }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching project'
        });
    }
};

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating project'
        });
    }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating project'
        });
    }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting project'
        });
    }
};

/**
 * @desc    Reorder projects
 * @route   PUT /api/projects/reorder
 * @access  Private
 */
const reorderProjects = async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, order }

        const updatePromises = orders.map(({ id, order }) =>
            Project.findByIdAndUpdate(id, { order })
        );

        await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: 'Projects reordered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reordering projects'
        });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects
};
