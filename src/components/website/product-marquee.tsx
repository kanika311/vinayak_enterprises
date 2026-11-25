'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Product } from '@/types';

interface MarqueeItem {
  _id: string;
  name: string;
  slug?: string;
}

export function ProductMarquee({ products }: { products: (Product | MarqueeItem)[] }) {
  if (!products.length) return null;
  // Repeat items for seamless, non-jittering infinite ticker loop
  const items = [...products, ...products, ...products];

  return (
    <div className="relative overflow-hidden w-full select-none">
      {/* Side edge gradient fades for smooth visual transition */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-slate-100 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-slate-100 to-transparent z-10" />

      <motion.div
        className="flex gap-8 whitespace-nowrap items-center"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((p, i) => {
          const productSlug = (p as Product).slug;
          const href = productSlug ? `/products/${productSlug}` : '/products';

          return (
            <Link
              key={`${p._id}-${i}`}
              href={href}
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#1a3a6b] transition-colors shrink-0 group py-1"
            >
              <span className="text-sm select-none" aria-hidden="true">🔬</span>
              <span className="group-hover:underline decoration-[#1a3a6b] underline-offset-4 font-bold text-slate-800 group-hover:text-[#1a3a6b] transition-colors">
                {p.name}
              </span>
              <span className="text-slate-300 font-semibold ml-3 select-none" aria-hidden="true">•</span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
