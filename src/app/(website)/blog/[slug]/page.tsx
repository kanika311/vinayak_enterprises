import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDatabase } from '../../../../../server/config/database';
import BlogModel from '../../../../../server/models/Blog';
import { BlogReader } from '@/components/website/blog-reader';
import type { Blog } from '@/types';

const BASE_URL = (process.env.CLIENT_URL || 'https://vinayakenterprisess.agency').replace(/\/$/, '');

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    await connectDatabase();
    const doc = await BlogModel.findOne({ slug, status: 'published' }).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc)) as Blog;
  } catch (err) {
    console.warn(`Failed to fetch blog for slug ${slug}:`, err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | Vinayak Enterprises',
      robots: { index: false, follow: false },
    };
  }

  const title = `${blog.title} | Vinayak Enterprises Blog`;
  const description =
    blog.excerpt?.slice(0, 155) ||
    blog.content?.slice(0, 155) ||
    `${blog.title} - Articles and insights on scientific instruments and laboratory education from Vinayak Enterprises.`;
  const canonical = `${BASE_URL}/blog/${blog.slug}`;
  const imageUrl = blog.featuredImage?.url || `${BASE_URL}/logo.png`;

  return {
    title,
    description,
    alternates: { canonical },
    keywords: [
      blog.title,
      blog.category || 'Science Education',
      'Laboratory Equipment Blog',
      'Vinayak Enterprises Ambala',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 500,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.content?.slice(0, 155),
    image: blog.featuredImage?.url ? [blog.featuredImage.url] : [`${BASE_URL}/logo.png`],
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Vinayak Enterprises',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vinayak Enterprises',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${blog.slug}`,
    },
  };

  const breadcrumbSchema = {
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
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: `${BASE_URL}/blog/${blog.slug}`,
      },
    ],
  };

  const allBlogsDoc = await BlogModel.find({ status: 'published' })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();
  const allBlogs = JSON.parse(JSON.stringify(allBlogsDoc)) as Blog[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogReader initialSlug={slug} initialBlogs={allBlogs} />
    </>
  );
}
