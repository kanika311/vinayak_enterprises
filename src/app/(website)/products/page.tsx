'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/website/product-card';
import { PageHeader } from '@/components/website/page-header';
import { apiGet } from '@/lib/api';
import { FEATURED_PRODUCTS } from '@/lib/constants';
import { ProductQuoteCard } from '@/components/website/product-quote-card';
import { fadeUp, staggerContainer } from '@/components/website/motion';
import type { Product, Category } from '@/types';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories-public'],
    queryFn: () => apiGet<Category[]>('/categories', { active: true }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products-public', search, category],
    queryFn: () => apiGet<{ products: Product[] }>('/products', { status: 'published', limit: 24, search, category }),
  });

  const apiProducts = data?.products || [];
  const useFallback = !isLoading && apiProducts.length === 0 && !search && !category;
  const fallbackProducts = FEATURED_PRODUCTS.filter((p) =>
  !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="All Products"
        subtitle="Browse our complete catalogue of scientific instruments"
        dark
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-56 shrink-0"
          >
            <div className="bg-white rounded-xl border p-4 sticky top-24 shadow-sm">
              <h3 className="font-semibold text-[#1a3a6b] mb-3">Categories</h3>
              <motion.button
                onClick={() => setCategory('')}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors ${!category ? 'bg-blue-50 text-[#1a3a6b] font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                All Products
              </motion.button>
              {categories?.map((cat, i) => (
                <motion.button
                  key={cat._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setCategory(cat._id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors ${category === cat._id ? 'bg-blue-50 text-[#1a3a6b] font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </motion.aside>

          <div className="flex-1">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md h-11 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent"
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-white rounded-xl border h-72"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </motion.div>
              ) : useFallback ? (
                <motion.div
                  key="fallback"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {fallbackProducts.map((p, i) => (
                    <ProductQuoteCard key={p._id} product={p} index={i} />
                  ))}
                </motion.div>
              ) : apiProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 text-slate-500"
                >
                  <motion.p
                    className="text-5xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔬
                  </motion.p>
                  <p className="font-medium">No products found</p>
                  <p className="text-sm mt-1">Try a different search or category</p>
                </motion.div>
              ) : (
                <motion.div
                  key="products"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {apiProducts.map((p, i) => (
                    <motion.div key={p._id} variants={fadeUp} custom={i}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
