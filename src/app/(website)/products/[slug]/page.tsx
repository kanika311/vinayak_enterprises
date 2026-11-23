import type { Metadata } from 'next';
import { connectDatabase } from '../../../../../server/config/database';
import ProductModel from '../../../../../server/models/Product';
import '../../../../../server/models/Category';
import { ProductDetailClient } from './product-detail-client';
import { SITE_URL } from '@/lib/site-url';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data';
import type { Product } from '@/types';

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await connectDatabase();
    // 1. Try finding published product with populated category
    let doc = await ProductModel.findOne({
      slug,
      $or: [{ status: 'published' }, { status: { $exists: false } }],
    })
      .populate('category', 'name slug')
      .lean();

    // 2. Fallback: try finding by slug without status constraint
    if (!doc) {
      doc = await ProductModel.findOne({ slug })
        .populate('category', 'name slug')
        .lean();
    }

    if (doc) {
      return JSON.parse(JSON.stringify(doc)) as Product;
    }
  } catch (err) {
    console.warn(`Failed to fetch product for slug ${slug}:`, err);
  }

  // 3. Fallback to static data if database is not reachable
  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (fallback) return fallback;

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const readableName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const title = product ? `${product.name} | Vinayak Enterprises` : `${readableName} | Vinayak Enterprises`;
  const description =
    product?.shortDescription?.slice(0, 155) ||
    `${title} manufactured by Vinayak Enterprises in Ambala, Haryana. High-grade scientific instruments & institutional lab supplies.`;
  const canonical = `${SITE_URL}/products/${slug}`;
  const imageUrl = product?.images?.[0]?.url || `${SITE_URL}/og-image.png`;

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
      product?.name || readableName,
      product?.sku || '',
      product && typeof product.category === 'object' ? product.category.name : '',
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
          alt: `${product?.name || readableName} - Vinayak Enterprises`,
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

  const categoryName = product && typeof product.category === 'object' ? product.category.name : '';
  const categorySlug = product && typeof product.category === 'object' ? product.category.slug : '';

  const productSchema = product
    ? {
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
      }
    : null;

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
      ...(product && categoryName
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
        : product
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: `${SITE_URL}/products/${product.slug}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  );
}
