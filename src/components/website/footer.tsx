'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Youtube, MessageCircle, ShieldCheck, FileCheck } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { staggerContainer, fadeUp } from '@/components/website/motion';
import { SiteLogo } from '@/components/website/site-logo';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';

export function WebsiteFooter() {
  const { site } = useSiteContact();

  return (
    <footer
      className="bg-white text-slate-600 border-t border-slate-200 overflow-hidden"
      aria-label="Site Footer"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <meta itemProp="name" content="Vinayak Enterprises" />
      <meta itemProp="url" content="https://www.vinayakenterprisess.agency" />
      <meta itemProp="image" content="https://www.vinayakenterprisess.agency/og-image.png" />
      <meta itemProp="priceRange" content="₹₹ - ₹₹₹₹" />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <SiteLogo variant="header" className="mb-4" />
            <p className="text-sm leading-relaxed text-slate-600 mb-3.5">
              Manufacturer, Bulk Supplier &amp; Distributor of Scientific Instruments, Laboratory Equipment,
              Human Anatomy Models, Educational Teaching Aids, and Medical Training Products.
            </p>

            {/* GSTIN Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-medium text-slate-700 mb-4 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>GSTIN: <strong className="font-mono text-slate-900 font-bold tracking-wide">06AHLPA7723L1Z7</strong></span>
            </div>

            {/* Social Links */}
            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {site.facebook && (
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer me"
                    itemProp="sameAs"
                    aria-label="Follow Vinayak Enterprises on Facebook"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#1877F2] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 border border-slate-200"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {site.instagram && (
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer me"
                    itemProp="sameAs"
                    aria-label="Follow Vinayak Enterprises on Instagram"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 border border-slate-200"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {site.linkedin && (
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer me"
                    itemProp="sameAs"
                    aria-label="Connect with Vinayak Enterprises on LinkedIn"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#0A66C2] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 border border-slate-200"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {site.youtube && (
                  <a
                    href={site.youtube}
                    target="_blank"
                    rel="noopener noreferrer me"
                    itemProp="sameAs"
                    aria-label="Subscribe to Vinayak Enterprises on YouTube"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#FF0000] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 border border-slate-200"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={whatsappChatUrl(site.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label="Chat with Vinayak Enterprises on WhatsApp"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#25D366] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 border border-slate-200"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-bold text-slate-900 mb-4 text-base">Our Products</h3>
            <ul className="space-y-2.5 text-sm">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categories/${cat.slug}`} className="text-slate-600 hover:text-orange-600 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-orange-600 font-semibold hover:text-orange-700">
                  View All Products →
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-bold text-slate-900 mb-4 text-base">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/catalogues', label: 'Download Catalogue' },
                { href: '/request-quote', label: 'Request Quote' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-600 hover:text-orange-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-bold text-slate-900 mb-4 text-base">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                <address className="not-italic leading-snug text-slate-700">
                  <span itemProp="streetAddress">Ambala Cantt</span>, <span itemProp="addressLocality">Ambala</span>, <span itemProp="addressRegion">Haryana</span> <span itemProp="postalCode">133001</span>, <span itemProp="addressCountry">India</span>
                </address>
              </li>
              <li className="flex items-center gap-2.5">
                <FileCheck className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="text-slate-700">
                  GSTIN: <strong className="font-mono text-slate-900 font-bold tracking-wide">06AHLPA7723L1Z7</strong>
                </span>
              </li>
              {site.phones.map((phoneItem, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                  <a
                    href={`tel:${phoneItem.tel}`}
                    itemProp="telephone"
                    className="hover:text-[#1a3a6b] text-slate-800 font-semibold transition-colors"
                  >
                    {phoneItem.display}
                  </a>
                  {idx === 0 && site.phones.length > 1 && (
                    <span className="text-[10px] bg-blue-100 text-[#1a3a6b] font-semibold px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                  {idx === 1 && (
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded border border-slate-200">
                      Alt
                    </span>
                  )}
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent('Enquiry - Vinayak Enterprises')}`}
                  itemProp="email"
                  className="hover:text-orange-600 text-slate-700 font-medium break-all transition-colors"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                <span className="text-slate-700">{site.workingHours}</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-slate-200 mt-10 pt-6 text-center text-xs text-slate-500 space-y-1"
        >
          <p className="font-medium text-slate-600">
            © {new Date().getFullYear()} Vinayak Enterprises. All Rights Reserved. · GSTIN: <span className="font-mono font-bold text-slate-800">06AHLPA7723L1Z7</span>
          </p>
          <p className="text-slate-500">
            Manufacturer of Scientific Instruments, Laboratory Equipment, Anatomy Models &amp; CPR Manikins in Ambala, Haryana, India.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
