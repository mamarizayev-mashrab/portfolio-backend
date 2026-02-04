/**
 * Input Validation Middleware
 * Uses express-validator for request validation
 */

const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Login validation rules
const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Password change validation rules
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),
    handleValidationErrors
];

// Project validation rules
const validateProject = [
    body('title.uz').notEmpty().withMessage('Uzbek title is required'),
    body('title.en').notEmpty().withMessage('English title is required'),
    body('title.ru').notEmpty().withMessage('Russian title is required'),
    body('description.uz').notEmpty().withMessage('Uzbek description is required'),
    body('description.en').notEmpty().withMessage('English description is required'),
    body('description.ru').notEmpty().withMessage('Russian description is required'),
    handleValidationErrors
];

// Skill validation rules
const validateSkill = [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('category').isIn(['frontend', 'backend', 'database', 'devops', 'tools', 'other'])
        .withMessage('Invalid category'),
    body('proficiency').optional().isInt({ min: 0, max: 100 })
        .withMessage('Proficiency must be between 0 and 100'),
    handleValidationErrors
];

// Experience validation rules
const validateExperience = [
    body('title.uz').notEmpty().withMessage('Uzbek title is required'),
    body('title.en').notEmpty().withMessage('English title is required'),
    body('title.ru').notEmpty().withMessage('Russian title is required'),
    body('company').notEmpty().withMessage('Company name is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    handleValidationErrors
];

// Contact message validation rules
const validateMessage = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ max: 5000 })
        .withMessage('Message cannot exceed 5000 characters'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateLogin,
    validatePasswordChange,
    validateProject,
    validateSkill,
    validateExperience,
    validateMessage
};
