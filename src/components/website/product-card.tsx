'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    sku?: string;
    shortDescription: string;
    images?: { url: string; alt?: string }[];
    category?: { name: string; slug: string } | string;
  };
  variant?: 'light' | 'dark';
}

export function ProductCard({ product, variant = 'light' }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url;
  const categoryName = typeof product.category === 'object' ? product.category?.name : '';
  const isDark = variant === 'dark';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className={cn(
        'group rounded-2xl overflow-hidden transition-shadow duration-300',
        isDark
          ? 'bg-slate-900 border border-slate-700 hover:border-orange-500/60 hover:shadow-xl'
          : 'bg-white border border-slate-200 hover:shadow-xl hover:shadow-blue-100/50 hover:border-[#1a3a6b]/30'
      )}>
        <Link href={`/products/${product.slug}`}>
          <motion.div
            className={cn('aspect-square relative overflow-hidden', isDark ? 'bg-slate-800' : 'bg-gradient-to-br from-slate-50 to-blue-50')}
            whileHover={{ scale: 1.02 }}
          >
            {imageUrl ? (
              <Image src={imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl">
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🔬
                </motion.span>
              </div>
            )}
            {categoryName && (
              <motion.span
                className={cn(
                  'absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full',
                  isDark ? 'bg-orange-500 text-white' : 'bg-[#1a3a6b] text-white'
                )}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {categoryName}
              </motion.span>
            )}
          </motion.div>
          <div className="p-5">
            {product.sku && <p className={cn('text-xs font-mono mb-1', isDark ? 'text-orange-400' : 'text-slate-400')}>{product.sku}</p>}
            <h3 className={cn('font-bold line-clamp-2 leading-snug group-hover:text-[#1a3a6b] transition-colors', isDark ? 'text-white' : 'text-slate-900')}>
              {product.name}
            </h3>
            <p className={cn('text-sm mt-2 line-clamp-2 leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {product.shortDescription}
            </p>
            <div className={cn('mt-4 pt-4 border-t flex items-center justify-between', isDark ? 'border-slate-700' : 'border-slate-100')}>
              <span className="text-sm font-bold text-green-600">Get Quote →</span>
              <motion.span
                className={cn('h-8 w-8 rounded-full flex items-center justify-center', isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-50 text-[#1a3a6b]')}
                whileHover={{ rotate: 90, backgroundColor: '#f97316', color: '#fff' }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
