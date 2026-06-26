import { body } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name required'),
  body('sku').trim().notEmpty().withMessage('SKU required'),
  body('category').notEmpty().withMessage('Category required'),
  body('shortDescription').notEmpty().withMessage('Short description required'),
  body('longDescription').notEmpty().withMessage('Long description required'),
];

export const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('leadSource').notEmpty().withMessage('Lead source required'),
];

export const rfqValidation = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('companyName').trim().notEmpty().withMessage('Company name required'),
  body('quantity').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('product').optional({ values: 'falsy' }),
  body('productName').optional({ values: 'falsy' }),
];

export const blogValidation = [
  body('title').notEmpty(),
  body('content').notEmpty(),
];

export const testimonialValidation = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('company').trim().notEmpty().withMessage('Company / institution required'),
  body('review').trim().notEmpty().withMessage('Review required'),
  body('rating').optional({ values: 'falsy' }).isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email required'),
];
