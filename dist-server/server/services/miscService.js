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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.trackEvent = exports.generateRobotsTxt = exports.generateSitemap = exports.upsertSEO = exports.getSEOByPath = exports.getSEOEntries = exports.updateSettings = exports.getSettings = exports.upsertPage = exports.getPageBySlug = exports.getPages = exports.deleteMedia = exports.uploadMedia = exports.getMedia = exports.updateInquiry = exports.createInquiry = exports.getInquiries = exports.exportSubscribersCSV = exports.subscribe = exports.getSubscribers = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomers = exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonials = void 0;
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Subscriber_1 = __importDefault(require("../models/Subscriber"));
const Inquiry_1 = __importDefault(require("../models/Inquiry"));
const Media_1 = __importDefault(require("../models/Media"));
const Page_1 = __importDefault(require("../models/Page"));
const Setting_1 = __importDefault(require("../models/Setting"));
const SEO_1 = __importDefault(require("../models/SEO"));
const Analytics_1 = __importDefault(require("../models/Analytics"));
const helpers_1 = require("../utils/helpers");
const cloudinaryService_1 = require("./cloudinaryService");
// Testimonials
const getTestimonials = async (activeOnly = false) => {
    const filter = activeOnly ? { isActive: true } : {};
    return Testimonial_1.default.find(filter).sort({ order: 1 });
};
exports.getTestimonials = getTestimonials;
const createTestimonial = async (data) => Testimonial_1.default.create(data);
exports.createTestimonial = createTestimonial;
const updateTestimonial = async (id, data) => {
    const item = await Testimonial_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!item)
        throw new helpers_1.AppError('Testimonial not found', 404);
    return item;
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (id) => {
    const item = await Testimonial_1.default.findByIdAndDelete(id);
    if (!item)
        throw new helpers_1.AppError('Testimonial not found', 404);
    return item;
};
exports.deleteTestimonial = deleteTestimonial;
// Customers
const getCustomers = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (query.type)
        filter.type = query.type;
    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { company: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
        ];
    }
    const sort = (0, helpers_1.buildSort)(query.sortBy, query.order);
    const [customers, total] = await Promise.all([
        Customer_1.default.find(filter).sort(sort).skip(skip).limit(limit),
        Customer_1.default.countDocuments(filter),
    ]);
    return { customers, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getCustomers = getCustomers;
const createCustomer = async (data) => Customer_1.default.create(data);
exports.createCustomer = createCustomer;
const updateCustomer = async (id, data) => {
    const item = await Customer_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!item)
        throw new helpers_1.AppError('Customer not found', 404);
    return item;
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (id) => {
    const item = await Customer_1.default.findByIdAndDelete(id);
    if (!item)
        throw new helpers_1.AppError('Customer not found', 404);
    return item;
};
exports.deleteCustomer = deleteCustomer;
// Subscribers
const getSubscribers = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const [subscribers, total] = await Promise.all([
        Subscriber_1.default.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Subscriber_1.default.countDocuments({ isActive: true }),
    ]);
    return { subscribers, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getSubscribers = getSubscribers;
const subscribe = async (email, name) => {
    const existing = await Subscriber_1.default.findOne({ email });
    if (existing) {
        if (existing.isActive)
            throw new helpers_1.AppError('Already subscribed', 400);
        existing.isActive = true;
        await existing.save();
        return existing;
    }
    return Subscriber_1.default.create({ email, name });
};
exports.subscribe = subscribe;
const exportSubscribersCSV = async () => {
    const subscribers = await Subscriber_1.default.find({ isActive: true }).select('email name subscribedAt');
    const header = 'Email,Name,Subscribed At\n';
    const rows = subscribers
        .map((s) => `${s.email},${s.name || ''},${s.subscribedAt.toISOString()}`)
        .join('\n');
    return header + rows;
};
exports.exportSubscribersCSV = exportSubscribersCSV;
// Inquiries
const getInquiries = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (query.type)
        filter.type = query.type;
    if (query.status)
        filter.status = query.status;
    const [inquiries, total] = await Promise.all([
        Inquiry_1.default.find(filter).populate('product', 'name').populate('assignedTo', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Inquiry_1.default.countDocuments(filter),
    ]);
    return { inquiries, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getInquiries = getInquiries;
const createInquiry = async (data) => Inquiry_1.default.create(data);
exports.createInquiry = createInquiry;
const updateInquiry = async (id, data) => {
    const item = await Inquiry_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!item)
        throw new helpers_1.AppError('Inquiry not found', 404);
    return item;
};
exports.updateInquiry = updateInquiry;
// Media
const getMedia = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (query.type)
        filter.type = query.type;
    if (query.folder)
        filter.folder = query.folder;
    const [media, total] = await Promise.all([
        Media_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Media_1.default.countDocuments(filter),
    ]);
    return { media, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getMedia = getMedia;
const uploadMedia = async (file, adminId, folder) => {
    const { url, publicId } = await (0, cloudinaryService_1.uploadToCloudinary)(file, folder || 'media');
    return Media_1.default.create({
        name: file.originalname,
        type: (0, cloudinaryService_1.getMediaType)(file.mimetype),
        url,
        publicId,
        mimeType: file.mimetype,
        size: file.size,
        folder,
        uploadedBy: adminId,
    });
};
exports.uploadMedia = uploadMedia;
const deleteMedia = async (id) => {
    const item = await Media_1.default.findByIdAndDelete(id);
    if (!item)
        throw new helpers_1.AppError('Media not found', 404);
    return item;
};
exports.deleteMedia = deleteMedia;
// Pages (CMS)
const getPages = async () => Page_1.default.find().sort({ title: 1 });
exports.getPages = getPages;
const getPageBySlug = async (slug) => {
    const page = await Page_1.default.findOne({ slug, isPublished: true });
    if (!page)
        throw new helpers_1.AppError('Page not found', 404);
    return page;
};
exports.getPageBySlug = getPageBySlug;
const upsertPage = async (slug, data) => {
    return Page_1.default.findOneAndUpdate({ slug }, { slug, ...data }, { new: true, upsert: true, runValidators: true });
};
exports.upsertPage = upsertPage;
// Settings
const getSettings = async (group) => {
    const filter = group ? { group } : {};
    const settings = await Setting_1.default.find(filter);
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
};
exports.getSettings = getSettings;
const updateSettings = async (settings, group = 'general') => {
    const ops = Object.entries(settings).map(([key, value]) => Setting_1.default.findOneAndUpdate({ key }, { key, value, group }, { upsert: true, new: true }));
    await Promise.all(ops);
    return (0, exports.getSettings)(group);
};
exports.updateSettings = updateSettings;
// SEO
const getSEOEntries = async () => SEO_1.default.find().sort({ pagePath: 1 });
exports.getSEOEntries = getSEOEntries;
const getSEOByPath = async (pagePath) => SEO_1.default.findOne({ pagePath });
exports.getSEOByPath = getSEOByPath;
const upsertSEO = async (pagePath, data) => {
    return SEO_1.default.findOneAndUpdate({ pagePath }, { pagePath, ...data }, { new: true, upsert: true });
};
exports.upsertSEO = upsertSEO;
const generateSitemap = async () => {
    const Product = (await Promise.resolve().then(() => __importStar(require('../models/Product')))).default;
    const Blog = (await Promise.resolve().then(() => __importStar(require('../models/Blog')))).default;
    const Category = (await Promise.resolve().then(() => __importStar(require('../models/Category')))).default;
    const baseUrl = process.env.CLIENT_URL || 'https://example.com';
    const [products, blogs, categories, pages] = await Promise.all([
        Product.find({ status: 'published' }).select('slug updatedAt').lean(),
        Blog.find({ status: 'published' }).select('slug updatedAt').lean(),
        Category.find({ isActive: true }).select('slug updatedAt').lean(),
        Page_1.default.find({ isPublished: true }).select('slug updatedAt').lean(),
    ]);
    const urls = [
        { loc: baseUrl, priority: '1.0' },
        ...categories.map((c) => ({ loc: `${baseUrl}/categories/${c.slug}`, lastmod: c.updatedAt })),
        ...products.map((p) => ({ loc: `${baseUrl}/products/${p.slug}`, lastmod: p.updatedAt })),
        ...blogs.map((b) => ({ loc: `${baseUrl}/blog/${b.slug}`, lastmod: b.updatedAt })),
        ...pages.map((p) => ({ loc: `${baseUrl}/${p.slug}`, lastmod: p.updatedAt })),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map((u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    ${u.priority ? `<priority>${u.priority}</priority>` : ''}
  </url>`)
        .join('\n')}
</urlset>`;
    return xml;
};
exports.generateSitemap = generateSitemap;
const generateRobotsTxt = async () => {
    const seoSettings = await (0, exports.getSettings)('seo');
    const disallow = seoSettings.disallowPaths || [];
    return `User-agent: *
${disallow.map((p) => `Disallow: ${p}`).join('\n')}
Allow: /

Sitemap: ${process.env.CLIENT_URL}/sitemap.xml`;
};
exports.generateRobotsTxt = generateRobotsTxt;
// Analytics
const trackEvent = async (data) => Analytics_1.default.create(data);
exports.trackEvent = trackEvent;
const getAnalytics = async (query) => {
    const filter = {};
    if (query.type)
        filter.type = query.type;
    if (query.startDate || query.endDate) {
        filter.createdAt = {};
        if (query.startDate)
            filter.createdAt.$gte = new Date(query.startDate);
        if (query.endDate)
            filter.createdAt.$lte = new Date(query.endDate);
    }
    const [events, bySource, topProducts, byDevice] = await Promise.all([
        Analytics_1.default.countDocuments(filter),
        Analytics_1.default.aggregate([
            { $match: { ...filter, leadSource: { $exists: true } } },
            { $group: { _id: '$leadSource', count: { $sum: 1 } } },
        ]),
        Analytics_1.default.aggregate([
            { $match: { ...filter, type: 'product_view' } },
            { $group: { _id: '$product', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        Analytics_1.default.aggregate([
            { $match: { ...filter, device: { $exists: true } } },
            { $group: { _id: '$device', count: { $sum: 1 } } },
        ]),
    ]);
    return { totalEvents: events, bySource, topProducts, byDevice };
};
exports.getAnalytics = getAnalytics;
