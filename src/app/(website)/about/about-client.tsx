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

export function AboutClient() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="About Vinayak Enterprises"
        subtitle={`Manufacturer · Bulk Supplier · Distributor · ${SITE.location}`}
        dark
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
          {sections.map((section) => (
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

          {/* Visible Quality & Certifications Section Placeholder */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 text-center"
          >
            <h2 className="text-xl font-bold text-[#1a3a6b] mb-2 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Quality Compliance &amp; Institutional Standards
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
              All scientific instruments, laboratory apparatus and anatomical models are manufactured strictly according to
              standard institutional syllabi and laboratory quality benchmarks.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 italic max-w-xl mx-auto">
              {/* Official certifications placeholder: ISO 9001 / CE / GMP to be displayed here once certificates are provided */}
              Official certification certificates (ISO 9001, CE, GMP) are available upon request for institutional tender submissions. Formal digital badges will be published here upon verification.
            </div>
          </motion.div>

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
