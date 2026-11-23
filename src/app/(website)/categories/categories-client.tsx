'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/website/page-header';
import { apiGet } from '@/lib/api';
import { getCategoryStyle } from '@/lib/category-styles';
import { popIn, staggerFast } from '@/components/website/motion';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Category } from '@/types';

export function CategoriesClient({
  initialCategories,
}: {
  initialCategories?: Category[];
} = {}) {
  const { data: categories = initialCategories } = useQuery({
    queryKey: ['categories-public-with-products'],
    queryFn: () => apiGet<Category[]>('/categories', { active: true, hasProducts: true }),
    initialData: initialCategories,
  });

  const list =
    categories && categories.length > 0
      ? categories
      : PRODUCT_CATEGORIES.map((c) => ({
          _id: c.slug,
          name: c.name,
          slug: c.slug,
          isActive: true,
          order: 0,
          subcategories: [],
        }));

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Product Categories"
        subtitle="Manufacturer · Bulk Supplier · Distributor — Laboratory & Scientific Instruments"
        dark
      />
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerFast}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {list.map((cat, i) => {
            const style = getCategoryStyle(cat.slug, i);
            return (
              <motion.div key={cat._id || cat.slug} variants={popIn}>
                <Link href={`/categories/${cat.slug}`} className="block">
                  <motion.div
                    className={`flex flex-col items-center text-center p-8 rounded-xl border-2 ${style.color}`}
                    whileHover={{ scale: 1.05, y: -8, boxShadow: '0 20px 40px rgba(26,58,107,0.15)' }}
                  >
                    <span className="text-6xl mb-4">{style.icon}</span>
                    <h2 className="font-bold text-[#1a3a6b] text-lg mb-2">{cat.name}</h2>
                    <span className="text-sm text-slate-500 font-medium">View Products →</span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
