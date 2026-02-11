/**
 * Skill Model - Technical skills
 * Supports i18n for name, categorized with proficiency levels
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    // i18n skill name object
    name: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Skill name is required']
    },
    // Icon class or URL (e.g., 'devicon-react-original' or icon URL)
    icon: {
        type: String,
        default: ''
    },
    // Skill category (case-insensitive, stored lowercase)
    category: {
        type: String,
        enum: ['frontend', 'backend', 'mobile', 'database', 'devops', 'tools', 'other'],
        default: 'other',
        set: v => v ? v.toLowerCase() : 'other'
    },
    // Progress bar value (0-100)
    level: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, 'Skill level is required'],
        default: 0
    },
    // Display order within category
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware
skillSchema.pre('save', function (next) {
    // Normalize category to lowercase
    if (this.category) {
        this.category = this.category.toLowerCase();
    }
    next();
});

// Pre-update middleware
skillSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    // Normalize category in updates
    if (update.category) {
        update.category = update.category.toLowerCase();
    }

    // Handle proficiency alias from old requests
    if (update.proficiency && !update.level) {
        update.level = update.proficiency;
    }

    next();
});

// Index for ordering
skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
