'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { staggerContainer, fadeUp } from '@/components/website/motion';
import { SiteLogo } from '@/components/website/site-logo';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';

export function WebsiteFooter() {
  const { site } = useSiteContact();
  const [emailRevealed, setEmailRevealed] = useState(false);

  return (
    <footer className="bg-[#0f2744] text-slate-300 overflow-hidden" aria-label="Site Footer">
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
            <p className="text-sm leading-relaxed mb-4">
              Manufacturer, Bulk Supplier &amp; Distributor of Scientific Instruments, Laboratory Equipment,
              Human Anatomy Models, Educational Teaching Aids, and Medical Training Products.
            </p>

            {/* Social Links */}
            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {site.facebook && (
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Vinayak Enterprises on Facebook"
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {site.instagram && (
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Vinayak Enterprises on Instagram"
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={whatsappChatUrl(site.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Vinayak Enterprises on WhatsApp"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#25D366] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-semibold text-white mb-4">Our Products</h3>
            <ul className="space-y-2 text-sm">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-orange-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-orange-400 font-semibold hover:text-orange-300">
                  View All Products →
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/catalogues', label: 'Download Catalogue' },
                { href: '/request-quote', label: 'Request Quote' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-orange-400" />
                <span className="leading-snug">Ambala Cantt, Ambala, Haryana 133001, India</span>
              </li>
              {site.phones.map((phoneItem, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-orange-400" />
                  <a href={`tel:${phoneItem.tel}`} className="hover:text-white font-medium">
                    {phoneItem.display}
                  </a>
                  {idx === 0 && site.phones.length > 1 && (
                    <span className="text-[10px] bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                  {idx === 1 && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      Alt
                    </span>
                  )}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-orange-400" />
                {emailRevealed ? (
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent('Enquiry - Vinayak Enterprises')}`}
                    className="hover:text-white break-all"
                  >
                    {site.email}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEmailRevealed(true)}
                    className="hover:text-orange-400 text-left transition-colors text-xs underline underline-offset-2"
                    title="Click to reveal email"
                  >
                    Click to reveal email or use Contact Form →
                  </button>
                )}
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
            Manufacturer of Scientific Instruments, Laboratory Equipment, Anatomy Models &amp; CPR Manikins in Ambala, Haryana, India.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
