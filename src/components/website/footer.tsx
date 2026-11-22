'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { staggerContainer, fadeUp } from '@/components/website/motion';
import { SiteLogo } from '@/components/website/site-logo';
import { useSiteContact } from '@/hooks/use-site-contact';

export function WebsiteFooter() {
  const { site } = useSiteContact();

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
            <SiteLogo variant="footer" className="mb-4" />
            <p className="text-sm leading-relaxed mb-3">
              Manufacturer, Bulk Supplier &amp; Distributor of Scientific Instruments, Laboratory Equipment,
              Human Anatomy Models, Educational Teaching Aids, and Medical Training Products.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-white mb-4">Our Products</h4>
            <ul className="space-y-2 text-sm">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-orange-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
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
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/catalogues', label: 'Catalogue' },
                { href: '/request-quote', label: 'Request Quote' },
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
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-orange-400" />
                <span>{site.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-orange-400" />
                <a href={`tel:${site.phoneTel}`} className="hover:text-white">{site.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-orange-400" />
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent('Enquiry - Vinayak Enterprises')}`}
                  className="hover:text-white break-all"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-orange-400" />
                <span>{site.workingHours}</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-slate-700/80 mt-10 pt-6 text-center text-xs text-slate-400 space-y-1"
        >
          <p>© {new Date().getFullYear()} Vinayak Enterprises. All Rights Reserved.</p>
          <p className="text-slate-500">
            Manufacturer &amp; Bulk Institutional Supplier of Scientific Instruments &amp; Laboratory Equipment in Ambala, Haryana, India.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
