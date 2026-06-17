'use client';

import { motion } from 'framer-motion';
import { PageHeader } from '@/components/website/page-header';
import { fadeUp, staggerContainer } from '@/components/website/motion';

const sections = [
  {
    title: 'About Us',
    content: 'We are a progressive firm engaged in the supply of a wide spectrum of conventional to modern products used in laboratories. From chemistry lab instruments and physics equipment to biological models and educational teaching aids, we serve institutions across India.',
  },
  {
    title: 'Quality',
    content: 'All products are sourced from reputed manufacturers and tested for quality. We maintain strict quality standards for educational and laboratory use.',
  },
  {
    title: 'Our Team',
    content: 'Our dedicated sales and support team assists schools, colleges, hospitals, dealers and distributors with product selection, bulk pricing and after-sales support.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Company Profile"
        subtitle="Trader - Wholesaler / Distributor · New Delhi, India"
        dark
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(26,58,107,0.1)' }}
              className="bg-white rounded-xl border p-8 transition-shadow"
            >
              <motion.h2
                className="text-xl font-bold text-[#1a3a6b] mb-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.span
                  className="h-8 w-1 bg-orange-500 rounded-full"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                />
                {section.title}
              </motion.h2>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
