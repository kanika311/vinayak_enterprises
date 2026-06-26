'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, User, Clock } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { fadeUp, staggerContainer } from '@/components/website/motion';
import type { Blog } from '@/types';

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="bg-white rounded-2xl border p-8 space-y-4">
          <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  if (!blog) return <div className="container mx-auto px-4 py-20 text-center">Post not found</div>;

  const paragraphs = blog.content.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" /> Back to Blog
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        >
          {blog.featuredImage?.url && (
            <motion.div
              className="relative h-60 md:h-80"
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={blog.featuredImage.url} alt={blog.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          )}

          <div className="p-8 lg:p-12">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              {blog.category && (
                <motion.span
                  variants={fadeUp}
                  className="inline-block text-xs font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 px-3 py-1 rounded-full"
                >
                  {blog.category}
                </motion.span>
              )}

              <motion.h1
                variants={fadeUp}
                className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 leading-tight tracking-tight"
              >
                {blog.title}
              </motion.h1>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 mt-5 pb-6 border-b border-slate-100"
              >
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4 text-blue-500" /> {blog.author?.name || 'Vinayak Enterprises'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-blue-500" /> {formatDate(blog.publishedAt || blog.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-500" /> {readingTime(blog.content)} min read
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="mt-8 space-y-6"
            >
              {paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  className="text-[1.075rem] leading-8 text-slate-700 first:first-letter:text-5xl first:first-letter:font-bold first:first-letter:text-[#1a3a6b] first:first-letter:mr-2 first:first-letter:float-left first:first-letter:leading-[0.85]"
                >
                  {para}
                </motion.p>
              ))}
            </motion.div>

            {blog.tags && blog.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-slate-100"
              >
                {blog.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.article>

        {related.length > 0 && (
          <motion.div
            className="mt-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-xl font-bold text-slate-900 mb-6">
              Related Posts
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((post) => (
                <motion.div key={post._id} variants={fadeUp}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block h-full bg-white rounded-xl border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {post.category && (
                      <span className="text-xs font-semibold text-blue-600">{post.category}</span>
                    )}
                    <h3 className="font-semibold text-slate-900 line-clamp-2 mt-1 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-3">{formatDate(post.publishedAt || post.createdAt)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
