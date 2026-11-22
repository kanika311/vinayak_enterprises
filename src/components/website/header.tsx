'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, ChevronDown, Search, Download } from 'lucide-react';
import { NAV_LINKS, PRODUCT_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { fadeDown, staggerFast, popIn } from '@/components/website/motion';
import { SiteLogo } from '@/components/website/site-logo';
import { useSiteContact } from '@/hooks/use-site-contact';
import { apiGet } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function WebsiteHeader() {
  const { site } = useSiteContact();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const { data: cataloguesData } = useQuery({
    queryKey: ['catalogues-public'],
    queryFn: () => apiGet<{ catalogues: { file: { url: string } }[] }>('/catalogues'),
    staleTime: 60_000,
  });
  const catalogueUrl = cataloguesData?.catalogues?.[0]?.file?.url || '/catalogues';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerFast}
        className="bg-[#1a3a6b] text-white text-xs md:text-sm"
      >
        <div className="container mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-2">
          <motion.div variants={fadeDown} className="flex flex-wrap items-center gap-4">
            <span className="font-medium">{site.location}</span>
            <span className="hidden sm:inline text-blue-200">{site.workingHours}</span>
          </motion.div>
          <motion.div variants={fadeDown} className="flex flex-wrap items-center gap-4">
            <motion.a
              href={`tel:${site.phoneTel}`}
              className="flex items-center gap-1 font-semibold hover:text-orange-300"
              whileHover={{ scale: 1.03 }}
            >
              <Phone className="h-3.5 w-3.5" /> Call {site.phone}
            </motion.a>
            <motion.a
              href={`mailto:${site.email}?subject=${encodeURIComponent('Enquiry - Vinayak Enterprises')}`}
              className="flex items-center gap-1 hover:text-orange-300"
              whileHover={{ scale: 1.03 }}
              title={site.email}
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{site.email}</span>
              <span className="md:hidden">Email</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <motion.header
        className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-200"
        animate={{ paddingTop: scrolled ? 0 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="container mx-auto px-4"
          animate={{ height: scrolled ? 64 : 72 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex h-full items-center justify-between gap-4">
            <SiteLogo variant="header" priority className="-ml-1" />

            <motion.div
              className="hidden md:flex flex-1 max-w-md mx-4"
              animate={{ scale: searchFocused ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className={`flex w-full rounded-lg border-2 overflow-hidden transition-colors ${searchFocused ? 'border-[#1a3a6b] shadow-lg shadow-blue-100' : 'border-slate-200'}`}>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="flex-1 px-4 py-2 text-sm outline-none"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={`/products?search=${searchQuery}`}
                    aria-label="Search products"
                    className="bg-[#1a3a6b] text-white px-4 h-full flex items-center hover:bg-[#15305a]"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/catalogues', label: 'Catalogue' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <motion.div key={link.href} whileHover={{ y: -2 }}>
                  <Link href={link.href} className="relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1a3a6b] group">
                    {link.label}
                    <motion.span
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
              <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
                <motion.button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1a3a6b]"
                  animate={{ color: productsOpen ? '#1a3a6b' : undefined }}
                >
                  Our Products
                  <motion.span animate={{ rotate: productsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </motion.button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute top-full left-0 w-72 bg-white border shadow-xl rounded-lg py-2 z-50"
                    >
                      <motion.div initial="hidden" animate="visible" variants={staggerFast}>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <motion.div key={cat.slug} variants={popIn}>
                            <Link
                              href={`/categories/${cat.slug}`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#1a3a6b]"
                            >
                              <motion.span whileHover={{ scale: 1.3, rotate: 10 }}>{cat.icon}</motion.span>
                              {cat.name}
                            </Link>
                          </motion.div>
                        ))}
                        <Link href="/categories" className="block px-4 py-2.5 text-sm font-semibold text-orange-600 border-t mt-1 hover:bg-orange-50">
                          View All Categories →
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                <Button asChild variant="outline" className="border-[#1a3a6b]/30 text-[#1a3a6b] hover:bg-blue-50 font-semibold">
                  {catalogueUrl.startsWith('http') ? (
                    <a href={catalogueUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-1.5 h-4 w-4" /> Catalogue
                    </a>
                  ) : (
                    <Link href="/catalogues">
                      <Download className="mr-1.5 h-4 w-4" /> Catalogue
                    </Link>
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow">
                  <Link href="/request-quote">Get Quote</Link>
                </Button>
              </motion.div>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {mobileOpen ? <X /> : <Menu />}
                </motion.div>
              </Button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden border-t overflow-hidden bg-white"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerFast}
                className="px-4 py-4 space-y-1"
              >
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.href} variants={popIn}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium hover:bg-blue-50 rounded"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={popIn}>
                  {catalogueUrl.startsWith('http') ? (
                    <a
                      href={catalogueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#1a3a6b] hover:bg-blue-50 rounded"
                    >
                      <Download className="h-4 w-4" /> Download Catalogue
                    </a>
                  ) : (
                    <Link
                      href="/catalogues"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#1a3a6b] hover:bg-blue-50 rounded"
                    >
                      <Download className="h-4 w-4" /> Download Catalogue
                    </Link>
                  )}
                </motion.div>
                <motion.div variants={popIn}>
                  <Button asChild className="w-full mt-2 bg-orange-500 hover:bg-orange-600">
                    <Link href="/request-quote" onClick={() => setMobileOpen(false)}>Get Quote</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
