'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { ProductCard } from '@/components/website/product-card';
import { Button } from '@/components/ui/button';
import { staggerContainer, fadeUp } from '@/components/website/motion';

interface ProductSliderProps {
  products: {
    _id: string;
    name: string;
    slug: string;
    sku?: string;
    shortDescription: string;
    images?: { url: string; alt?: string }[];
    category?: { name: string; slug: string } | string;
  }[];
  title?: string;
  subtitle?: string;
}

export function ProductSlider({ products, title = 'Featured Products', subtitle = 'Hand-picked instruments trusted by institutions worldwide' }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth * 0.75 : el.clientWidth * 0.75, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 text-sm font-bold uppercase tracking-widest">Featured</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
            <p className="text-slate-400 mt-2 max-w-md">{subtitle}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button onClick={() => scroll('left')} disabled={!canScrollLeft}
              className="h-11 w-11 rounded-full border-2 border-teal-600/50 bg-slate-900 text-teal-300 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:border-teal-500 disabled:opacity-30 transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll('right')} disabled={!canScrollRight}
              className="h-11 w-11 rounded-full border-2 border-teal-600/50 bg-slate-900 text-teal-300 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:border-teal-500 disabled:opacity-30 transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
            <Button asChild variant="accent" className="ml-2 h-11">
              <Link href="/products">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>

        <div ref={scrollRef} onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: 'none' }}>
          {products.map((product, i) => (
            <motion.div key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="min-w-[290px] sm:min-w-[310px] lg:min-w-[330px] snap-start shrink-0"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-teal-500/40 to-amber-500/30 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <ProductCard product={product} variant="dark" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress bar hint */}
        <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden max-w-xs mx-auto sm:mx-0">
          <motion.div className="h-full bg-gradient-to-r from-teal-500 to-amber-400 rounded-full" initial={{ width: '30%' }} whileInView={{ width: '60%' }} transition={{ duration: 1.5 }} />
        </div>
      </div>
    </section>
  );
}
