'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { getCategoryStyle } from '@/lib/category-styles';
import { staggerFast, popIn } from '@/components/website/motion';
import type { Category } from '@/types';

export function CategoryGrid() {
  const { data: categories } = useQuery({
    queryKey: ['categories-public'],
    queryFn: () => apiGet<Category[]>('/categories', { active: true }),
  });

  if (!categories?.length) return null;

  return (
    <section className="bg-white py-8 border-b overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerFast}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
        >
          {categories.map((cat, i) => {
            const style = getCategoryStyle(cat.slug, i);
            return (
              <motion.div key={cat._id} variants={popIn}>
                <Link href={`/categories/${cat.slug}`} className="block">
                  <motion.div
                    className={`flex flex-col items-center text-center p-4 rounded-xl border-2 ${style.color}`}
                    whileHover={{ scale: 1.08, y: -6, boxShadow: '0 12px 24px -8px rgba(26,58,107,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-4xl mb-2 block">{style.icon}</span>
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
