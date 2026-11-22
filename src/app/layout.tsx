import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/components/providers';
import { SEO } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  metadataBase: new URL(process.env.CLIENT_URL || 'https://vinayakenterprisess.agency'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: 'https://vinayakenterprisess.agency',
    siteName: 'Vinayak Enterprises',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Vinayak Enterprises - Scientific Instruments & Laboratory Equipment Manufacturer',
      },
    ],
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

const rootStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': 'https://vinayakenterprisess.agency/#organization',
      name: 'Vinayak Enterprises',
      alternateName: ['Vinayak Enterprises Ambala', 'VE Scientific Instruments'],
      url: 'https://vinayakenterprisess.agency',
      logo: 'https://vinayakenterprisess.agency/logo.png',
      image: 'https://vinayakenterprisess.agency/logo.png',
      description:
        'Premier manufacturer, bulk supplier & distributor of scientific instruments, laboratory equipment, anatomical models, microscopes, and medical training products based in Ambala, Haryana, India.',
      telephone: '+919416029492',
      email: 'vinayakenterprises52@gmail.com',
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
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '22:00',
      },
      priceRange: '₹₹ - ₹₹₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer, UPI, Cheque',
      areaServed: [{ '@type': 'Country', name: 'India' }],
      knowsAbout: [
        'Scientific Instruments',
        'Laboratory Equipment',
        'Anatomical Models',
        'Medical Training Manikins',
        'CPR Manikins',
        'Microscopes',
        'Biology Lab Apparatus',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://vinayakenterprisess.agency/#website',
      url: 'https://vinayakenterprisess.agency',
      name: 'Vinayak Enterprises',
      publisher: {
        '@id': 'https://vinayakenterprisess.agency/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://vinayakenterprisess.agency/products?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootStructuredData) }}
        />
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KH76P24Q');`,
          }}
        />

        {/* Google Analytics (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-T8FJ2V7T6P"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T8FJ2V7T6P', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KH76P24Q"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
