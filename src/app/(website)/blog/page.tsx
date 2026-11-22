import type { Metadata } from 'next';
import { BlogReader } from '@/components/website/blog-reader';
import { connectDatabase } from '../../../../server/config/database';
import BlogModel from '../../../../server/models/Blog';
import { SITE_URL } from '@/lib/site-url';
import type { Blog } from '@/types';

export const revalidate = 1800; // 30 minutes

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
    canonical: `${SITE_URL}/blog`,
    languages: {
      'en-IN': `${SITE_URL}/blog`,
      'x-default': `${SITE_URL}/blog`,
    },
  },
  openGraph: {
    title: 'Science Education & Lab Equipment Blog | Vinayak Enterprises',
    description:
      'Read expert insights and buying guides on human anatomy models, microscopes, CPR manikins and school/college laboratory equipment from Vinayak Enterprises.',
    url: `${SITE_URL}/blog`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Vinayak Enterprises Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Education & Lab Equipment Blog | Vinayak Enterprises',
    description:
      'Read expert insights and buying guides on human anatomy models, microscopes, CPR manikins and school/college laboratory equipment from Vinayak Enterprises.',
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
      name: 'Blog',
      item: `${SITE_URL}/blog`,
    },
  ],
};

async function getBlogsData() {
  try {
    await connectDatabase();
    const docs = await BlogModel.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(docs)) as Blog[];
  } catch (err) {
    console.warn('Could not load blogs SSR data:', err);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogsData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <BlogReader initialBlogs={blogs} />
    </>
  );
}
