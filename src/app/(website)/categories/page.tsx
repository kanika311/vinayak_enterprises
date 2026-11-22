import type { Metadata } from 'next';
import { CategoriesClient } from './categories-client';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

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
    canonical: `${BASE_URL}/categories`,
  },
  openGraph: {
    title: 'Product Categories | Laboratory Equipment & Anatomy Models Manufacturer',
    description:
      'Explore product categories from Vinayak Enterprises: Microscopes, Human Anatomy Models, CPR Manikins, Biology Lab Equipment & Science Teaching Aids from Ambala.',
    url: `${BASE_URL}/categories`,
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
      name: 'Categories',
      item: `${BASE_URL}/categories`,
    },
  ],
};

export default function CategoriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <CategoriesClient />
    </>
  );
}
