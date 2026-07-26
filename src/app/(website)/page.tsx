import type { Metadata } from 'next';
import { HomePageClient } from '@/components/website/home-page-client';
import { SEO, SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  alternates: { canonical: '/' },
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    type: 'website',
    locale: 'en_IN',
    siteName: SITE.name,
    images: [{ url: '/logo.png', width: 1408, height: 768, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.title,
    description: SEO.description,
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
};

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: SITE.name,
        url: process.env.CLIENT_URL || 'https://vinayakenterprises.com',
        logo: '/logo.png',
        email: SITE.email,
        telephone: SITE.phoneTel,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ambala',
          addressRegion: 'Haryana',
          addressCountry: 'IN',
        },
        sameAs: [],
        description: SEO.description,
      },
      {
        '@type': 'WebSite',
        name: SITE.name,
        url: process.env.CLIENT_URL || 'https://vinayakenterprises.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${process.env.CLIENT_URL || ''}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
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
