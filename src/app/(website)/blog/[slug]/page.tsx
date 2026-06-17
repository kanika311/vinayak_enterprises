'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => apiGet<Blog>(`/blogs/slug/${slug}`),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center text-slate-500">Loading...</div>;
  if (!blog) return <div className="container mx-auto px-4 py-20 text-center">Post not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
        </Link>
        <article className="bg-white rounded-2xl border p-8 lg:p-12">
          {blog.category && <span className="text-sm text-blue-600 font-medium">{blog.category}</span>}
          <h1 className="text-3xl font-bold text-slate-900 mt-2">{blog.title}</h1>
          <p className="text-sm text-slate-400 mt-3">{blog.author?.name} · {formatDate(blog.createdAt)}</p>
          <div className="mt-8 text-slate-600 leading-relaxed whitespace-pre-line">{blog.content}</div>
        </article>
      </div>
    </div>
  );
}
