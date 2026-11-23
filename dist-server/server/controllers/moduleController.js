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
exports.uploadShowcaseVideo = exports.getVideoUploadSignature = exports.getShowcaseVideos = exports.getPublicVideos = exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.uploadBannerVideo = exports.getBanners = exports.getPublicBanners = exports.updateInquiry = exports.createInquiry = exports.getInquiries = exports.exportSubscribers = exports.subscribe = exports.getSubscribers = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomers = exports.deleteTestimonial = exports.updateTestimonial = exports.submitTestimonial = exports.createTestimonial = exports.getTestimonials = exports.deleteCatalogue = exports.trackDownload = exports.createCatalogue = exports.uploadCatalogueFile = exports.getCatalogues = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getCategoryBySlug = exports.getBlogById = exports.getBlogBySlug = exports.getBlogs = exports.getRFQReport = exports.updateRFQ = exports.createRFQ = exports.getRFQs = exports.assignLead = exports.addLeadNote = exports.updateLead = exports.createLead = exports.getLeads = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
exports.getAnalytics = exports.trackEvent = exports.getRobotsTxt = exports.getSitemap = exports.upsertSEO = exports.getSEOEntries = exports.updateSettings = exports.getSettings = exports.getPublicSettings = exports.upsertPage = exports.getPageBySlug = exports.getPages = exports.deleteMedia = exports.uploadMedia = exports.getMedia = exports.trackVideoView = exports.deleteShowcaseVideo = exports.updateShowcaseVideo = exports.createShowcaseVideo = void 0;
const helpers_1 = require("../utils/helpers");
const categoryService = __importStar(require("../services/categoryService"));
const leadService = __importStar(require("../services/leadService"));
const rfqService = __importStar(require("../services/rfqService"));
const blogService = __importStar(require("../services/blogService"));
const catalogueService = __importStar(require("../services/catalogueService"));
const miscService = __importStar(require("../services/miscService"));
const bannerService = __importStar(require("../services/bannerService"));
const videoService = __importStar(require("../services/videoService"));
// Categories
exports.getCategories = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400');
    }
    const activeOnly = req.query.active === 'true';
    const hasProducts = req.query.hasProducts === 'true';
    const categories = await categoryService.getCategories(activeOnly, hasProducts);
    (0, helpers_1.sendResponse)(res, 200, categories);
});
exports.createCategory = (0, helpers_1.asyncHandler)(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    (0, helpers_1.sendResponse)(res, 201, category);
});
exports.updateCategory = (0, helpers_1.asyncHandler)(async (req, res) => {
    const category = await categoryService.updateCategory((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, category);
});
exports.deleteCategory = (0, helpers_1.asyncHandler)(async (req, res) => {
    await categoryService.deleteCategory((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Category deleted');
});
// Leads
exports.getLeads = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await leadService.getLeads(req.query);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.createLead = (0, helpers_1.asyncHandler)(async (req, res) => {
    const lead = await leadService.createLead(req.body);
    (0, helpers_1.sendResponse)(res, 201, lead, 'Lead created');
});
exports.updateLead = (0, helpers_1.asyncHandler)(async (req, res) => {
    const lead = await leadService.updateLead((0, helpers_1.getParam)(req.params.id), req.body, req.user?.id);
    (0, helpers_1.sendResponse)(res, 200, lead);
});
exports.addLeadNote = (0, helpers_1.asyncHandler)(async (req, res) => {
    const lead = await leadService.addLeadNote((0, helpers_1.getParam)(req.params.id), req.body.text, req.user.id);
    (0, helpers_1.sendResponse)(res, 200, lead);
});
exports.assignLead = (0, helpers_1.asyncHandler)(async (req, res) => {
    const lead = await leadService.assignLead((0, helpers_1.getParam)(req.params.id), req.body.assignedTo, req.user.id);
    (0, helpers_1.sendResponse)(res, 200, lead);
});
// RFQs
exports.getRFQs = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await rfqService.getRFQs(req.query);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.createRFQ = (0, helpers_1.asyncHandler)(async (req, res) => {
    const rfq = await rfqService.createRFQ(req.body);
    (0, helpers_1.sendResponse)(res, 201, rfq);
});
exports.updateRFQ = (0, helpers_1.asyncHandler)(async (req, res) => {
    const rfq = await rfqService.updateRFQ((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, rfq);
});
exports.getRFQReport = (0, helpers_1.asyncHandler)(async (req, res) => {
    const report = await rfqService.getRFQReport(req.query);
    (0, helpers_1.sendResponse)(res, 200, report);
});
// Blogs
exports.getBlogs = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
    }
    const result = await blogService.getBlogs(req.query, !req.user);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.getBlogBySlug = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
    }
    const blog = await blogService.getBlogBySlug((0, helpers_1.getParam)(req.params.slug));
    (0, helpers_1.sendResponse)(res, 200, blog);
});
exports.getBlogById = (0, helpers_1.asyncHandler)(async (req, res) => {
    const blog = await blogService.getBlogById((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, blog);
});
exports.getCategoryBySlug = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400');
    }
    const category = await categoryService.getCategoryBySlug((0, helpers_1.getParam)(req.params.slug));
    (0, helpers_1.sendResponse)(res, 200, category);
});
exports.createBlog = (0, helpers_1.asyncHandler)(async (req, res) => {
    const blog = await blogService.createBlog({ ...req.body, author: req.user.id });
    (0, helpers_1.sendResponse)(res, 201, blog);
});
exports.updateBlog = (0, helpers_1.asyncHandler)(async (req, res) => {
    const blog = await blogService.updateBlog((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, blog);
});
exports.deleteBlog = (0, helpers_1.asyncHandler)(async (req, res) => {
    await blogService.deleteBlog((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Blog deleted');
});
// Catalogues
exports.getCatalogues = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await catalogueService.getCatalogues(req.query);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.uploadCatalogueFile = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return (0, helpers_1.sendResponse)(res, 400, null, 'No file uploaded');
    }
    const catalogue = await catalogueService.uploadCatalogue(req.file, req.body?.title);
    (0, helpers_1.sendResponse)(res, 201, catalogue, 'Catalogue uploaded successfully');
});
exports.createCatalogue = (0, helpers_1.asyncHandler)(async (req, res) => {
    const catalogue = await catalogueService.createCatalogue(req.body);
    (0, helpers_1.sendResponse)(res, 201, catalogue);
});
exports.trackDownload = (0, helpers_1.asyncHandler)(async (req, res) => {
    const catalogue = await catalogueService.trackDownload((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, catalogue);
});
exports.deleteCatalogue = (0, helpers_1.asyncHandler)(async (req, res) => {
    await catalogueService.deleteCatalogue((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Catalogue deleted');
});
// Testimonials
exports.getTestimonials = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400');
    }
    const items = await miscService.getTestimonials(!req.user);
    (0, helpers_1.sendResponse)(res, 200, items);
});
exports.createTestimonial = (0, helpers_1.asyncHandler)(async (req, res) => {
    const item = await miscService.createTestimonial(req.body);
    (0, helpers_1.sendResponse)(res, 201, item);
});
exports.submitTestimonial = (0, helpers_1.asyncHandler)(async (req, res) => {
    await miscService.submitTestimonial(req.body);
    (0, helpers_1.sendResponse)(res, 201, { submitted: true }, 'Thank you! Your review is awaiting approval.');
});
exports.updateTestimonial = (0, helpers_1.asyncHandler)(async (req, res) => {
    const item = await miscService.updateTestimonial((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, item);
});
exports.deleteTestimonial = (0, helpers_1.asyncHandler)(async (req, res) => {
    await miscService.deleteTestimonial((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Deleted');
});
// Customers
exports.getCustomers = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await miscService.getCustomers(req.query);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.createCustomer = (0, helpers_1.asyncHandler)(async (req, res) => {
    const item = await miscService.createCustomer(req.body);
    (0, helpers_1.sendResponse)(res, 201, item);
});
exports.updateCustomer = (0, helpers_1.asyncHandler)(async (req, res) => {
    const item = await miscService.updateCustomer((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, item);
});
exports.deleteCustomer = (0, helpers_1.asyncHandler)(async (req, res) => {
    await miscService.deleteCustomer((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Deleted');
});
// Subscribers
exports.getSubscribers = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await miscService.getSubscribers(req.query);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.subscribe = (0, helpers_1.asyncHandler)(async (req, res) => {
    const subscriber = await miscService.subscribe(req.body.email, req.body.name);
    (0, helpers_1.sendResponse)(res, 201, subscriber);
});
exports.exportSubscribers = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const csv = await miscService.exportSubscribersCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.send(csv);
});
// Inquiries
exports.getInquiries = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await miscService.getInquiries(req.query);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.createInquiry = (0, helpers_1.asyncHandler)(async (req, res) => {
    const inquiry = await miscService.createInquiry(req.body);
    (0, helpers_1.sendResponse)(res, 201, inquiry);
});
exports.updateInquiry = (0, helpers_1.asyncHandler)(async (req, res) => {
    const inquiry = await miscService.updateInquiry((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, inquiry);
});
// Banners (hero background videos)
exports.getPublicBanners = (0, helpers_1.asyncHandler)(async (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400');
    const banners = await bannerService.getPublicBanners(req.query.placement || 'hero');
    (0, helpers_1.sendResponse)(res, 200, banners);
});
exports.getBanners = (0, helpers_1.asyncHandler)(async (req, res) => {
    const banners = await bannerService.getBanners(req.query);
    (0, helpers_1.sendResponse)(res, 200, banners);
});
exports.uploadBannerVideo = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.file)
        throw new Error('No file uploaded');
    const result = await bannerService.uploadBannerVideo(req.file);
    (0, helpers_1.sendResponse)(res, 201, result);
});
exports.createBanner = (0, helpers_1.asyncHandler)(async (req, res) => {
    const banner = await bannerService.createBanner(req.body);
    (0, helpers_1.sendResponse)(res, 201, banner);
});
exports.updateBanner = (0, helpers_1.asyncHandler)(async (req, res) => {
    const banner = await bannerService.updateBanner((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, banner);
});
exports.deleteBanner = (0, helpers_1.asyncHandler)(async (req, res) => {
    await bannerService.deleteBanner((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Deleted');
});
// Showcase Videos (Equipment Demos & Lab Videos)
exports.getPublicVideos = (0, helpers_1.asyncHandler)(async (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400');
    const videos = await videoService.getPublicVideos(req.query.category);
    (0, helpers_1.sendResponse)(res, 200, videos);
});
exports.getShowcaseVideos = (0, helpers_1.asyncHandler)(async (req, res) => {
    const videos = await videoService.getVideos(req.query);
    (0, helpers_1.sendResponse)(res, 200, videos);
});
exports.getVideoUploadSignature = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const sig = videoService.getUploadSignature();
    (0, helpers_1.sendResponse)(res, 200, sig);
});
exports.uploadShowcaseVideo = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.file)
        throw new Error('No video file uploaded');
    const result = await videoService.uploadShowcaseVideoFile(req.file);
    (0, helpers_1.sendResponse)(res, 201, result);
});
exports.createShowcaseVideo = (0, helpers_1.asyncHandler)(async (req, res) => {
    const video = await videoService.createVideo(req.body);
    (0, helpers_1.sendResponse)(res, 201, video);
});
exports.updateShowcaseVideo = (0, helpers_1.asyncHandler)(async (req, res) => {
    const video = await videoService.updateVideo((0, helpers_1.getParam)(req.params.id), req.body);
    (0, helpers_1.sendResponse)(res, 200, video);
});
exports.deleteShowcaseVideo = (0, helpers_1.asyncHandler)(async (req, res) => {
    await videoService.deleteVideo((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Video deleted');
});
exports.trackVideoView = (0, helpers_1.asyncHandler)(async (req, res) => {
    const updated = await videoService.trackVideoView((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, { views: updated?.views || 0 });
});
// Media
exports.getMedia = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await miscService.getMedia(req.query);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.uploadMedia = (0, helpers_1.asyncHandler)(async (req, res) => {
    if (!req.file)
        throw new Error('No file uploaded');
    const media = await miscService.uploadMedia(req.file, req.user.id, req.body.folder);
    (0, helpers_1.sendResponse)(res, 201, media);
});
exports.deleteMedia = (0, helpers_1.asyncHandler)(async (req, res) => {
    await miscService.deleteMedia((0, helpers_1.getParam)(req.params.id));
    (0, helpers_1.sendResponse)(res, 200, null, 'Deleted');
});
// Pages CMS
exports.getPages = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const pages = await miscService.getPages();
    (0, helpers_1.sendResponse)(res, 200, pages);
});
exports.getPageBySlug = (0, helpers_1.asyncHandler)(async (req, res) => {
    const page = await miscService.getPageBySlug((0, helpers_1.getParam)(req.params.slug));
    (0, helpers_1.sendResponse)(res, 200, page);
});
exports.upsertPage = (0, helpers_1.asyncHandler)(async (req, res) => {
    const page = await miscService.upsertPage((0, helpers_1.getParam)(req.params.slug), req.body);
    (0, helpers_1.sendResponse)(res, 200, page);
});
// Settings
exports.getPublicSettings = (0, helpers_1.asyncHandler)(async (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const settings = await miscService.getPublicSettings();
    (0, helpers_1.sendResponse)(res, 200, settings);
});
exports.getSettings = (0, helpers_1.asyncHandler)(async (req, res) => {
    const settings = await miscService.getSettings(req.query.group);
    (0, helpers_1.sendResponse)(res, 200, settings);
});
exports.updateSettings = (0, helpers_1.asyncHandler)(async (req, res) => {
    const settings = await miscService.updateSettings(req.body, req.query.group);
    (0, helpers_1.sendResponse)(res, 200, settings, 'Settings saved');
});
// SEO
exports.getSEOEntries = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const entries = await miscService.getSEOEntries();
    (0, helpers_1.sendResponse)(res, 200, entries);
});
exports.upsertSEO = (0, helpers_1.asyncHandler)(async (req, res) => {
    const seo = await miscService.upsertSEO((0, helpers_1.getParam)(req.params.path), req.body);
    (0, helpers_1.sendResponse)(res, 200, seo);
});
exports.getSitemap = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const xml = await miscService.generateSitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
});
exports.getRobotsTxt = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const txt = await miscService.generateRobotsTxt();
    res.setHeader('Content-Type', 'text/plain');
    res.send(txt);
});
// Analytics
exports.trackEvent = (0, helpers_1.asyncHandler)(async (req, res) => {
    await miscService.trackEvent(req.body);
    (0, helpers_1.sendResponse)(res, 201, null, 'Event tracked');
});
exports.getAnalytics = (0, helpers_1.asyncHandler)(async (req, res) => {
    const data = await miscService.getAnalytics(req.query);
    (0, helpers_1.sendResponse)(res, 200, data);
});
