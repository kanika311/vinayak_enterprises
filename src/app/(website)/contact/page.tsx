import type { Metadata } from 'next';
import { ContactClient } from './contact-client';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Contact Vinayak Enterprises | Lab Equipment Supplier in Ambala',
  description:
    'Contact Vinayak Enterprises in Ambala Cantt, Haryana. Phone: +91 94160-29492. Reach out for institutional laboratory equipment quotes & dealer inquiries.',
  keywords: [
    'Laboratory Equipment Supplier in Ambala',
    'Scientific Equipment Supplier in India',
    'Medical Equipment Supplier in Ambala',
    'Vinayak Enterprises Contact',
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: {
      'en-IN': `${SITE_URL}/contact`,
      'x-default': `${SITE_URL}/contact`,
    },
  },
  openGraph: {
    title: 'Contact Vinayak Enterprises | Lab Equipment Supplier in Ambala',
    description:
      'Contact Vinayak Enterprises in Ambala Cantt, Haryana. Phone: +91 94160-29492. Reach out for institutional laboratory equipment quotes & dealer inquiries.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Contact Vinayak Enterprises' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Vinayak Enterprises | Lab Equipment Supplier in Ambala',
    description:
      'Contact Vinayak Enterprises in Ambala Cantt, Haryana. Phone: +91 94160-29492. Reach out for institutional laboratory equipment quotes & dealer inquiries.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${SITE_URL}/contact/#webpage`,
      url: `${SITE_URL}/contact`,
      name: 'Contact Vinayak Enterprises',
      description: 'Contact details and inquiry form for Vinayak Enterprises Ambala.',
    },
    {
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
          name: 'Contact Us',
          item: `${SITE_URL}/contact`,
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ContactClient />
    </>
  );
}
