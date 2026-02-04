/**
 * Experience Model - Work experience/education timeline
 * Supports i18n for title and description
 */

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    // i18n title object
    title: {
        uz: { type: String, required: [true, 'Uzbek title is required'] },
        en: { type: String, required: [true, 'English title is required'] },
        ru: { type: String, required: [true, 'Russian title is required'] }
    },
    // Company/Organization name
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    // i18n description object
    description: {
        uz: { type: String, default: '' },
        en: { type: String, default: '' },
        ru: { type: String, default: '' }
    },
    // Experience type
    type: {
        type: String,
        enum: ['work', 'education', 'freelance', 'other'],
        default: 'work'
    },
    // Location
    location: {
        type: String,
        default: ''
    },
    // Start date
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    // End date (null if current)
    endDate: {
        type: Date,
        default: null
    },
    // Currently working here
    current: {
        type: Boolean,
        default: false
    },
    // Display order
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for ordering by date
experienceSchema.index({ startDate: -1 });

// Virtual for formatted date range
experienceSchema.virtual('dateRange').get(function () {
    const start = this.startDate ? this.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    const end = this.current ? 'Present' : (this.endDate ? this.endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
    return `${start} - ${end}`;
});

module.exports = mongoose.model('Experience', experienceSchema);
