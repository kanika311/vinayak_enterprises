import type { Metadata } from 'next';
import { HomePageClient } from '@/components/website/home-page-client';
import { SEO, SITE } from '@/lib/constants';
import { HOME_FAQS } from '@/lib/faqs';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: BASE_URL,
    type: 'website',
    locale: 'en_IN',
    siteName: SITE.name,
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.title,
    description: SEO.description,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': `${BASE_URL}/#organization`,
        name: SITE.name,
        alternateName: ['Vinayak Enterprises Ambala', 'VE Scientific Instruments'],
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        email: SITE.email,
        telephone: SITE.phoneTel,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ambala Cantt',
          addressLocality: 'Ambala',
          addressRegion: 'Haryana',
          postalCode: '133001',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '30.3752',
          longitude: '76.7821',
        },
        description: SEO.description,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: SITE.name,
        url: BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/#faq`,
        mainEntity: HOME_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Product Categories',
        itemListElement: [
          'Scientific Instruments',
          'Laboratory Equipment',
          'Human Anatomy Models',
          'Educational Teaching Aids',
          'Medical Training Products',
          'CPR Training Manikins',
          'Human Skeleton Models',
          'Microscopes',
        ].map((name, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <HomePageClient />
    </>
  );
}
