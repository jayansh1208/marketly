const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// User registration validation
exports.registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// User login validation
exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Product validation
exports.productValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Product description is required')
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Toys', 'Beauty', 'Other'])
        .withMessage('Please select a valid category'),
    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Order validation
exports.orderValidation = [
    body('shippingAddress.fullName')
        .trim()
        .notEmpty().withMessage('Full name is required'),
    body('shippingAddress.address')
        .trim()
        .notEmpty().withMessage('Address is required'),
    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode')
        .trim()
        .notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.country')
        .trim()
        .notEmpty().withMessage('Country is required'),
    body('shippingAddress.phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Please provide a valid phone number')
        .isLength({ min: 7, max: 20 }).withMessage('Phone number must be between 7 and 20 characters')
];
