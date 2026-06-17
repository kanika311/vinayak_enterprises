'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { staggerFast, popIn } from '@/components/website/motion';

export function CategoryGrid() {
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
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} variants={popIn}>
              <Link href={`/categories/${cat.slug}`} className="block">
                <motion.div
                  className={`flex flex-col items-center text-center p-4 rounded-xl border-2 ${cat.color}`}
                  whileHover={{
                    scale: 1.08,
                    y: -6,
                    boxShadow: '0 12px 24px -8px rgba(26,58,107,0.2)',
                    transition: { type: 'spring', stiffness: 400, damping: 20 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="text-4xl mb-2 block"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {cat.icon}
                  </motion.span>
                  <span className="text-xs font-semibold text-slate-700 leading-tight">{cat.name}</span>
                  <motion.span
                    className="text-[10px] text-orange-500 font-bold mt-1 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    Explore →
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
