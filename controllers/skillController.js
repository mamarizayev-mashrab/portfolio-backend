/**
 * Skill Controller
 * CRUD operations for skills
 */

const Skill = require('../models/Skill');

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Public
 */
const getSkills = async (req, res) => {
    try {
        const { category } = req.query;

        const query = category ? { category } : {};
        const skills = await Skill.find(query).sort({ category: 1, order: 1 });

        // Group by category for frontend convenience
        const grouped = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills,
            grouped
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching skills'
        });
    }
};

/**
 * @desc    Get single skill
 * @route   GET /api/skills/:id
 * @access  Public
 */
const getSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.status(200).json({
            success: true,
            data: skill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching skill'
        });
    }
};

/**
 * @desc    Create skill
 * @route   POST /api/skills
 * @access  Private
 */
const createSkill = async (req, res) => {
    try {
        const skill = await Skill.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: skill
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
            message: 'Error creating skill'
        });
    }
};

/**
 * @desc    Update skill
 * @route   PUT /api/skills/:id
 * @access  Private
 */
const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Skill updated successfully',
            data: skill
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
            message: 'Error updating skill'
        });
    }
};

/**
 * @desc    Delete skill
 * @route   DELETE /api/skills/:id
 * @access  Private
 */
const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting skill'
        });
    }
};

module.exports = {
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill
};
