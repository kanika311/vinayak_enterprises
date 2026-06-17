'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

export default function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs-public'],
    queryFn: () => apiGet<{ blogs: Blog[] }>('/blogs', { status: 'published', limit: 12 }),
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">Blog &amp; Insights</h1>
          <p className="text-slate-500 mt-1">Latest news from the world of scientific education</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-xl border h-64 animate-pulse" />)}
          </div>
        ) : !data?.blogs?.length ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">📝</p>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.blogs.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog.slug}`} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-44 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center text-5xl">📝</div>
                <div className="p-5">
                  {blog.category && <span className="text-xs text-blue-600 font-medium">{blog.category}</span>}
                  <h2 className="font-semibold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h2>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{blog.excerpt || blog.content.slice(0, 100)}</p>
                  <p className="text-xs text-slate-400 mt-3">{formatDate(blog.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
