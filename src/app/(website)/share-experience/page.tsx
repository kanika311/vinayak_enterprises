import type { Metadata } from 'next';
import { ShareExperienceClient } from './share-experience-client';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Customer Feedback & Reviews | Vinayak Enterprises Ambala',
  description:
    'Share your experience with scientific instruments and laboratory models from Vinayak Enterprises. We value reviews from institutions and educators across India.',
  keywords: [
    'Vinayak Enterprises Reviews',
    'Customer Feedback Scientific Instruments',
    'Laboratory Equipment Supplier Reviews',
  ],
  alternates: {
    canonical: `${SITE_URL}/share-experience`,
    languages: {
      'en-IN': `${SITE_URL}/share-experience`,
    },
  },
  openGraph: {
    title: 'Customer Feedback & Reviews | Vinayak Enterprises Ambala',
    description:
      'Share your experience with scientific instruments and laboratory models from Vinayak Enterprises. We value reviews from institutions and educators across India.',
    url: `${SITE_URL}/share-experience`,
    type: 'website',
    images: [`${SITE_URL}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Feedback & Reviews | Vinayak Enterprises Ambala',
    description:
      'Share your experience with scientific instruments and laboratory models from Vinayak Enterprises. We value reviews from institutions and educators across India.',
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
      name: 'Share Experience',
      item: `${SITE_URL}/share-experience`,
    },
  ],
};

export default function ShareExperiencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <ShareExperienceClient />
    </>
  );
}
