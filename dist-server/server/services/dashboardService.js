"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardNotifications = exports.getDashboardStats = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Lead_1 = __importDefault(require("../models/Lead"));
const RFQ_1 = __importDefault(require("../models/RFQ"));
const Analytics_1 = __importDefault(require("../models/Analytics"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Download_1 = __importDefault(require("../models/Download"));
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
const getDashboardStats = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const [totalProducts, totalLeads, totalRFQs, totalVisitors, monthlyLeads, blogViews, catalogueDownloads, topProducts, recentProducts, recentBlogs, newLeadsCount, pendingRFQsCount, pendingTestimonialsCount, recentLeadsList, pendingTestimonialsList, leadsPerMonth, trafficOverview, enquiryTrends, visitorDevices,] = await Promise.all([
        Product_1.default.countDocuments({ status: 'published' }),
        Lead_1.default.countDocuments(),
        RFQ_1.default.countDocuments(),
        Promise.all([
            Analytics_1.default.countDocuments({ type: 'visitor' }),
            Analytics_1.default.distinct('ipAddress', { type: { $in: ['visitor', 'page_view'] } }),
            Analytics_1.default.countDocuments({ type: 'page_view' }),
        ]).then(([vis, ips, pvs]) => Math.max(vis, ips.filter(Boolean).length, pvs > 0 ? 1 : 0)),
        Lead_1.default.countDocuments({ createdAt: { $gte: startOfMonth } }),
        Blog_1.default.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
        Download_1.default.countDocuments(),
        Product_1.default.find({ status: 'published' })
            .sort({ enquiryCount: -1, views: -1 })
            .limit(5)
            .select('name sku views enquiryCount images')
            .lean(),
        Product_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name sku status slug createdAt')
            .lean(),
        Blog_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('author', 'name')
            .select('title slug status views createdAt author')
            .lean(),
        Lead_1.default.countDocuments({ status: 'new' }),
        RFQ_1.default.countDocuments({ status: 'pending' }),
        Testimonial_1.default.countDocuments({ status: 'pending' }),
        Lead_1.default.find()
            .sort({ createdAt: -1 })
            .limit(6)
            .select('name company email phone productInterested status createdAt')
            .lean(),
        Testimonial_1.default.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(6)
            .select('name company rating review createdAt')
            .lean(),
        Lead_1.default.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
        Analytics_1.default.aggregate([
            { $match: { type: { $in: ['page_view', 'visitor'] }, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
        Lead_1.default.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
        Analytics_1.default.aggregate([
            { $match: { type: { $in: ['visitor', 'page_view'] }, device: { $exists: true } } },
            { $group: { _id: '$device', count: { $sum: 1 } } },
        ]),
    ]);
    return {
        stats: {
            totalProducts,
            totalLeads,
            totalRFQs,
            totalVisitors,
            monthlyLeads,
            blogViews: blogViews[0]?.total || 0,
            catalogueDownloads,
        },
        attention: {
            newLeads: newLeadsCount,
            pendingRFQs: pendingRFQsCount,
            pendingTestimonials: pendingTestimonialsCount,
            total: newLeadsCount + pendingRFQsCount + pendingTestimonialsCount,
        },
        topProducts,
        recentProducts,
        recentBlogs,
        recentLeads: recentLeadsList,
        pendingTestimonials: pendingTestimonialsList,
        charts: {
            leadsPerMonth,
            trafficOverview,
            enquiryTrends,
            visitorDevices,
        },
    };
};
exports.getDashboardStats = getDashboardStats;
const getDashboardNotifications = async () => {
    const [newLeadsCount, pendingRFQsCount, pendingTestimonialsCount, recentLeads, recentRFQs, pendingTestimonials,] = await Promise.all([
        Lead_1.default.countDocuments({ status: 'new' }),
        RFQ_1.default.countDocuments({ status: 'pending' }),
        Testimonial_1.default.countDocuments({ status: 'pending' }),
        Lead_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name company email phone productInterested status createdAt'),
        RFQ_1.default.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('product', 'name sku')
            .select('name companyName email phone productName status createdAt'),
        Testimonial_1.default.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name company rating review createdAt'),
    ]);
    const notifications = [
        ...recentLeads.map((l) => ({
            id: String(l._id),
            type: 'lead',
            title: `Contact Inquiry: ${l.name}`,
            subtitle: `${l.company ? `${l.company} · ` : ''}${l.productInterested || 'General Inquiry'}`,
            createdAt: l.createdAt || new Date(),
            link: '/console/leads',
            status: l.status,
        })),
        ...recentRFQs.map((r) => ({
            id: String(r._id),
            type: 'rfq',
            title: `Quote Request: ${r.companyName || r.name}`,
            subtitle: `Product: ${r.product?.name || r.productName || 'Equipment'}`,
            createdAt: r.createdAt || new Date(),
            link: '/console/rfqs',
            status: r.status,
        })),
        ...pendingTestimonials.map((t) => ({
            id: String(t._id),
            type: 'testimonial',
            title: `New Testimonial: ${t.name} (${t.company})`,
            subtitle: `${'★'.repeat(t.rating)} "${t.review.slice(0, 60)}..."`,
            createdAt: t.createdAt || new Date(),
            link: '/console/testimonials',
            status: 'pending',
        })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
        counts: {
            newLeads: newLeadsCount,
            pendingRFQs: pendingRFQsCount,
            pendingTestimonials: pendingTestimonialsCount,
            totalUnread: newLeadsCount + pendingRFQsCount + pendingTestimonialsCount,
        },
        latestNotifications: notifications.slice(0, 10),
        pendingTestimonials,
        recentLeads,
    };
};
exports.getDashboardNotifications = getDashboardNotifications;
