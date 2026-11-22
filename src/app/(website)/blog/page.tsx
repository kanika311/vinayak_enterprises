import type { Metadata } from 'next';
import { BlogReader } from '@/components/website/blog-reader';

const BASE_URL = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

export const metadata: Metadata = {
  title: 'Science Education & Lab Equipment Blog | Vinayak Enterprises',
  description:
    'Read expert insights and buying guides on human anatomy models, microscopes, CPR manikins and school/college laboratory equipment from Vinayak Enterprises.',
  keywords: [
    'Science Education Blog India',
    'Laboratory Equipment Guide',
    'Anatomy Models Buying Guide',
    'Microscopes in Education',
    'Vinayak Enterprises Blog',
  ],
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: 'Science Education & Lab Equipment Blog | Vinayak Enterprises',
    description:
      'Read expert insights and buying guides on human anatomy models, microscopes, CPR manikins and school/college laboratory equipment from Vinayak Enterprises.',
    url: `${BASE_URL}/blog`,
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
      name: 'Blog',
      item: `${BASE_URL}/blog`,
    },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <BlogReader />
    </>
  );
}
