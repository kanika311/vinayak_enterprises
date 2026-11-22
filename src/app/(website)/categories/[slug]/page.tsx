import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDatabase } from '../../../../../server/config/database';
import CategoryModel from '../../../../../server/models/Category';
import ProductModel from '../../../../../server/models/Product';
import { CategoryDetailClient } from './category-detail-client';
import type { Category, Product } from '@/types';

export const revalidate = 1800; // 30 minutes

const BASE_URL = (process.env.CLIENT_URL || 'https://vinayakenterprisess.agency').replace(/\/$/, '');

async function getCategoryAndProductsBySlug(slug: string): Promise<{ category: Category | null; products: Product[] }> {
  try {
    await connectDatabase();
    const doc = await CategoryModel.findOne({ slug, isActive: true }).lean();
    if (!doc) return { category: null, products: [] };
    const category = JSON.parse(JSON.stringify(doc)) as Category;

    const productDocs = await ProductModel.find({
      category: doc._id,
      status: 'published',
    })
      .sort({ createdAt: -1 })
      .limit(24)
      .lean();

    return {
      category,
      products: JSON.parse(JSON.stringify(productDocs)) as Product[],
    };
  } catch (err) {
    console.warn(`Failed to fetch category & products for slug ${slug}:`, err);
    return { category: null, products: [] };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryAndProductsBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | Vinayak Enterprises',
      robots: { index: false, follow: false },
    };
  }

  const title = `${category.name} Manufacturer & Bulk Supplier | Vinayak Enterprises`;
  const description =
    category.description ||
    `Explore ${category.name} manufactured by Vinayak Enterprises in Ambala, Haryana. Wholesale supplier of scientific instruments & institutional lab equipment across India.`;
  const canonical = `${BASE_URL}/categories/${category.slug}`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical },
    keywords: [
      category.name,
      `${category.name} Manufacturer India`,
      `${category.name} Supplier Ambala`,
      'Scientific Instruments Supplier',
      'Laboratory Equipment Manufacturer',
    ],
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, products } = await getCategoryAndProductsBySlug(slug);

  if (!category) {
    return notFound();
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: `${BASE_URL}/categories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${BASE_URL}/categories/${category.slug}`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} - Vinayak Enterprises`,
    description: category.description || `Browse ${category.name} from Vinayak Enterprises Ambala.`,
    url: `${BASE_URL}/categories/${category.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <CategoryDetailClient slug={slug} initialCategory={category} initialProducts={products} />
    </>
  );
}
