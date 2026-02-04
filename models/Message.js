/**
 * Message Model - Contact form submissions
 * Stores messages from portfolio visitors
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Sender's name
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    // Sender's email
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    // Subject (optional)
    subject: {
        type: String,
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
        default: ''
    },
    // Message content
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    // Read status
    read: {
        type: Boolean,
        default: false
    },
    // Replied status
    replied: {
        type: Boolean,
        default: false
    },
    // IP address for rate limiting
    ipAddress: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for sorting by date
messageSchema.index({ createdAt: -1 });
messageSchema.index({ read: 1 });

module.exports = mongoose.model('Message', messageSchema);
