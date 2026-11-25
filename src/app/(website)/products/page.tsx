import type { Metadata } from 'next';
import { ProductsClient } from './products-client';
import { connectDatabase } from '../../../../server/config/database';
import ProductModel from '../../../../server/models/Product';
import CategoryModel from '../../../../server/models/Category';
import { SITE_URL } from '@/lib/site-url';
import type { Product, Category } from '@/types';

export const revalidate = 1800; // 30 minutes

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
    canonical: `${SITE_URL}/products`,
    languages: {
      'en-IN': `${SITE_URL}/products`,
    },
  },
  openGraph: {
    title: 'Scientific Lab Equipment & Anatomical Models | Vinayak Enterprises',
    description:
      'Browse scientific instruments, laboratory equipment, anatomy models, microscopes & CPR training manikins manufactured by Vinayak Enterprises in Ambala, India.',
    url: `${SITE_URL}/products`,
    type: 'website',
    images: [`${SITE_URL}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scientific Lab Equipment & Anatomical Models | Vinayak Enterprises',
    description:
      'Browse scientific instruments, laboratory equipment, anatomy models, microscopes & CPR training manikins manufactured by Vinayak Enterprises in Ambala, India.',
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
      name: 'Products',
      item: `${SITE_URL}/products`,
    },
  ],
};

async function getProductsData() {
  try {
    await connectDatabase();
    const publishedCategoryIds = await ProductModel.distinct('category', { status: 'published' });
    const [products, categories] = await Promise.all([
      ProductModel.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(200)
        .populate('category', 'name slug')
        .lean(),
      CategoryModel.find({ _id: { $in: publishedCategoryIds }, isActive: true })
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

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Scientific Instruments & Laboratory Equipment Range',
    description:
      'Comprehensive catalogue of laboratory equipment, anatomy models and microscopes manufactured by Vinayak Enterprises.',
    url: `${SITE_URL}/products`,
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: p.name,
      url: `${SITE_URL}/products/${p.slug}`,
      image: p.images?.[0]?.url || `${SITE_URL}/logo.png`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <ProductsClient initialProducts={products} initialCategories={categories} />
    </>
  );
}
