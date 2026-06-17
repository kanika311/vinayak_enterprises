'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BUSINESS_INFO, SITE } from '@/lib/constants';
import { Building2, Users, FileText, TrendingUp, Shield } from 'lucide-react';
import { staggerContainer, fadeUp, scaleIn } from '@/components/website/motion';
import { AnimatedButton } from '@/components/website/animated-button';

const icons = [Building2, Users, FileText, Shield, TrendingUp, FileText];

export function BusinessTrustBar() {
  return (
    <section className="bg-slate-50 py-12 border-y overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {BUSINESS_INFO.map((item, i) => {
            const Icon = icons[i] || Building2;
            return (
              <motion.div
                key={item.label}
                variants={scaleIn}
                whileHover={{ y: -6, scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                className="bg-white border border-slate-200 rounded-xl p-4 text-center cursor-default transition-colors hover:border-[#1a3a6b]/30"
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <Icon className="h-6 w-6 text-[#1a3a6b] mx-auto mb-2" />
                </motion.div>
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className="text-sm font-bold text-slate-800">{item.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold px-4 py-2 rounded-full cursor-default"
          >
            <Shield className="h-3.5 w-3.5" /> Trustseal Verified
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-semibold px-4 py-2 rounded-full cursor-default"
          >
            GST Registered
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

export function WelcomeSection() {
  return (
    <section className="py-14 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="text-orange-600 font-semibold text-sm uppercase tracking-wide mb-2">
              Welcome To
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4">
              {SITE.name}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-4">
              We are a progressive firm engaged in the supply of a wide spectrum of conventional to modern products used in laboratories.
              Our range promises to ease the task of day-to-day analysis with the latest technology in research &amp; development.
            </motion.p>
            <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-6">
              From chemistry lab instruments and physics equipment to biological models and educational teaching aids —
              we serve schools, colleges, hospitals, dealers and distributors across India and abroad.
            </motion.p>
            <motion.div variants={fadeUp} whileHover={{ x: 6 }}>
              <Link href="/about" className="inline-flex items-center gap-1 text-[#1a3a6b] font-semibold hover:text-orange-600 transition-colors">
                Read More →
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-[#1a3a6b] to-[#2563eb] rounded-2xl p-8 text-white shadow-2xl shadow-blue-900/30"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold mb-4"
            >
              Get in Touch for Best Deals
            </motion.h3>
            <p className="text-blue-100 text-sm mb-6">Bulk orders, institutional pricing &amp; dealer enquiries welcome.</p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3 text-sm"
            >
              {[`Phone: ${SITE.phone}`, `Email: ${SITE.email}`, `GST: ${SITE.gst}`].map((line) => (
                <motion.p key={line} variants={fadeUp}>{line}</motion.p>
              ))}
            </motion.div>
            <div className="mt-6">
              <AnimatedButton href="/contact" variant="primary">Contact Us</AnimatedButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
