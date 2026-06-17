'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/components/website/motion';

export function PageHeader({
  title,
  subtitle,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className={dark ? 'bg-[#1a3a6b] text-white overflow-hidden' : 'bg-white border-b overflow-hidden'}>
      <div className="container mx-auto px-4 py-10 md:py-12 relative">
        <motion.div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10"
        >
          <motion.h1
            variants={fadeUp}
            className={`text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={fadeUp}
              className={`mt-2 text-lg ${dark ? 'text-blue-200' : 'text-slate-500'}`}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            variants={fadeUp}
            className="h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full mt-4 max-w-[100px]"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
