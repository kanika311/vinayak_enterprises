import type { Metadata } from 'next';
import { ProductsClient } from './products-client';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

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

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <ProductsClient />
    </>
  );
}
