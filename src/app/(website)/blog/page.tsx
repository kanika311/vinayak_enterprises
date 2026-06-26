'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { fadeUp, fadeDown, staggerContainer } from '@/components/website/motion';
import type { Blog } from '@/types';

export default function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs-public'],
    queryFn: () => apiGet<{ blogs: Blog[] }>('/blogs', { status: 'published', limit: 12 }),
    refetchOnMount: 'always',
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative bg-gradient-to-br from-[#1a3a6b] via-[#1e478a] to-[#2563eb] overflow-hidden">
        <motion.div
          className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container mx-auto px-4 py-14 relative">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeDown}
            className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
          >
            Blog &amp; Insights
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-blue-100 mt-2 max-w-xl"
          >
            Latest news, guides and updates from the world of scientific education and laboratory equipment.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl border h-72 animate-pulse" />)}
          </div>
        ) : !data?.blogs?.length ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 text-slate-500"
          >
            <p className="text-5xl mb-4">📝</p>
            <p>No blog posts yet. Check back soon!</p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.blogs.map((blog) => (
              <motion.div key={blog._id} variants={fadeUp}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="group flex flex-col h-full bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="h-44 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center overflow-hidden relative">
                    {blog.featuredImage?.url ? (
                      <Image src={blog.featuredImage.url} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="text-5xl transition-transform duration-500 group-hover:scale-110">📝</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {blog.category && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{blog.category}</span>
                    )}
                    <h2 className="font-bold text-lg text-slate-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h2>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">{blog.excerpt || blog.content.slice(0, 140)}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" /> {formatDate(blog.publishedAt || blog.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
