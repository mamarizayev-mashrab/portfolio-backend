/**
 * Experience Model - Work experience/education timeline
 * Supports i18n for title/role, company and description
 */

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    // i18n title object (position/role)
    title: {
        uz: { type: String, default: '' },
        en: { type: String, default: '' },
        ru: { type: String, default: '' }
    },
    // i18n role object (alias for title, for frontend compatibility)
    role: {
        uz: { type: String, default: '' },
        en: { type: String, default: '' },
        ru: { type: String, default: '' }
    },
    // Company/Organization - supports both string and i18n object
    company: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Company name is required']
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

// Pre-save middleware to sync title and role
experienceSchema.pre('save', function (next) {
    // If role is provided but title is empty, copy role to title
    if (this.role && (this.role.en || this.role.uz || this.role.ru)) {
        if (!this.title.en) this.title.en = this.role.en || '';
        if (!this.title.uz) this.title.uz = this.role.uz || '';
        if (!this.title.ru) this.title.ru = this.role.ru || '';
    }
    // Vice versa: if title is provided but role is empty
    if (this.title && (this.title.en || this.title.uz || this.title.ru)) {
        if (!this.role.en) this.role.en = this.title.en || '';
        if (!this.role.uz) this.role.uz = this.title.uz || '';
        if (!this.role.ru) this.role.ru = this.title.ru || '';
    }
    next();
});

// Pre-update middleware
experienceSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    // Sync role and title in updates
    if (update.role && !update.title) {
        update.title = update.role;
    }
    if (update.title && !update.role) {
        update.role = update.title;
    }

    next();
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
