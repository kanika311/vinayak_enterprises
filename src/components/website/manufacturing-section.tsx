'use client';

import { motion } from 'framer-motion';
import { MANUFACTURING_HIGHLIGHTS } from '@/lib/constants';
import { staggerContainer, fadeUp } from '@/components/website/motion';

export function ManufacturingSection() {
  return (
    <section className="py-10 bg-gradient-to-b from-slate-50 to-white border-y">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-7"
        >
          <motion.p variants={fadeUp} className="text-orange-600 font-semibold text-sm uppercase tracking-wide mb-2">
            What We Do
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-[#1a3a6b]">
            Manufacturer · Bulk Supplier · Distributor
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 mt-3 max-w-2xl mx-auto">
            We manufacture scientific and educational products in-house and supply institutions across India through bulk orders and distribution partnerships.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {MANUFACTURING_HIGHLIGHTS.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(26,58,107,0.12)' }}
              className="bg-white border border-slate-200 rounded-xl p-5 text-center"
            >
              <span className="text-3xl block mb-3">{item.icon}</span>
              <p className="text-sm font-semibold text-[#1a3a6b] leading-snug">{item.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
