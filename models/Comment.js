/**
 * Comment Model - Comments for articles
 * Requires admin approval before being visible
 */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    // Reference to article
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, 'Article reference is required']
    },
    // Commenter name
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    // Commenter email (optional, not shown publicly)
    email: {
        type: String,
        trim: true,
        default: ''
    },
    // Comment content
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    // Admin approval status
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
commentSchema.index({ article: 1, createdAt: -1 });
commentSchema.index({ approved: 1 });

module.exports = mongoose.model('Comment', commentSchema);
