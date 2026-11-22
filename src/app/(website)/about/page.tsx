import type { Metadata } from 'next';
import { AboutClient } from './about-client';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

export const metadata: Metadata = {
  title: 'About Us | Scientific & Lab Equipment Manufacturer Ambala',
  description:
    'Vinayak Enterprises is a leading manufacturer & bulk supplier of scientific instruments, anatomical models & laboratory equipment in Ambala, Haryana for 20+ years.',
  keywords: [
    'Scientific Equipment Manufacturer Ambala',
    'Laboratory Equipment Supplier in Haryana',
    'Anatomical Models Manufacturer in India',
    'Vinayak Enterprises Ambala',
  ],
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: 'About Us | Scientific & Lab Equipment Manufacturer Ambala',
    description:
      'Vinayak Enterprises is a leading manufacturer & bulk supplier of scientific instruments, anatomical models & laboratory equipment in Ambala, Haryana.',
    url: `${BASE_URL}/about`,
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
      name: 'About Us',
      item: `${BASE_URL}/about`,
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <AboutClient />
    </>
  );
}
