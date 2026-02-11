/**
 * Settings Controller
 * Handles site-wide settings and i18n content
 */

const Settings = require('../models/Settings');

/**
 * @desc    Get settings
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // If no settings exist, create default
        if (!settings) {
            settings = await Settings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching settings'
        });
    }
};

/**
 * @desc    Update settings
 * @route   PUT /api/settings
 * @access  Private
 */
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            // Deep merge settings
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                { $set: req.body },
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating settings'
        });
    }
};

/**
 * @desc    Update specific section
 * @route   PATCH /api/settings/:section
 * @access  Private
 */
const updateSection = async (req, res) => {
    try {
        const { section } = req.params;
        const allowedSections = ['hero', 'about', 'sectionTitles', 'contact', 'social', 'theme', 'footer'];

        if (!allowedSections.includes(section)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid section'
            });
        }

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        // Deep merge utility for settings section
        const deepMerge = (target, source) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
            return target;
        };

        // Update specific section with deep merge
        settings[section] = deepMerge(settings[section] || {}, req.body);

        // Mark as modified if it's a subdocument or mixed type
        settings.markModified(section);

        await settings.save();

        res.status(200).json({
            success: true,
            message: `${section} updated successfully`,
            data: settings
        });
    } catch (error) {
        console.error(`Error updating settings section ${req.params.section}:`, error);
        res.status(500).json({
            success: false,
            message: 'Error updating section'
        });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    updateSection
};
