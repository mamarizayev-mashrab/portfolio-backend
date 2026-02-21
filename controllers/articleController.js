/**
 * Article Controller
 * CRUD operations + like & view tracking
 */

const Article = require('../models/Article');
const Comment = require('../models/Comment');

/**
 * @desc    Get all published articles (public)
 * @route   GET /api/articles
 * @access  Public
 */
const getArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const tag = req.query.tag;

        let query = { status: 'published' };
        if (tag) {
            query.tags = { $regex: new RegExp(`^${tag}$`, 'i') };
        }

        let clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        if (clientIP.includes(',')) {
            clientIP = clientIP.split(',')[0].trim();
        }

        const total = await Article.countDocuments(query);
        const articlesData = await Article.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        // Transform to hide IPs but keep count and check if current user liked it
        const articles = articlesData.map(art => {
            const obj = art.toObject();
            obj.likeCount = art.likes ? art.likes.length : 0;
            obj.liked = art.likes ? art.likes.includes(clientIP) : false;
            delete obj.likes;
            return obj;
        });

        res.status(200).json({
            success: true,
            count: articles.length,
            total,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: articles
        });
    } catch (error) {
        console.error('Fetch Articles Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching articles'
        });
    }
};

/**
 * @desc    Get all articles (admin - includes drafts)
 * @route   GET /api/articles/admin
 * @access  Private
 */
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .sort({ order: 1, createdAt: -1 });

        // Get comment counts for each article
        const articlesWithComments = await Promise.all(
            articles.map(async (article) => {
                const commentCount = await Comment.countDocuments({ article: article._id });
                const pendingComments = await Comment.countDocuments({ article: article._id, approved: false });
                const obj = article.toObject();
                obj.commentCount = commentCount;
                obj.pendingComments = pendingComments;
                return obj;
            })
        );

        res.status(200).json({
            success: true,
            count: articlesWithComments.length,
            data: articlesWithComments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching articles'
        });
    }
};

/**
 * @desc    Get single article
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticle = async (req, res) => {
    try {
        const articleData = await Article.findById(req.params.id);

        if (!articleData) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Get approved comments
        const comments = await Comment.find({
            article: articleData._id,
            approved: true
        }).sort({ createdAt: -1 });

        let clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        if (clientIP.includes(',')) {
            clientIP = clientIP.split(',')[0].trim();
        }

        const obj = articleData.toObject();
        obj.likeCount = articleData.likes ? articleData.likes.length : 0;
        obj.liked = articleData.likes ? articleData.likes.includes(clientIP) : false;
        delete obj.likes;
        obj.comments = comments;

        res.status(200).json({
            success: true,
            data: obj
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching article'
        });
    }
};

/**
 * @desc    Create article
 * @route   POST /api/articles
 * @access  Private
 */
const createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);

        res.status(201).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating article'
        });
    }
};

/**
 * @desc    Update article
 * @route   PUT /api/articles/:id
 * @access  Private
 */
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating article'
        });
    }
};

/**
 * @desc    Delete article
 * @route   DELETE /api/articles/:id
 * @access  Private
 */
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Also delete all comments for this article
        await Comment.deleteMany({ article: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting article'
        });
    }
};

/**
 * @desc    Increment view count
 * @route   PATCH /api/articles/:id/view
 * @access  Public
 */
const incrementView = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            views: article.views
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating view count'
        });
    }
};

/**
 * @desc    Toggle like (1 user = 1 like, based on IP)
 * @route   PATCH /api/articles/:id/like
 * @access  Public
 */
const toggleLike = async (req, res) => {
    try {
        let clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        if (clientIP.includes(',')) {
            clientIP = clientIP.split(',')[0].trim();
        }

        // First, check if the article exists
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        const isLiked = article.likes && article.likes.includes(clientIP);
        let updatedArticle;

        if (isLiked) {
            // Unlike: remove IP from the array
            updatedArticle = await Article.findByIdAndUpdate(
                req.params.id,
                { $pull: { likes: clientIP } },
                { new: true, runValidators: false }
            );
        } else {
            // Like: add IP to the array (using $addToSet to ensure uniqueness)
            updatedArticle = await Article.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { likes: clientIP } },
                { new: true, runValidators: false }
            );
        }

        res.status(200).json({
            success: true,
            liked: !isLiked,
            likeCount: updatedArticle.likes.length,
            message: !isLiked ? 'Article liked' : 'Like removed'
        });
    } catch (error) {
        console.error('Like Toggle Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling like',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * @desc    Check if user liked article
 * @route   GET /api/articles/:id/like-status
 * @access  Public
 */
const getLikeStatus = async (req, res) => {
    try {
        let clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

        if (clientIP.includes(',')) {
            clientIP = clientIP.split(',')[0].trim();
        }

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            liked: article.likes ? article.likes.includes(clientIP) : false,
            likeCount: article.likes ? article.likes.length : 0
        });
    } catch (error) {
        console.error('Get Like Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting like status'
        });
    }
};

module.exports = {
    getArticles,
    getAllArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    incrementView,
    toggleLike,
    getLikeStatus
};
