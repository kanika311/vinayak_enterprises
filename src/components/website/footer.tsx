'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { SITE, PRODUCT_CATEGORIES } from '@/lib/constants';
import { staggerContainer, fadeUp } from '@/components/website/motion';

export function WebsiteFooter() {
  return (
    <footer className="bg-[#0f2744] text-slate-300 overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="h-10 w-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                SI
              </motion.div>
              <div>
                <span className="font-bold text-white block">{SITE.name}</span>
                <span className="text-xs text-slate-400">{SITE.location}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3">
              Trader - Wholesaler/Distributor of chemistry lab instruments, laboratory equipment, physics &amp; scientific instruments.
            </p>
            <p className="text-xs text-slate-400">GST No. {SITE.gst}</p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-white mb-4">Our Products</h4>
            <ul className="space-y-2 text-sm">
              {PRODUCT_CATEGORIES.map((cat, i) => (
                <motion.li
                  key={cat.slug}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/categories/${cat.slug}`} className="hover:text-orange-400 transition-colors inline-block hover:translate-x-1 duration-200">
                    {cat.name}
                  </Link>
                </motion.li>
              ))}
              <li>
                <Link href="/products" className="text-orange-400 font-semibold hover:text-orange-300">View All →</Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/about', label: 'Profile' },
                { href: '/about', label: 'Quality' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/catalogues', label: 'Catalogue' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="font-medium text-white">{SITE.ceo}</li>
              <motion.li className="flex items-start gap-2" whileHover={{ x: 4 }}>
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-orange-400" /> {SITE.address}
              </motion.li>
              <motion.li className="flex items-center gap-2" whileHover={{ x: 4 }}>
                <Phone className="h-4 w-4 shrink-0 text-orange-400" />
                <a href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phone}</a>
              </motion.li>
              <motion.li className="flex items-center gap-2" whileHover={{ x: 4 }}>
                <Mail className="h-4 w-4 shrink-0 text-orange-400" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500"
        >
          <p>© {new Date().getFullYear()} {SITE.name}. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
