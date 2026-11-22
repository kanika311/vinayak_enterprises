import type { Metadata } from 'next';
import { ContactClient } from './contact-client';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

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
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Vinayak Enterprises | Lab Equipment Supplier in Ambala',
    description:
      'Contact Vinayak Enterprises in Ambala Cantt, Haryana. Phone: +91 94160-29492. Reach out for institutional laboratory equipment quotes & dealer inquiries.',
    url: `${BASE_URL}/contact`,
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${BASE_URL}/contact/#webpage`,
      url: `${BASE_URL}/contact`,
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
          item: `${BASE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact Us',
          item: `${BASE_URL}/contact`,
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
