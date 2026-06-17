'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'green';
  className?: string;
}

const variants = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30',
  outline: 'border-2 border-white/70 text-white hover:bg-white/15 backdrop-blur-sm',
  green: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30',
};

export function AnimatedButton({ href, children, variant = 'primary', className }: AnimatedButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-colors',
          variants[variant],
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export function AnimatedIconButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.08, rotate: 2 }} whileTap={{ scale: 0.92 }}>
      <Link href={href} className={className}>{children}</Link>
    </motion.div>
  );
}

export function PulseCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 0 0 rgba(249,115,22,0.4)', '0 0 0 12px rgba(249,115,22,0)', '0 0 0 0 rgba(249,115,22,0)'] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="inline-block rounded-lg"
    >
      <AnimatedButton href={href} variant="primary">
        {children} <ArrowRight className="h-4 w-4" />
      </AnimatedButton>
    </motion.div>
  );
}
