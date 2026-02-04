/**
 * Message Routes
 * /api/messages
 */

const express = require('express');
const router = express.Router();
const {
    getMessages,
    getMessage,
    createMessage,
    markAsRead,
    deleteMessage,
    deleteReadMessages
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimit');
const { validateMessage } = require('../middleware/validation');

// Public routes (contact form)
router.post('/', contactLimiter, validateMessage, createMessage);

// Protected routes (admin only)
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessage);
router.patch('/:id/read', protect, markAsRead);
router.delete('/read', protect, deleteReadMessages);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
