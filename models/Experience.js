/**
 * Experience Model - Work experience/education timeline
 * Supports i18n for role, company and description
 */

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    // i18n role object (position/role)
    role: {
        uz: { type: String, default: '' },
        en: { type: String, default: '', required: [true, 'English role is required'] },
        ru: { type: String, default: '' }
    },
    // Company/Organization - strict i18n object
    company: {
        uz: { type: String, default: '' },
        en: { type: String, default: '', required: [true, 'English company name is required'] },
        ru: { type: String, default: '' }
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-update middleware to handle title alias from old requests
experienceSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.title && !update.role) {
        update.role = update.title;
    }
    // Backward compatibility for company if sent as string (wrap in i18n object)
    if (typeof update.company === 'string') {
        const name = update.company;
        update.company = { uz: name, en: name, ru: name };
    }
    next();
});

// Index for ordering by date and explicit order
experienceSchema.index({ startDate: -1 });
experienceSchema.index({ order: 1 });

// Virtual for formatted date range
experienceSchema.virtual('dateRange').get(function () {
    const start = this.startDate ? this.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    const end = this.current ? 'Present' : (this.endDate ? this.endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
    return `${start} - ${end}`;
});

module.exports = mongoose.model('Experience', experienceSchema);
