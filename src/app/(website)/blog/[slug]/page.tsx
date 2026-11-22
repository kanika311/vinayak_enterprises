import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDatabase } from '../../../../../server/config/database';
import BlogModel from '../../../../../server/models/Blog';
import { BlogReader } from '@/components/website/blog-reader';
import { SITE_URL } from '@/lib/site-url';
import type { Blog } from '@/types';

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
  const canonical = `${SITE_URL}/blog/${blog.slug}`;
  const imageUrl = blog.featuredImage?.url || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'en-IN': canonical,
        'x-default': canonical,
      },
    },
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
          width: 1200,
          height: 630,
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

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return notFound();
  }

  const authorName =
    blog.author?.name && blog.author?.name !== 'Super Admin'
      ? blog.author.name
      : 'Technical Team, Vinayak Enterprises';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.content?.slice(0, 155),
    image: blog.featuredImage?.url ? [blog.featuredImage.url] : [`${SITE_URL}/og-image.png`],
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: 'Educational Laboratory & Scientific Instruments Specialist',
      worksFor: {
        '@type': 'Organization',
        name: 'Vinayak Enterprises',
        url: SITE_URL,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vinayak Enterprises',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${blog.slug}`,
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
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: `${SITE_URL}/blog/${blog.slug}`,
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
