import type { Metadata } from 'next';
import { CataloguesClient } from './catalogues-client';
import { SITE_URL } from '@/lib/site-url';

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
    canonical: `${SITE_URL}/catalogues`,
    languages: {
      'en-IN': `${SITE_URL}/catalogues`,
      'x-default': `${SITE_URL}/catalogues`,
    },
  },
  openGraph: {
    title: 'Download Product Catalogue PDF | Vinayak Enterprises Ambala',
    description:
      'Browse and download interactive product catalogues for microscopes, anatomical models, CPR training manikins & laboratory instruments from Vinayak Enterprises.',
    url: `${SITE_URL}/catalogues`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Vinayak Enterprises Product Catalogues' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download Product Catalogue PDF | Vinayak Enterprises Ambala',
    description:
      'Browse and download interactive product catalogues for microscopes, anatomical models, CPR training manikins & laboratory instruments from Vinayak Enterprises.',
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
      name: 'Product Catalogues',
      item: `${SITE_URL}/catalogues`,
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
