import type { Metadata } from 'next';
import { CataloguesClient } from './catalogues-client';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

export const metadata: Metadata = {
  title: 'Download Product Catalogue PDF | Vinayak Enterprises Ambala',
  description:
    'Browse and download interactive product catalogues for microscopes, anatomical models, CPR training manikins & laboratory instruments from Vinayak Enterprises.',
  keywords: [
    'Scientific Instruments Catalogue PDF',
    'Laboratory Equipment Catalogue',
    'Anatomical Models Catalogue',
    'CPR Training Manikins Catalogue',
    'Vinayak Enterprises Catalogue',
  ],
  alternates: {
    canonical: `${BASE_URL}/catalogues`,
  },
  openGraph: {
    title: 'Download Product Catalogue PDF | Vinayak Enterprises Ambala',
    description:
      'Browse and download interactive product catalogues for microscopes, anatomical models, CPR training manikins & laboratory instruments from Vinayak Enterprises.',
    url: `${BASE_URL}/catalogues`,
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
      name: 'Product Catalogues',
      item: `${BASE_URL}/catalogues`,
    },
  ],
};

export default function CataloguesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <CataloguesClient />
    </>
  );
}
