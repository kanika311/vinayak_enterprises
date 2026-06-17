'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  slug: string;
  name: string;
  icon: string;
  desc: string;
}

export function CategoryCard({ slug, name, icon, desc }: CategoryCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
      <Link href={`/categories/${slug}`} className="group block bg-white rounded-2xl border-2 border-slate-100 p-6 text-center hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-amber-50/0 group-hover:from-teal-50 group-hover:to-amber-50/50 transition-all duration-300" />
        <div className="relative">
          <motion.div className="text-5xl mb-4 inline-block" whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}>
            {icon}
          </motion.div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">{name}</h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}
