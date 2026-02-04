/**
 * Message Controller
 * Handles contact form submissions
 */

const Message = require('../models/Message');
const { sendContactNotification } = require('../utils/email');

/**
 * @desc    Get all messages
 * @route   GET /api/messages
 * @access  Private
 */
const getMessages = async (req, res) => {
    try {
        const { read } = req.query;

        const query = {};
        if (read === 'true') query.read = true;
        if (read === 'false') query.read = false;

        const messages = await Message.find(query).sort({ createdAt: -1 });

        // Count unread messages
        const unreadCount = await Message.countDocuments({ read: false });

        res.status(200).json({
            success: true,
            count: messages.length,
            unreadCount,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching messages'
        });
    }
};

/**
 * @desc    Get single message
 * @route   GET /api/messages/:id
 * @access  Private
 */
const getMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching message'
        });
    }
};

/**
 * @desc    Create message (contact form submission)
 * @route   POST /api/messages
 * @access  Public
 */
const createMessage = async (req, res) => {
    try {
        // Get IP address for tracking
        const ipAddress = req.ip || req.connection.remoteAddress || '';

        const message = await Message.create({
            ...req.body,
            ipAddress
        });

        // Send email notification (async, don't wait)
        sendContactNotification(message).catch(err => {
            console.error('Email notification failed:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error sending message'
        });
    }
};

/**
 * @desc    Mark message as read
 * @route   PATCH /api/messages/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message marked as read',
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating message'
        });
    }
};

/**
 * @desc    Delete message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting message'
        });
    }
};

/**
 * @desc    Delete all read messages
 * @route   DELETE /api/messages/read
 * @access  Private
 */
const deleteReadMessages = async (req, res) => {
    try {
        const result = await Message.deleteMany({ read: true });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} read messages deleted`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting messages'
        });
    }
};

module.exports = {
    getMessages,
    getMessage,
    createMessage,
    markAsRead,
    deleteMessage,
    deleteReadMessages
};
