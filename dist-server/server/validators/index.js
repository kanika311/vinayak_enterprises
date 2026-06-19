"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidation = exports.rfqValidation = exports.leadValidation = exports.productValidation = exports.loginValidation = void 0;
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
    (0, express_validator_1.body)('name').notEmpty(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('companyName').notEmpty(),
    (0, express_validator_1.body)('product').notEmpty(),
    (0, express_validator_1.body)('quantity').isInt({ min: 1 }),
];
exports.blogValidation = [
    (0, express_validator_1.body)('title').notEmpty(),
    (0, express_validator_1.body)('content').notEmpty(),
];
