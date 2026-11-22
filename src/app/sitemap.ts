import type { MetadataRoute } from 'next';
import { connectDatabase } from '../../server/config/database';
import Product from '../../server/models/Product';
import Category from '../../server/models/Category';
import Blog from '../../server/models/Blog';
import { SITE_URL } from '@/lib/site-url';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const now = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catalogues`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/request-quote`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/share-experience`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    await connectDatabase();

    const [products, categories, blogs] = await Promise.all([
      Product.find({ status: 'published' }).select('slug updatedAt').lean(),
      Category.find({ isActive: true }).select('slug updatedAt').lean(),
      Blog.find({ status: 'published' }).select('slug updatedAt publishedAt').lean(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p: any) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: any) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : b.publishedAt ? new Date(b.publishedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
  } catch (error) {
    console.warn('Sitemap dynamic fetch failed, serving static routes:', error);
    return staticRoutes;
  }
}
