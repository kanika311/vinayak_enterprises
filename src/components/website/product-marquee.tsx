'use client';

import { motion } from 'framer-motion';
import type { ShowcaseProduct } from '@/lib/constants';

export function ProductMarquee({ products }: { products: ShowcaseProduct[] }) {
  const items = [...products, ...products];

  return (
    <div className="relative border-t border-white/10 py-3 overflow-hidden bg-black/10">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((p, i) => (
          <span key={`${p._id}-${i}`} className="inline-flex items-center gap-2 text-sm text-blue-100/80 shrink-0">
            <span className="text-orange-400 font-bold">₹{p.price}</span>
            <span>{p.name}</span>
            <span className="text-white/30">|</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
