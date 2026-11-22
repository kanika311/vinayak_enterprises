import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDatabase } from '../../../../../server/config/database';
import ProductModel from '../../../../../server/models/Product';
import { ProductDetailClient } from './product-detail-client';
import { SITE_URL } from '@/lib/site-url';
import type { Product } from '@/types';

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await connectDatabase();
    const doc = await ProductModel.findOne({ slug, status: 'published' })
      .populate('category', 'name slug')
      .lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc)) as Product;
  } catch (err) {
    console.warn(`Failed to fetch product for slug ${slug}:`, err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Vinayak Enterprises',
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} | Vinayak Enterprises`;
  const description =
    product.shortDescription?.slice(0, 155) ||
    `${product.name} manufactured by Vinayak Enterprises in Ambala, Haryana. High-grade scientific instruments & institutional lab supplies.`;
  const canonical = `${SITE_URL}/products/${product.slug}`;
  const imageUrl = product.images?.[0]?.url || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'en-IN': canonical,
      },
    },
    keywords: [
      product.name,
      product.sku,
      typeof product.category === 'object' ? product.category.name : '',
      'Vinayak Enterprises Ambala',
      'Laboratory Equipment Supplier India',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${product.name} - Vinayak Enterprises`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : '';
  const categorySlug = typeof product.category === 'object' ? product.category.slug : '';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img) => img.url) || [`${SITE_URL}/og-image.png`],
    description: product.shortDescription || product.longDescription,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Vinayak Enterprises',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vinayak Enterprises',
      url: SITE_URL,
    },
    category: categoryName || 'Scientific Instruments',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price ? product.price : 0,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/products/${product.slug}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Vinayak Enterprises',
      },
    },
  };

  const breadcrumbSchema = {
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
      ...(categoryName
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: categoryName,
              item: `${SITE_URL}/categories/${categorySlug}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: product.name,
              item: `${SITE_URL}/products/${product.slug}`,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: `${SITE_URL}/products/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  );
}
