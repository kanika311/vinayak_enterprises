import type { Metadata } from 'next';
import { HomePageClient } from '@/components/website/home-page-client';
import { SEO, SITE } from '@/lib/constants';
import { HOME_FAQS } from '@/lib/faqs';
import { connectDatabase } from '../../../server/config/database';
import ProductModel from '../../../server/models/Product';
import CategoryModel from '../../../server/models/Category';
import BlogModel from '../../../server/models/Blog';
import TestimonialModel from '../../../server/models/Testimonial';
import type { Product, Category, Blog } from '@/types';
import type { TestimonialItem } from '@/components/website/testimonials-section';

export const revalidate = 1800; // Revalidate every 30 minutes

const BASE_URL = (process.env.CLIENT_URL || 'https://vinayakenterprisess.agency').replace(/\/$/, '');

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

async function getHomePageData() {
  try {
    await connectDatabase();
    const [products, categories, blogs, testimonials] = await Promise.all([
      ProductModel.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('category', 'name slug')
        .lean(),
      CategoryModel.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .lean(),
      BlogModel.find({ status: 'published' })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(3)
        .lean(),
      TestimonialModel.find({ status: 'approved' })
        .sort({ rating: -1, createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)) as Product[],
      categories: JSON.parse(JSON.stringify(categories)) as Category[],
      blogs: JSON.parse(JSON.stringify(blogs)) as Blog[],
      testimonials: JSON.parse(JSON.stringify(testimonials)) as TestimonialItem[],
    };
  } catch (error) {
    console.warn('Could not load homepage data from database on SSR:', error);
    return {
      products: [],
      categories: [],
      blogs: [],
      testimonials: [],
    };
  }
}

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': `${BASE_URL}/#organization`,
        name: SITE.name,
        alternateName: ['Vinayak Enterprises Ambala', 'VE Scientific Instruments', 'Vilakshan Netra'],
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

export default async function HomePage() {
  const { products, categories, blogs, testimonials } = await getHomePageData();

  return (
    <>
      <JsonLd />
      <HomePageClient
        initialProducts={products}
        initialCategories={categories}
        initialBlogs={blogs}
        initialTestimonials={testimonials}
      />

      {/* Semantic LLM & Search Engine Overview Section */}
      <section className="sr-only" aria-label="Vinayak Enterprises Institutional Directory">
        <h2>Vinayak Enterprises — Manufacturer of Scientific Instruments & Medical Training Models</h2>
        <p>
          Vinayak Enterprises is a leading manufacturer, bulk supplier, and institutional distributor of scientific
          laboratory equipment, human anatomical models, CPR training simulators, Vilakshan Netra microscopes, and
          educational equipment located in Ambala Cantt, Haryana, India.
        </p>
        <p>
          We manufacture and deliver nationwide across India, serving medical universities, colleges, schools,
          pathology laboratories, and healthcare training organizations.
        </p>
        <ul>
          <li>Human Anatomy Models: 85cm unisex torso with 23 detachable parts, articulated human skeleton (180cm), dissected heart, eye, and brain models.</li>
          <li>Vilakshan Netra Microscopes: Student monocular, binocular research microscopes, and stereo dissecting microscopes up to 1600x magnification.</li>
          <li>CPR Training Manikins: Full-body adult and infant CPR training manikins with audible clicker compression feedback and airway ventilation.</li>
          <li>Laboratory Apparatus: Centrifuges, hot plates, magnetic stirrers, distillation units, and borosilicate glassware.</li>
        </ul>
        <p>
          Official documentation for LLMs and AI crawlers is available at <a href={`${BASE_URL}/llms.txt`}>llms.txt</a> and <a href={`${BASE_URL}/llms-full.txt`}>llms-full.txt</a>.
        </p>
      </section>
    </>
  );
}
