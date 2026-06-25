'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/website/product-card';
import { apiGet } from '@/lib/api';
import { getCategoryStyle } from '@/lib/category-styles';
import { fadeUp, staggerContainer } from '@/components/website/motion';
import { AnimatedButton } from '@/components/website/animated-button';
import type { Category, Product } from '@/types';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => apiGet<Category>(`/categories/slug/${slug}`),
  });

  const { data: productsData, isLoading: prodLoading } = useQuery({
    queryKey: ['products-public', 'category', category?._id],
    queryFn: () => apiGet<{ products: Product[] }>('/products', { status: 'published', category: category!._id, limit: 24 }),
    enabled: !!category?._id,
  });

  const style = getCategoryStyle(slug);
  const products = productsData?.products || [];
  const isLoading = catLoading || prodLoading;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#1a3a6b] text-white overflow-hidden relative">
        <div className="container mx-auto px-4 py-10 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp}>
              <Link href="/categories" className="text-blue-200 text-sm hover:text-white mb-2 inline-block">← All Categories</Link>
            </motion.div>
            <motion.span variants={fadeUp} className="text-5xl block mb-3">{style.icon}</motion.span>
            <motion.h1 variants={fadeUp} className="text-3xl font-bold">{category?.name || slug.replace(/-/g, ' ')}</motion.h1>
            {category?.description && <motion.p variants={fadeUp} className="text-blue-200 mt-2 max-w-2xl">{category.description}</motion.p>}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 bg-white rounded-xl border animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg">No products in this category yet.</p>
            <div className="mt-6"><AnimatedButton href="/request-quote" variant="green">Get Quote</AnimatedButton></div>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
