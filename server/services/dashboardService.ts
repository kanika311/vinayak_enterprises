import Product from '../models/Product';
import Lead from '../models/Lead';
import RFQ from '../models/RFQ';
import Analytics from '../models/Analytics';
import Blog from '../models/Blog';
import Download from '../models/Download';
import Testimonial from '../models/Testimonial';
import { getPagination } from '../utils/helpers';

export const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalProducts,
    totalLeads,
    totalRFQs,
    totalVisitors,
    monthlyLeads,
    blogViews,
    catalogueDownloads,
    topProducts,
    recentProducts,
    recentBlogs,
    newLeadsCount,
    pendingRFQsCount,
    pendingTestimonialsCount,
    recentLeadsList,
    pendingTestimonialsList,
    leadsPerMonth,
    trafficOverview,
    enquiryTrends,
    visitorDevices,
  ] = await Promise.all([
    Product.countDocuments({ status: 'published' }),
    Lead.countDocuments(),
    RFQ.countDocuments(),
    Promise.all([
      Analytics.countDocuments({ type: 'visitor' }),
      Analytics.distinct('ipAddress', { type: { $in: ['visitor', 'page_view'] } }),
      Analytics.countDocuments({ type: 'page_view' }),
    ]).then(([vis, ips, pvs]) => Math.max(vis, ips.filter(Boolean).length, pvs > 0 ? 1 : 0)),
    Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    Download.countDocuments(),
    Product.find({ status: 'published' })
      .sort({ enquiryCount: -1, views: -1 })
      .limit(5)
      .select('name sku views enquiryCount images')
      .lean(),
    Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name sku status slug createdAt')
      .lean(),
    Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name')
      .select('title slug status views createdAt author')
      .lean(),
    Lead.countDocuments({ status: 'new' }),
    RFQ.countDocuments({ status: 'pending' }),
    Testimonial.countDocuments({ status: 'pending' }),
    Lead.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('name company email phone productInterested status createdAt')
      .lean(),
    Testimonial.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('name company rating review createdAt')
      .lean(),
    Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Analytics.aggregate([
      { $match: { type: { $in: ['page_view', 'visitor'] }, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Analytics.aggregate([
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

export const getDashboardNotifications = async () => {
  const [
    newLeadsCount,
    pendingRFQsCount,
    pendingTestimonialsCount,
    recentLeads,
    recentRFQs,
    pendingTestimonials,
  ] = await Promise.all([
    Lead.countDocuments({ status: 'new' }),
    RFQ.countDocuments({ status: 'pending' }),
    Testimonial.countDocuments({ status: 'pending' }),
    Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name company email phone productInterested status createdAt'),
    RFQ.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('product', 'name sku')
      .select('name companyName email phone productName status createdAt'),
    Testimonial.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name company rating review createdAt'),
  ]);

  type NotificationItem = {
    id: string;
    type: 'lead' | 'rfq' | 'testimonial';
    title: string;
    subtitle: string;
    createdAt: Date;
    link: string;
    status: string;
  };

  const notifications: NotificationItem[] = [
    ...recentLeads.map((l) => ({
      id: String(l._id),
      type: 'lead' as const,
      title: `Contact Inquiry: ${l.name}`,
      subtitle: `${l.company ? `${l.company} · ` : ''}${l.productInterested || 'General Inquiry'}`,
      createdAt: (l as unknown as { createdAt: Date }).createdAt || new Date(),
      link: '/console/leads',
      status: l.status,
    })),
    ...recentRFQs.map((r) => ({
      id: String(r._id),
      type: 'rfq' as const,
      title: `Quote Request: ${r.companyName || r.name}`,
      subtitle: `Product: ${(r as unknown as { product?: { name?: string } }).product?.name || r.productName || 'Equipment'}`,
      createdAt: (r as unknown as { createdAt: Date }).createdAt || new Date(),
      link: '/console/rfqs',
      status: r.status,
    })),
    ...pendingTestimonials.map((t) => ({
      id: String(t._id),
      type: 'testimonial' as const,
      title: `New Testimonial: ${t.name} (${t.company})`,
      subtitle: `${'★'.repeat(t.rating)} "${t.review.slice(0, 60)}..."`,
      createdAt: (t as unknown as { createdAt: Date }).createdAt || new Date(),
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
