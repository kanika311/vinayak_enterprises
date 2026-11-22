import type { Metadata } from 'next';
import { ShareExperienceClient } from './share-experience-client';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

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
    canonical: `${BASE_URL}/share-experience`,
  },
  openGraph: {
    title: 'Customer Feedback & Reviews | Vinayak Enterprises Ambala',
    description:
      'Share your experience with scientific instruments and laboratory models from Vinayak Enterprises. We value reviews from institutions and educators across India.',
    url: `${BASE_URL}/share-experience`,
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
      name: 'Share Experience',
      item: `${BASE_URL}/share-experience`,
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
