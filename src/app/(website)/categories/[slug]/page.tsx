'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCT_CATEGORIES, FEATURED_PRODUCTS } from '@/lib/constants';
import { ProductQuoteCard } from '@/components/website/product-quote-card';
import { fadeUp, staggerContainer } from '@/components/website/motion';
import { AnimatedButton } from '@/components/website/animated-button';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const catInfo = PRODUCT_CATEGORIES.find((c) => c.slug === slug);
  const products = FEATURED_PRODUCTS.filter((p) => p.categorySlug === slug);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#1a3a6b] text-white overflow-hidden relative">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251,146,60,0.4) 0%, transparent 50%)',
          }}
        />
        <div className="container mx-auto px-4 py-10 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp}>
              <Link href="/categories" className="text-blue-200 text-sm hover:text-white mb-2 inline-block">
                ← All Categories
              </Link>
            </motion.div>
            <motion.span
              variants={fadeUp}
              className="text-5xl block mb-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {catInfo?.icon || '🔬'}
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-3xl font-bold">
              {catInfo?.name || slug.replace(/-/g, ' ')}
            </motion.h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 text-slate-500"
          >
            <motion.p
              className="text-5xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📦
            </motion.p>
            <p className="text-lg">Products coming soon in this category.</p>
            <div className="mt-6">
              <AnimatedButton href="/request-quote" variant="green">Get Quote</AnimatedButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {products.map((p, i) => (
              <ProductQuoteCard key={p._id} product={p} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
