"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTOMER_TYPES = exports.PRODUCT_STATUSES = exports.LEAD_STATUSES = exports.LEAD_SOURCES = exports.ROLE_PERMISSIONS = exports.PERMISSIONS = exports.ROLES = void 0;
exports.ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    CONTENT_MANAGER: 'content_manager',
    SALES_EXECUTIVE: 'sales_executive',
};
exports.PERMISSIONS = {
    DASHBOARD: 'dashboard:read',
    PRODUCTS: 'products:manage',
    CATEGORIES: 'categories:manage',
    LEADS: 'leads:manage',
    RFQS: 'rfqs:manage',
    CATALOGUES: 'catalogues:manage',
    BLOGS: 'blogs:manage',
    SEO: 'seo:manage',
    TESTIMONIALS: 'testimonials:manage',
    CUSTOMERS: 'customers:manage',
    INQUIRIES: 'inquiries:manage',
    NEWSLETTER: 'newsletter:manage',
    MEDIA: 'media:manage',
    PAGES: 'pages:manage',
    ANALYTICS: 'analytics:read',
    SETTINGS: 'settings:manage',
    USERS: 'users:manage',
};
exports.ROLE_PERMISSIONS = {
    [exports.ROLES.SUPER_ADMIN]: Object.values(exports.PERMISSIONS),
    [exports.ROLES.ADMIN]: Object.values(exports.PERMISSIONS).filter((p) => p !== exports.PERMISSIONS.USERS),
    [exports.ROLES.CONTENT_MANAGER]: [
        exports.PERMISSIONS.DASHBOARD,
        exports.PERMISSIONS.PRODUCTS,
        exports.PERMISSIONS.CATEGORIES,
        exports.PERMISSIONS.BLOGS,
        exports.PERMISSIONS.SEO,
        exports.PERMISSIONS.TESTIMONIALS,
        exports.PERMISSIONS.MEDIA,
        exports.PERMISSIONS.PAGES,
        exports.PERMISSIONS.CATALOGUES,
    ],
    [exports.ROLES.SALES_EXECUTIVE]: [
        exports.PERMISSIONS.DASHBOARD,
        exports.PERMISSIONS.LEADS,
        exports.PERMISSIONS.RFQS,
        exports.PERMISSIONS.CUSTOMERS,
        exports.PERMISSIONS.INQUIRIES,
        exports.PERMISSIONS.ANALYTICS,
    ],
};
exports.LEAD_SOURCES = [
    'contact_form',
    'request_quote',
    'catalogue_download',
    'product_enquiry',
    'whatsapp_click',
];
exports.LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'];
exports.PRODUCT_STATUSES = ['draft', 'published'];
exports.CUSTOMER_TYPES = [
    'customer',
    'dealer',
    'distributor',
    'institution',
    'school',
    'college',
];
