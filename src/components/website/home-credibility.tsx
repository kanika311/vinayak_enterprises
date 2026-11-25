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
              <p className="text-2xl md:text-3xl font-extrabold text-orange-400 tracking-tight">{stat.value}</p>
              <p className="text-sm font-semibold text-blue-100 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-[#f8f9fa] border-t border-slate-200/80" aria-labelledby="why-choose-heading">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Single Centered Headline */}
        <div className="text-center mb-10 sm:mb-12">
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
          className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-stretch"
        >
          {/* Left Card: High-Contrast Narrative & Feature Points */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-orange-200">
                Direct Ambala Manufacturing · Est. 2000
              </span>
              <motion.p variants={fadeUp} className="text-slate-900 font-semibold leading-relaxed mb-6 text-base sm:text-lg">
                From Ambala Cantt — India&apos;s premier hub for precision scientific instruments — Vinayak Enterprises
                delivers research microscopes, anatomical models, CPR simulators and laboratory apparatus with factory-direct pricing
                and dedicated institutional support.
              </motion.p>
              <motion.ul variants={fadeUp} className="space-y-3">
                <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-sm sm:text-[15px] text-slate-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0" />
                  <span>Vilakshan Netra high-precision microscope series</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-sm sm:text-[15px] text-slate-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0" />
                  <span>Medical-grade PVC human anatomy &amp; skeleton models</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-sm sm:text-[15px] text-slate-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>BLS/ACLS compliant CPR &amp; rescue training manikins</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-sm sm:text-[15px] text-slate-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-600 shrink-0" />
                  <span>Transparent bulk GST quotations for institutional tenders &amp; GeM</span>
                </li>
              </motion.ul>
            </div>
          </div>

          {/* Right Column: 4 Distinct Feature Cards */}
          <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = WHY_ICONS[i] || BadgeCheck;
              return (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border-2 border-slate-200/90 hover:border-[#1a3a6b] p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-[#1a3a6b] text-white flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
