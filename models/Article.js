/**
 * Article Model - Blog/Articles for portfolio
 * Supports i18n for title and content
 */

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    // i18n title
    title: {
        uz: { type: String, required: [true, 'Uzbek title is required'] },
        en: { type: String, required: [true, 'English title is required'] },
        ru: { type: String, required: [true, 'Russian title is required'] }
    },
    // i18n content (supports markdown or plain text)
    content: {
        uz: { type: String, required: [true, 'Uzbek content is required'] },
        en: { type: String, required: [true, 'English content is required'] },
        ru: { type: String, required: [true, 'Russian content is required'] }
    },
    // Optional image
    image: {
        type: String,
        default: ''
    },
    // View count
    views: {
        type: Number,
        default: 0
    },
    // Likes - stored as array of IP addresses to prevent duplicates
    likes: [{
        type: String
    }],
    // Whether comments are enabled for this article
    commentsEnabled: {
        type: Boolean,
        default: true
    },
    // Article status
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    // Tags/Hashtags
    tags: [{
        type: String,
        trim: true
    }],
    // Display order
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for ordering, status, and tags
articleSchema.index({ order: 1, createdAt: -1 });
articleSchema.index({ status: 1 });
articleSchema.index({ tags: 1 });

// Virtual for like count
articleSchema.virtual('likeCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

// Ensure virtuals are included in JSON
articleSchema.set('toJSON', { virtuals: true });
articleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Article', articleSchema);
