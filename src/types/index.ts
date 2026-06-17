export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | number;
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: { _id: string; name: string; slug: string } | string;
  subcategory?: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: { key: string; value: string }[];
  images: { url: string; alt?: string }[];
  videos: { url: string; title?: string }[];
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords: string[];
  faq: { question: string; answer: string }[];
  brochure?: { url: string };
  status: 'draft' | 'published';
  views: number;
  enquiryCount: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories: { name: string; slug: string }[];
  isActive: boolean;
  order: number;
}

export interface Lead {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  productInterested?: string;
  message?: string;
  leadSource: string;
  status: string;
  assignedTo?: { _id: string; name: string; email: string };
  notes: { text: string; createdAt: string }[];
  timeline: { action: string; description: string; createdAt: string }[];
  createdAt: string;
}

export interface RFQ {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  product: { _id: string; name: string; sku: string };
  quantity: number;
  budget?: string;
  requirements?: string;
  status: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: { url: string };
  category?: string;
  tags: string[];
  author: { name: string };
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
}

export interface DashboardData {
  stats: {
    totalProducts: number;
    totalLeads: number;
    totalRFQs: number;
    totalVisitors: number;
    monthlyLeads: number;
    blogViews: number;
    catalogueDownloads: number;
  };
  topProducts: Product[];
  charts: {
    leadsPerMonth: { _id: { year: number; month: number }; count: number }[];
    trafficOverview: { _id: { year: number; month: number }; count: number }[];
    enquiryTrends: { _id: { year: number; month: number }; count: number }[];
    visitorDevices: { _id: string; count: number }[];
  };
}
