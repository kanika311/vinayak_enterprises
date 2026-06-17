'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { PageHeader } from '@/components/website/page-header';
import { popIn, staggerFast } from '@/components/website/motion';

export default function CategoriesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Our Product Categories"
        subtitle="Wholesaler / Distributor of Laboratory & Scientific Instruments"
        dark
      />
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerFast}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <motion.div key={cat.slug} variants={popIn}>
              <Link href={`/categories/${cat.slug}`} className="block">
                <motion.div
                  className={`flex flex-col items-center text-center p-8 rounded-xl border-2 ${cat.color}`}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    boxShadow: '0 20px 40px rgba(26,58,107,0.15)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="text-6xl mb-4"
                    whileHover={{ rotate: [0, -15, 15, 0], scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {cat.icon}
                  </motion.span>
                  <h3 className="font-bold text-slate-800">{cat.name}</h3>
                  <motion.span
                    className="text-sm text-orange-600 font-semibold mt-3"
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1, x: 4 }}
                  >
                    View Products →
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
