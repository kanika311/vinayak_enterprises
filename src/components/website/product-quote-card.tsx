'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ShowcaseProduct } from '@/lib/constants';

interface ProductQuoteCardProps {
  product: ShowcaseProduct;
  index?: number;
}

function getEmoji(slug: string) {
  if (slug.includes('microscope') || slug.includes('scientific')) return '🔬';
  if (slug.includes('biological') || slug.includes('model')) return '🫀';
  if (slug.includes('chemistry')) return '🧪';
  if (slug.includes('physics')) return '⚡';
  if (slug.includes('educational')) return '📚';
  return '⚗️';
}

export function ProductQuoteCard({ product, index = 0 }: ProductQuoteCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileHover={{ z: 20 }}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-100/60 hover:border-[#1a3a6b]/30 transition-shadow group flex flex-col h-full cursor-pointer"
    >
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <motion.div
          className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center text-6xl border-b border-slate-100 relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
          >
            {getEmoji(product.categorySlug)}
          </motion.span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </motion.div>
      </Link>

      <div className="p-4 flex flex-col flex-1" style={{ transform: 'translateZ(20px)' }}>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-[#1a3a6b] line-clamp-2 min-h-[2.5rem] transition-colors">
            {product.name}
          </h3>
        </Link>

        <motion.p
          className="text-lg font-bold text-[#1a3a6b] mt-2"
          initial={{ opacity: 0.8 }}
          whileInView={{ opacity: 1 }}
        >
          ₹ {product.price}
          <span className="text-sm font-normal text-slate-500">{product.unit}</span>
        </motion.p>

        <motion.ul
          className="mt-3 space-y-1 flex-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {product.specs.map((spec) => (
            <motion.li
              key={spec}
              variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
              className="text-xs text-slate-600 flex items-start gap-1.5"
            >
              <motion.span className="text-orange-500 mt-0.5" whileHover={{ scale: 1.5 }}>•</motion.span>
              {spec}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-4">
          <Link
            href={`/request-quote?product=${encodeURIComponent(product.name)}`}
            className="block w-full text-center py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors relative overflow-hidden group/btn"
          >
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">Get Quote</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
