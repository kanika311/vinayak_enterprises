import type { Metadata } from 'next';
import { AboutClient } from './about-client';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'About Us | Scientific & Lab Equipment Manufacturer Ambala',
  description:
    'Vinayak Enterprises is an established manufacturer & bulk supplier of scientific instruments, anatomical models & laboratory equipment in Ambala Cantt, Haryana since 2000 (25+ years of excellence).',
  keywords: [
    'Scientific Equipment Manufacturer Ambala',
    'Laboratory Equipment Supplier in Haryana',
    'Anatomical Models Manufacturer in India',
    'Vinayak Enterprises Ambala',
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
    languages: {
      'en-IN': `${SITE_URL}/about`,
      'x-default': `${SITE_URL}/about`,
    },
  },
  openGraph: {
    title: 'About Us | Scientific & Lab Equipment Manufacturer Ambala',
    description:
      'Vinayak Enterprises is a leading manufacturer & bulk supplier of scientific instruments, anatomical models & laboratory equipment in Ambala, Haryana.',
    url: `${SITE_URL}/about`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'About Vinayak Enterprises' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Scientific & Lab Equipment Manufacturer Ambala',
    description:
      'Vinayak Enterprises is a leading manufacturer & bulk supplier of scientific instruments, anatomical models & laboratory equipment in Ambala, Haryana.',
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
      name: 'About Us',
      item: `${SITE_URL}/about`,
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
