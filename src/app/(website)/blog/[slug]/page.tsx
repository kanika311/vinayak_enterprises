'use client';

import { use } from 'react';
import { BlogReader } from '@/components/website/blog-reader';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <BlogReader initialSlug={slug} />;
}
