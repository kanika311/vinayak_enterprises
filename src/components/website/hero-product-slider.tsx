'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SliderProduct {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  shortDescription: string;
  images?: { url: string; alt?: string }[];
  category?: { name: string; slug: string };
  badge?: string;
  gradient?: string;
}

const defaultSlides: SliderProduct[] = [
  {
    _id: '1', name: 'Binocular Research Microscope', slug: 'binocular-research-microscope', sku: 'MIC-001',
    shortDescription: 'High-resolution optical microscope engineered for university research labs and medical institutions.',
    images: [], category: { name: 'Microscopes', slug: 'microscopes' }, badge: 'Best Seller',
    gradient: 'from-teal-800 via-teal-900 to-slate-950',
  },
  {
    _id: '2', name: 'Human Skeleton Model 170cm', slug: 'human-skeleton-170cm', sku: 'SKL-001',
    shortDescription: 'Life-size articulated skeleton with rolling stand — ideal for medical colleges.',
    images: [], category: { name: 'Skeleton Models', slug: 'human-skeleton-models' }, badge: 'Top Rated',
    gradient: 'from-emerald-800 via-teal-900 to-slate-950',
  },
  {
    _id: '3', name: 'CPR Training Manikin Adult', slug: 'cpr-manikin-adult', sku: 'CPR-001',
    shortDescription: 'Realistic CPR manikin with compression feedback for hospitals and nursing schools.',
    images: [], category: { name: 'CPR Manikins', slug: 'cpr-training-manikins' }, badge: 'New Arrival',
    gradient: 'from-cyan-800 via-teal-900 to-slate-950',
  },
  {
    _id: '4', name: 'Digital USB Microscope 5MP', slug: 'digital-usb-microscope', sku: 'DMIC-001',
    shortDescription: 'USB digital microscope with LED illumination for schools and quality inspection.',
    images: [], category: { name: 'Digital Microscopes', slug: 'digital-microscopes' }, badge: 'Featured',
    gradient: 'from-teal-700 via-slate-800 to-slate-950',
  },
];

interface HeroProductSliderProps {
  products?: SliderProduct[];
  autoPlayMs?: number;
}

export function HeroProductSlider({ products = defaultSlides, autoPlayMs = 5000 }: HeroProductSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const slides = products.length > 0 ? products : defaultSlides;

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent((index + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, autoPlayMs);
    return () => clearInterval(timer);
  }, [next, autoPlayMs]);

  const slide = slides[current];
  const imageUrl = slide.images?.[0]?.url;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[520px] lg:min-h-[600px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={cn('absolute inset-0 bg-gradient-to-br', slide.gradient || 'from-teal-800 to-slate-950')}
        />
      </AnimatePresence>

      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[520px] lg:min-h-[600px] py-12">
          <div className="order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-teal-200 font-medium">Trusted by 500+ Institutions Worldwide</span>
            </motion.div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: 'easeInOut' }}>
                {slide.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-xs font-bold mb-4">
                    {slide.badge}
                  </span>
                )}
                {slide.category && <p className="text-teal-300 text-sm font-semibold mb-2 uppercase tracking-wide">{slide.category.name}</p>}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">{slide.name}</h1>
                <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">{slide.shortDescription}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" variant="accent" className="h-12 px-6">
                    <Link href={`/products/${slide.slug}`}>View Product <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="heroOutline" className="h-12 px-6">
                    <Link href="/request-quote">Get Quote</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 mt-10">
              {slides.map((_, i) => (
                <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
                  className={cn('h-2 rounded-full transition-all duration-300', i === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50')}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45 }} className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-4 rounded-3xl bg-white/5 backdrop-blur-sm border-2 border-teal-400/30 shadow-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={slide.name} fill className="object-contain p-8" />
                  ) : (
                    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="text-[120px] select-none">
                      {current === 0 ? '🔬' : current === 1 ? '🦴' : current === 2 ? '🩺' : '💻'}
                    </motion.div>
                  )}
                </div>
                {slide.sku && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-teal-500/40 text-xs font-mono text-teal-200">
                    SKU: {slide.sku}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-slate-900/60 border border-teal-500/40 flex items-center justify-center hover:bg-teal-600 transition-colors z-10" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-slate-900/60 border border-teal-500/40 flex items-center justify-center hover:bg-teal-600 transition-colors z-10" aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
