'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/website/page-header';
import { apiGet } from '@/lib/api';
import { getCategoryStyle } from '@/lib/category-styles';
import { popIn, staggerFast } from '@/components/website/motion';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-public'],
    queryFn: () => apiGet<Category[]>('/categories', { active: true }),
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader title="Our Product Categories" subtitle="Manufacturer · Bulk Supplier · Distributor — Laboratory & Scientific Instruments" dark />
      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 bg-white rounded-xl border animate-pulse" />)}
          </div>
        ) : !categories?.length ? (
          <p className="text-center text-slate-500 py-20">No categories yet. Add categories from the admin console.</p>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerFast} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => {
              const style = getCategoryStyle(cat.slug, i);
              return (
                <motion.div key={cat._id} variants={popIn}>
                  <Link href={`/categories/${cat.slug}`} className="block">
                    <motion.div
                      className={`flex flex-col items-center text-center p-8 rounded-xl border-2 ${style.color}`}
                      whileHover={{ scale: 1.05, y: -8, boxShadow: '0 20px 40px rgba(26,58,107,0.15)' }}
                    >
                      <span className="text-6xl mb-4">{style.icon}</span>
                      <h3 className="font-bold text-slate-800">{cat.name}</h3>
                      {cat.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{cat.description}</p>}
                      <span className="text-sm text-orange-600 font-semibold mt-3">View Products →</span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
