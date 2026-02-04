/**
 * Skill Model - Technical skills
 * Categorized with proficiency levels
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    // Skill name
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true
    },
    // Icon class or URL (e.g., 'devicon-react-original' or icon URL)
    icon: {
        type: String,
        default: ''
    },
    // Skill category
    category: {
        type: String,
        enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'other'],
        default: 'other'
    },
    // Proficiency level (0-100)
    proficiency: {
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
    timestamps: true
});

// Index for ordering
skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
