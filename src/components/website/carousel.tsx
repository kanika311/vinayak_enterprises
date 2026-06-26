'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: ReactNode[];
  /** Tailwind width classes for each slide (controls how many show at once). */
  itemClassName?: string;
  className?: string;
}

export function Carousel({ children, itemClassName, className }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [children.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const Arrow = ({ dir, enabled }: { dir: 1 | -1; enabled: boolean }) => (
    <motion.button
      type="button"
      onClick={() => scrollBy(dir)}
      disabled={!enabled}
      aria-label={dir === -1 ? 'Previous' : 'Next'}
      whileHover={{ scale: enabled ? 1.1 : 1 }}
      whileTap={{ scale: enabled ? 0.92 : 1 }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-[#1a3a6b] transition-opacity',
        dir === -1 ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2',
        enabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {dir === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </motion.button>
  );

  return (
    <div className={cn('relative', className)}>
      <Arrow dir={-1} enabled={canLeft} />
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <div key={i} className={cn('snap-start shrink-0', itemClassName || 'w-[80%] sm:w-[45%] lg:w-[23%]')}>
            {child}
          </div>
        ))}
      </div>
      <Arrow dir={1} enabled={canRight} />
    </div>
  );
}
