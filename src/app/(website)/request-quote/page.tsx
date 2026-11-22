import type { Metadata } from 'next';
import { RequestQuoteClient } from './quote-client';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

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
    canonical: `${BASE_URL}/request-quote`,
  },
  openGraph: {
    title: 'Request Bulk Quote | Institutional Lab Supply | Vinayak Enterprises',
    description:
      'Request competitive bulk pricing and quotation for school, college, hospital or research laboratory equipment from Vinayak Enterprises, Ambala, Haryana.',
    url: `${BASE_URL}/request-quote`,
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
      name: 'Request Quote',
      item: `${BASE_URL}/request-quote`,
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
