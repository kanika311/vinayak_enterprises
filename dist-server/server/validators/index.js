"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialValidation = exports.blogValidation = exports.rfqValidation = exports.leadValidation = exports.productValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password required'),
];
exports.productValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Product name required'),
    (0, express_validator_1.body)('sku').trim().notEmpty().withMessage('SKU required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category required'),
    (0, express_validator_1.body)('shortDescription').notEmpty().withMessage('Short description required'),
    (0, express_validator_1.body)('longDescription').notEmpty().withMessage('Long description required'),
];
exports.leadValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('leadSource').notEmpty().withMessage('Lead source required'),
];
exports.rfqValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('companyName').trim().notEmpty().withMessage('Company name required'),
    (0, express_validator_1.body)('quantity').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    (0, express_validator_1.body)('product').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('productName').optional({ values: 'falsy' }),
];
exports.blogValidation = [
    (0, express_validator_1.body)('title').notEmpty(),
    (0, express_validator_1.body)('content').notEmpty(),
];
exports.testimonialValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name required'),
    (0, express_validator_1.body)('company').trim().notEmpty().withMessage('Company / institution required'),
    (0, express_validator_1.body)('review').trim().notEmpty().withMessage('Review required'),
    (0, express_validator_1.body)('rating').optional({ values: 'falsy' }).isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    (0, express_validator_1.body)('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email required'),
];
