'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { getCategoryStyle } from '@/lib/category-styles';
import { staggerFast, popIn } from '@/components/website/motion';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Category } from '@/types';

export function CategoryGrid({ initialCategories }: { initialCategories?: Category[] } = {}) {
  const { data: categories = initialCategories } = useQuery({
    queryKey: ['categories-public'],
    queryFn: () => apiGet<Category[]>('/categories', { active: true }),
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
    <section className="bg-[#f7f5f2] py-10 border-b overflow-hidden" aria-label="Product Categories">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerFast}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
        >
          {list.map((cat, i) => {
            const style = getCategoryStyle(cat.slug, i);
            return (
              <motion.div key={cat._id || cat.slug} variants={popIn}>
                <Link href={`/categories/${cat.slug}`} className="block">
                  <motion.div
                    className="flex flex-col items-center text-center p-4 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md hover:border-slate-300"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span className="text-3xl mb-2 block opacity-90">{style.icon}</span>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">{cat.name}</span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
