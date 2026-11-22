import type { Metadata } from 'next';
import { ProductsClient } from './products-client';
import { connectDatabase } from '../../../../server/config/database';
import ProductModel from '../../../../server/models/Product';
import CategoryModel from '../../../../server/models/Category';
import type { Product, Category } from '@/types';

export const revalidate = 1800; // 30 minutes

const BASE_URL = (process.env.CLIENT_URL || 'https://vinayakenterprisess.agency').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Scientific Lab Equipment & Anatomical Models | Vinayak Enterprises',
  description:
    'Browse scientific instruments, laboratory equipment, anatomy models, microscopes & CPR training manikins manufactured by Vinayak Enterprises in Ambala, India.',
  keywords: [
    'Scientific Instruments Supplier',
    'Laboratory Equipment Supplier in India',
    'Anatomical Models Manufacturer in India',
    'Microscope Supplier in India',
    'Biology Lab Equipment',
    'Science Laboratory Equipment',
  ],
  alternates: {
    canonical: `${BASE_URL}/products`,
  },
  openGraph: {
    title: 'Scientific Lab Equipment & Anatomical Models | Vinayak Enterprises',
    description:
      'Browse scientific instruments, laboratory equipment, anatomy models, microscopes & CPR training manikins manufactured by Vinayak Enterprises in Ambala, India.',
    url: `${BASE_URL}/products`,
    type: 'website',
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
      item: `${BASE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Products',
      item: `${BASE_URL}/products`,
    },
  ],
};

async function getProductsData() {
  try {
    await connectDatabase();
    const [products, categories] = await Promise.all([
      ProductModel.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(24)
        .populate('category', 'name slug')
        .lean(),
      CategoryModel.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .lean(),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)) as Product[],
      categories: JSON.parse(JSON.stringify(categories)) as Category[],
    };
  } catch (error) {
    console.warn('Could not load products SSR data:', error);
    return {
      products: [],
      categories: [],
    };
  }
}

export default async function ProductsPage() {
  const { products, categories } = await getProductsData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <ProductsClient initialProducts={products} initialCategories={categories} />
    </>
  );
}
