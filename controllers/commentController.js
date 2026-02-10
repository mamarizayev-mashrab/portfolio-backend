/**
 * Comment Controller
 * CRUD + moderation for article comments
 */

const Comment = require('../models/Comment');
const Article = require('../models/Article');

/**
 * @desc    Get approved comments for an article (public)
 * @route   GET /api/articles/:articleId/comments
 * @access  Public
 */
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            article: req.params.articleId,
            approved: true
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching comments'
        });
    }
};

/**
 * @desc    Get ALL comments for an article (admin - includes unapproved)
 * @route   GET /api/articles/:articleId/comments/admin
 * @access  Private
 */
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            article: req.params.articleId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching comments'
        });
    }
};

/**
 * @desc    Create comment (public, if comments enabled)
 * @route   POST /api/articles/:articleId/comments
 * @access  Public
 */
const createComment = async (req, res) => {
    try {
        // Check if article exists
        const article = await Article.findById(req.params.articleId);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // If comments are explicitly disabled (false), only then block. 
        // If undefined/true, allow them.
        if (article.commentsEnabled === false) {
            return res.status(403).json({
                success: false,
                message: 'Comments are disabled for this article'
            });
        }

        const comment = await Comment.create({
            article: req.params.articleId,
            name: req.body.name,
            email: req.body.email || '',
            content: req.body.content
        });

        res.status(201).json({
            success: true,
            data: comment,
            message: 'Comment submitted for review'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating comment'
        });
    }
};

/**
 * @desc    Approve/reject comment
 * @route   PATCH /api/comments/:id/approve
 * @access  Private
 */
const toggleApproval = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        comment.approved = !comment.approved;
        await comment.save();

        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating comment'
        });
    }
};

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting comment'
        });
    }
};

module.exports = {
    getComments,
    getAllComments,
    createComment,
    toggleApproval,
    deleteComment
};
