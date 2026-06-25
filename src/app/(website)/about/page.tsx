'use client';

import { motion } from 'framer-motion';
import { PageHeader } from '@/components/website/page-header';
import { ABOUT_CONTENT, SITE } from '@/lib/constants';
import { ContactActions } from '@/components/website/contact-actions';
import { fadeUp, staggerContainer } from '@/components/website/motion';

const sections = [
  { title: 'About Us', content: ABOUT_CONTENT.intro },
  { title: 'Who We Serve', content: ABOUT_CONTENT.serving },
  { title: 'Our Focus', content: ABOUT_CONTENT.focus },
  { title: 'Manufacturing & Supply', content: ABOUT_CONTENT.manufacturing },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="About Vinayak Enterprises"
        subtitle={`Manufacturer · Bulk Supplier · Distributor · ${SITE.location}`}
        dark
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(26,58,107,0.1)' }}
              className="bg-white rounded-xl border p-8 transition-shadow"
            >
              <h2 className="text-xl font-bold text-[#1a3a6b] mb-4 flex items-center gap-3">
                <span className="h-8 w-1 bg-orange-500 rounded-full" />
                {section.title}
              </h2>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}

          <motion.div variants={fadeUp} className="bg-[#1a3a6b] rounded-xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-3">Ready to place a bulk order?</h3>
            <p className="text-blue-100 text-sm mb-6">Contact us for institutional pricing and product catalogues.</p>
            <ContactActions className="justify-center" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
