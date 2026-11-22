import type { Metadata } from 'next';
import { RequestQuoteClient } from './quote-client';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Request Bulk Quote | Institutional Lab Supply | Vinayak Enterprises',
  description:
    'Request competitive bulk pricing and quotation for school, college, hospital or research laboratory equipment from Vinayak Enterprises, Ambala, Haryana.',
  keywords: [
    'Laboratory Equipment Bulk Quote',
    'Scientific Instruments Wholesale Price',
    'Institutional Equipment Quotation India',
    'Vinayak Enterprises Ambala RFQ',
  ],
  alternates: {
    canonical: `${SITE_URL}/request-quote`,
    languages: {
      'en-IN': `${SITE_URL}/request-quote`,
    },
  },
  openGraph: {
    title: 'Request Bulk Quote | Institutional Lab Supply | Vinayak Enterprises',
    description:
      'Request competitive bulk pricing and quotation for school, college, hospital or research laboratory equipment from Vinayak Enterprises, Ambala, Haryana.',
    url: `${SITE_URL}/request-quote`,
    type: 'website',
    images: [`${SITE_URL}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request Bulk Quote | Institutional Lab Supply | Vinayak Enterprises',
    description:
      'Request competitive bulk pricing and quotation for school, college, hospital or research laboratory equipment from Vinayak Enterprises, Ambala, Haryana.',
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
      name: 'Request Quote',
      item: `${SITE_URL}/request-quote`,
    },
  ],
};

export default function RequestQuotePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <RequestQuoteClient />
    </>
  );
}
