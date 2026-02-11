/**
 * Experience Controller
 * CRUD operations for work experience/education
 */

const Experience = require('../models/Experience');

/**
 * @desc    Get all experiences
 * @route   GET /api/experiences
 * @access  Public
 */
const getExperiences = async (req, res) => {
    try {
        const { type } = req.query;

        const query = type ? { type } : {};
        const experiences = await Experience.find(query).sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching experiences'
        });
    }
};

/**
 * @desc    Get single experience
 * @route   GET /api/experiences/:id
 * @access  Public
 */
const getExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            data: experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching experience'
        });
    }
};

/**
 * @desc    Create experience
 * @route   POST /api/experiences
 * @access  Private
 */
const createExperience = async (req, res) => {
    try {
        // If current is true, set endDate to null
        if (req.body.current) {
            req.body.endDate = null;
        }

        const experience = await Experience.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Experience created successfully',
            data: experience
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
            message: 'Error creating experience'
        });
    }
};

/**
 * @desc    Update experience
 * @route   PUT /api/experiences/:id
 * @access  Private
 */
const updateExperience = async (req, res) => {
    try {
        // If current is true, set endDate to null
        if (req.body.current) {
            req.body.endDate = null;
        }

        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Experience updated successfully',
            data: experience
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
            message: 'Error updating experience'
        });
    }
};

/**
 * @desc    Delete experience
 * @route   DELETE /api/experiences/:id
 * @access  Private
 */
const deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting experience'
        });
    }
};

module.exports = {
    getExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
};
