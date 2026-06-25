"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const upload_1 = require("../middleware/upload");
const constants_1 = require("../constants");
const validators_1 = require("../validators");
const authCtrl = __importStar(require("../controllers/authController"));
const productCtrl = __importStar(require("../controllers/productController"));
const moduleCtrl = __importStar(require("../controllers/moduleController"));
const router = (0, express_1.Router)();
// Auth
router.post('/auth/login', rateLimiter_1.authLimiter, validators_1.loginValidation, validate_1.validate, authCtrl.login);
router.post('/auth/forgot-password', authCtrl.forgotPassword);
router.post('/auth/reset-password', authCtrl.resetPassword);
router.get('/auth/me', auth_1.protect, authCtrl.getMe);
router.get('/admins', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.USERS), authCtrl.getAdmins);
router.post('/admins', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.USERS), authCtrl.createAdmin);
router.put('/admins/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.USERS), authCtrl.updateAdmin);
// Dashboard
router.get('/dashboard', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.DASHBOARD), authCtrl.getDashboard);
// Products - Public
router.get('/products', productCtrl.getProducts);
router.get('/products/slug/:slug', productCtrl.getProductBySlug);
// Products - Admin
router.get('/products/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.PRODUCTS), productCtrl.getProduct);
router.post('/products', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.PRODUCTS), validators_1.productValidation, validate_1.validate, productCtrl.createProduct);
router.put('/products/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.PRODUCTS), productCtrl.updateProduct);
router.delete('/products/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.PRODUCTS), productCtrl.deleteProduct);
// Categories
router.get('/categories', moduleCtrl.getCategories);
router.get('/categories/slug/:slug', moduleCtrl.getCategoryBySlug);
router.post('/categories', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CATEGORIES), moduleCtrl.createCategory);
router.put('/categories/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CATEGORIES), moduleCtrl.updateCategory);
router.delete('/categories/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CATEGORIES), moduleCtrl.deleteCategory);
// Leads
router.post('/leads', validators_1.leadValidation, validate_1.validate, moduleCtrl.createLead);
router.get('/leads', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.LEADS), moduleCtrl.getLeads);
router.put('/leads/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.LEADS), moduleCtrl.updateLead);
router.post('/leads/:id/notes', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.LEADS), moduleCtrl.addLeadNote);
router.put('/leads/:id/assign', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.LEADS), moduleCtrl.assignLead);
// RFQs
router.post('/rfqs', validators_1.rfqValidation, validate_1.validate, moduleCtrl.createRFQ);
router.get('/rfqs', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.RFQS), moduleCtrl.getRFQs);
router.put('/rfqs/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.RFQS), moduleCtrl.updateRFQ);
router.get('/rfqs/report', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.RFQS), moduleCtrl.getRFQReport);
// Blogs
router.get('/blogs', auth_1.optionalAuth, moduleCtrl.getBlogs);
router.get('/blogs/slug/:slug', moduleCtrl.getBlogBySlug);
router.get('/blogs/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.BLOGS), moduleCtrl.getBlogById);
router.post('/blogs', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.BLOGS), validators_1.blogValidation, validate_1.validate, moduleCtrl.createBlog);
router.put('/blogs/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.BLOGS), moduleCtrl.updateBlog);
router.delete('/blogs/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.BLOGS), moduleCtrl.deleteBlog);
// Catalogues
router.get('/catalogues', moduleCtrl.getCatalogues);
router.post('/catalogues', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CATALOGUES), moduleCtrl.createCatalogue);
router.post('/catalogues/:id/download', moduleCtrl.trackDownload);
router.delete('/catalogues/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CATALOGUES), moduleCtrl.deleteCatalogue);
// Testimonials
router.get('/testimonials', moduleCtrl.getTestimonials);
router.post('/testimonials', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.TESTIMONIALS), moduleCtrl.createTestimonial);
router.put('/testimonials/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.TESTIMONIALS), moduleCtrl.updateTestimonial);
router.delete('/testimonials/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.TESTIMONIALS), moduleCtrl.deleteTestimonial);
// Customers
router.get('/customers', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CUSTOMERS), moduleCtrl.getCustomers);
router.post('/customers', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CUSTOMERS), moduleCtrl.createCustomer);
router.put('/customers/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CUSTOMERS), moduleCtrl.updateCustomer);
router.delete('/customers/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.CUSTOMERS), moduleCtrl.deleteCustomer);
// Newsletter
router.post('/subscribers', moduleCtrl.subscribe);
router.get('/subscribers', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.NEWSLETTER), moduleCtrl.getSubscribers);
router.get('/subscribers/export', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.NEWSLETTER), moduleCtrl.exportSubscribers);
// Inquiries
router.post('/inquiries', moduleCtrl.createInquiry);
router.get('/inquiries', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.INQUIRIES), moduleCtrl.getInquiries);
router.put('/inquiries/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.INQUIRIES), moduleCtrl.updateInquiry);
// Media
router.get('/media', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.MEDIA), moduleCtrl.getMedia);
router.post('/media/upload', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.MEDIA), upload_1.upload.single('file'), moduleCtrl.uploadMedia);
router.delete('/media/:id', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.MEDIA), moduleCtrl.deleteMedia);
// Pages CMS
router.get('/pages', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.PAGES), moduleCtrl.getPages);
router.get('/pages/:slug', moduleCtrl.getPageBySlug);
router.put('/pages/:slug', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.PAGES), moduleCtrl.upsertPage);
// Settings
router.get('/settings', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.SETTINGS), moduleCtrl.getSettings);
router.put('/settings', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.SETTINGS), moduleCtrl.updateSettings);
// SEO
router.get('/seo', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.SEO), moduleCtrl.getSEOEntries);
router.put('/seo/:path(*)', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.SEO), moduleCtrl.upsertSEO);
router.get('/sitemap.xml', moduleCtrl.getSitemap);
router.get('/robots.txt', moduleCtrl.getRobotsTxt);
// Analytics
router.post('/analytics/track', moduleCtrl.trackEvent);
router.get('/analytics', auth_1.protect, (0, auth_1.authorize)(constants_1.PERMISSIONS.ANALYTICS), moduleCtrl.getAnalytics);
exports.default = router;
