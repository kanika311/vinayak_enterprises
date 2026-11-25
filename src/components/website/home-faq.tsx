'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HOME_FAQS } from '@/lib/faqs';

export function HomeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a3a6b] tracking-tight">
            FAQs
          </h2>
        </div>

        <div className="space-y-3.5">
          {HOME_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                  isOpen
                    ? 'border-[#1a3a6b] ring-2 ring-[#1a3a6b]/20 shadow-md'
                    : 'border-[#1a3a6b]/45 hover:border-[#1a3a6b]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-800 hover:text-[#1a3a6b] gap-4 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                  <span
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#1a3a6b] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                      isOpen ? 'ring-2 ring-[#1a3a6b]/30' : ''
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-[#1a3a6b]/15 bg-blue-50/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
