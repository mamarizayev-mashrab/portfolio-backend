/**
 * Project Model - Portfolio projects
 * Supports i18n for title and description
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // i18n title object
    title: {
        uz: { type: String, required: [true, 'Uzbek title is required'] },
        en: { type: String, required: [true, 'English title is required'] },
        ru: { type: String, required: [true, 'Russian title is required'] }
    },
    // i18n description object
    description: {
        uz: { type: String, required: [true, 'Uzbek description is required'] },
        en: { type: String, required: [true, 'English description is required'] },
        ru: { type: String, required: [true, 'Russian description is required'] }
    },
    // Project thumbnail/image URL
    image: {
        type: String,
        default: ''
    },
    // Technologies used
    technologies: [{
        type: String,
        trim: true
    }],
    // Live project URL
    liveUrl: {
        type: String,
        default: ''
    },
    // GitHub repository URL
    githubUrl: {
        type: String,
        default: ''
    },
    // Featured project flag
    featured: {
        type: Boolean,
        default: false
    },
    // Display order
    order: {
        type: Number,
        default: 0
    },
    // Project status
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    }
}, {
    timestamps: true
});

// Index for ordering
projectSchema.index({ order: 1 });

// Virtual for getting all titles
projectSchema.virtual('allTitles').get(function () {
    return {
        uz: this.title.uz,
        en: this.title.en,
        ru: this.title.ru
    };
});

module.exports = mongoose.model('Project', projectSchema);
