'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HOME_STATS, WHY_CHOOSE_US } from '@/lib/constants';
import { staggerContainer, fadeUp } from '@/components/website/motion';
import { BadgeCheck, Factory, PackageCheck, Truck } from 'lucide-react';

const WHY_ICONS = [Factory, PackageCheck, BadgeCheck, Truck];

export function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section ref={ref} className="bg-[#1a3a6b] text-white border-y border-[#15305a]" aria-label="Company highlights">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {HOME_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="text-center md:text-left md:px-4 md:border-l md:border-white/15 first:border-l-0"
            >
              <p className="text-2xl md:text-3xl font-bold text-orange-400 tracking-tight">{stat.value}</p>
              <p className="text-sm text-blue-100 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="py-14 bg-[#f7f5f2]" aria-labelledby="why-choose-heading">
      <div className="container mx-auto px-4">
        {/* Single Centered Headline */}
        <div className="text-center mb-10">
          <h2
            id="why-choose-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a3a6b] tracking-tight"
          >
            Why Choose Us
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start"
        >
          <div>
            <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
              From Ambala Cantt — one of India&apos;s leading hubs for scientific instruments — Vinayak Enterprises
              delivers microscopes, anatomy models, CPR manikins and laboratory equipment with factory-direct pricing
              and institutional support.
            </motion.p>
            <motion.ul variants={fadeUp} className="space-y-2.5 text-sm text-slate-700">
              <li className="flex gap-2"><span className="text-orange-500 font-bold">•</span> Vilakshan Netra microscope series</li>
              <li className="flex gap-2"><span className="text-orange-500 font-bold">•</span> Anatomy &amp; skeleton models for medical colleges</li>
              <li className="flex gap-2"><span className="text-orange-500 font-bold">•</span> CPR &amp; rescue training dummies</li>
              <li className="flex gap-2"><span className="text-orange-500 font-bold">•</span> Bulk quotations for tenders &amp; annual procurement</li>
            </motion.ul>
          </div>

          <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-4">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = WHY_ICONS[i] || BadgeCheck;
              return (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#1a3a6b]/8 text-[#1a3a6b] flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
