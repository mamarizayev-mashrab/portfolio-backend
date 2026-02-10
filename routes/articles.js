/**
 * Article & Comment Routes
 * /api/articles
 */

const express = require('express');
const router = express.Router();
const {
    getArticles,
    getAllArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    incrementView,
    toggleLike,
    getLikeStatus
} = require('../controllers/articleController');
const {
    getComments,
    getAllComments,
    createComment,
    toggleApproval,
    deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// ========== ARTICLE ROUTES ==========

// Public - get published articles
router.get('/', getArticles);

// Admin - get ALL articles (must be BEFORE /:id to avoid conflict)
router.get('/admin/all', protect, getAllArticles);

// Comment moderation routes (must be before /:id)
router.patch('/comments/:id/approve', protect, toggleApproval);
router.delete('/comments/:id', protect, deleteComment);

// Public - single article & interactions
router.get('/:id', getArticle);
router.patch('/:id/view', incrementView);
router.patch('/:id/like', toggleLike);
router.get('/:id/like-status', getLikeStatus);

// Admin - CRUD
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

// ========== COMMENT ROUTES ==========

// Public
router.get('/:articleId/comments', getComments);
router.post('/:articleId/comments', createComment);

// Admin
router.get('/:articleId/comments/admin', protect, getAllComments);

module.exports = router;
