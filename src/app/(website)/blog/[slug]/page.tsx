'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
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

  const { data: relatedData } = useQuery({
    queryKey: ['blogs-public', 'related', blog?.category],
    queryFn: () => apiGet<{ blogs: Blog[] }>('/blogs', { status: 'published', limit: 4, category: blog!.category }),
    enabled: !!blog?.category,
  });

  const related = (relatedData?.blogs || []).filter((b) => b.slug !== slug).slice(0, 3);

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center text-slate-500">Loading...</div>;
  if (!blog) return <div className="container mx-auto px-4 py-20 text-center">Post not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
        </Link>
        <article className="bg-white rounded-2xl border overflow-hidden">
          {blog.featuredImage?.url && (
            <div className="relative h-56 md:h-72">
              <Image src={blog.featuredImage.url} alt={blog.title} fill className="object-cover" />
            </div>
          )}
          <div className="p-8 lg:p-12">
            {blog.category && <span className="text-sm text-blue-600 font-medium">{blog.category}</span>}
            <h1 className="text-3xl font-bold text-slate-900 mt-2">{blog.title}</h1>
            <p className="text-sm text-slate-400 mt-3">{blog.author?.name} · {formatDate(blog.publishedAt || blog.createdAt)}</p>
            <div className="mt-8 text-slate-600 leading-relaxed whitespace-pre-line">{blog.content}</div>
          </div>
        </article>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 line-clamp-2 hover:text-blue-600">{post.title}</h3>
                  <p className="text-xs text-slate-400 mt-2">{formatDate(post.publishedAt || post.createdAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
