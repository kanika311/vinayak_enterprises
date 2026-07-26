'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MANUFACTURING_HIGHLIGHTS } from '@/lib/constants';
import { staggerContainer, fadeUp } from '@/components/website/motion';

export function ManufacturingSection() {
  return (
    <section className="py-14 bg-white border-y border-slate-100" aria-labelledby="what-we-do-heading">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <motion.p variants={fadeUp} className="text-orange-600 font-semibold text-sm uppercase tracking-wide mb-2">
            What We Do
          </motion.p>
          <motion.h2
            id="what-we-do-heading"
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Manufacturer · Bulk Supplier · Distributor
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 mt-3 leading-relaxed">
            We manufacture scientific and educational products in-house in Ambala and supply institutions across India
            through bulk orders, tenders and distribution partnerships.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {MANUFACTURING_HIGHLIGHTS.map((item) => (
            <motion.div key={item.title} variants={fadeUp}>
              <Link
                href={item.href}
                className="group block h-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2744]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="px-4 py-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-[#1a3a6b] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-orange-600 font-medium mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore range →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
