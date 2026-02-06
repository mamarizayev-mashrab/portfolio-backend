/**
 * Skill Model - Technical skills
 * Supports i18n for name, categorized with proficiency levels
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    // i18n skill name object (can be string for backward compatibility)
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
        enum: ['frontend', 'backend', 'mobile', 'database', 'devops', 'tools', 'other',
            'Frontend', 'Backend', 'Mobile', 'Database', 'DevOps', 'Tools', 'Other'],
        default: 'other',
        set: v => v ? v.toLowerCase() : 'other'
    },
    // Proficiency/Level (0-100) - supports both field names
    proficiency: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
    },
    level: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
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

// Pre-save middleware to sync level and proficiency
skillSchema.pre('save', function (next) {
    // If level is set but proficiency is not, sync them
    if (this.level && !this.proficiency) {
        this.proficiency = this.level;
    }
    if (this.proficiency && !this.level) {
        this.level = this.proficiency;
    }
    // Normalize category to lowercase
    if (this.category) {
        this.category = this.category.toLowerCase();
    }
    next();
});

// Pre-update middleware
skillSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.level && !update.proficiency) {
        update.proficiency = update.level;
    }
    if (update.proficiency && !update.level) {
        update.level = update.proficiency;
    }
    if (update.category) {
        update.category = update.category.toLowerCase();
    }
    next();
});

// Index for ordering
skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
