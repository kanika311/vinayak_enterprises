import type { Metadata } from 'next';
import { CategoriesClient } from './categories-client';
import { connectDatabase } from '../../../../server/config/database';
import CategoryModel from '../../../../server/models/Category';
import { SITE_URL } from '@/lib/site-url';
import type { Category } from '@/types';

export const revalidate = 1800; // 30 minutes

export const metadata: Metadata = {
  title: 'Product Categories | Laboratory Equipment & Anatomy Models Manufacturer',
  description:
    'Explore product categories from Vinayak Enterprises: Microscopes, Human Anatomy Models, CPR Manikins, Biology Lab Equipment & Science Teaching Aids from Ambala.',
  keywords: [
    'Anatomical Models Manufacturer in India',
    'Microscope Supplier in India',
    'Laboratory Equipment Supplier in India',
    'Educational Equipment Manufacturer',
    'CPR Training Manikins Manufacturer',
  ],
  alternates: {
    canonical: `${SITE_URL}/categories`,
    languages: {
      'en-IN': `${SITE_URL}/categories`,
      'x-default': `${SITE_URL}/categories`,
    },
  },
  openGraph: {
    title: 'Product Categories | Laboratory Equipment & Anatomy Models Manufacturer',
    description:
      'Explore product categories from Vinayak Enterprises: Microscopes, Human Anatomy Models, CPR Manikins, Biology Lab Equipment & Science Teaching Aids from Ambala.',
    url: `${SITE_URL}/categories`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Vinayak Enterprises Product Categories' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Categories | Laboratory Equipment & Anatomy Models Manufacturer',
    description:
      'Explore product categories from Vinayak Enterprises: Microscopes, Human Anatomy Models, CPR Manikins, Biology Lab Equipment & Science Teaching Aids from Ambala.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Categories',
      item: `${SITE_URL}/categories`,
    },
  ],
};

async function getCategoriesData() {
  try {
    await connectDatabase();
    const cats = await CategoryModel.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(cats)) as Category[];
  } catch (err) {
    console.warn('Could not load categories SSR data:', err);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategoriesData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <CategoriesClient initialCategories={categories} />
    </>
  );
}
