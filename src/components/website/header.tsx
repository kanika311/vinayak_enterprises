'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { NAV_LINKS, PRODUCT_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { fadeDown, staggerFast, popIn } from '@/components/website/motion';
import { SiteLogo } from '@/components/website/site-logo';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';
import { apiGet } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/types';

export function WebsiteHeader() {
  const { site } = useSiteContact();
  const router = useRouter();
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Live product search suggestion query
  const trimmedSearch = searchQuery.trim();
  const { data: searchResultsData } = useQuery({
    queryKey: ['header-live-search', trimmedSearch],
    queryFn: () =>
      apiGet<{ products: Product[] }>('/products', {
        status: 'published',
        search: trimmedSearch,
        limit: 5,
      }),
    enabled: trimmedSearch.length >= 2,
    staleTime: 30_000,
  });

  const searchSuggestions = searchResultsData?.products || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus and search on route change
  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
    setSearchFocused(false);
  }, [pathname]);

  // Close dropdown and search suggestions on outside click
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <>
      {/* Top credibility bar */}
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
              className="flex items-center gap-1 font-semibold hover:text-orange-300 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Phone className="h-3.5 w-3.5" /> Call {site.phone}
            </motion.a>
            <motion.a
              href={`mailto:${site.email}?subject=${encodeURIComponent('Enquiry - Vinayak Enterprises')}`}
              className="flex items-center gap-1 hover:text-orange-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              title={site.email}
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{site.email}</span>
              <span className="md:hidden">Email</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Main clean navigation bar */}
      <motion.header
        className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200"
        animate={{ paddingTop: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="container mx-auto px-3 sm:px-4 h-16 md:h-18 flex items-center justify-between gap-2 sm:gap-4 lg:gap-5">
          {/* Brand Logo */}
          <SiteLogo variant="header" priority className="-ml-1 shrink-0" />

          {/* Clean Functional Search Box with Instant Live Suggestions */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-xs lg:max-w-sm relative">
            <form onSubmit={handleSearchSubmit}>
              <div
                className={`flex w-full items-center rounded-full border bg-slate-50/70 overflow-hidden transition-all duration-200 ${
                  searchFocused
                    ? 'border-[#1a3a6b] bg-white ring-2 ring-blue-100 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="search"
                  placeholder="Search microscopes, anatomy models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="flex-1 px-4 py-2 text-xs lg:text-sm bg-transparent outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="h-9 w-9 m-0.5 rounded-full bg-[#1a3a6b] text-white flex items-center justify-center hover:bg-[#15305a] transition-colors shrink-0"
                >
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </form>

            {/* Instant Live Search Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocused && trimmedSearch.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 text-left"
                >
                  {searchSuggestions.length > 0 ? (
                    <div className="py-2">
                      <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Matching Products ({searchSuggestions.length})
                      </div>
                      {searchSuggestions.map((prod) => (
                        <Link
                          key={prod._id}
                          href={`/products/${prod.slug}`}
                          onClick={() => setSearchFocused(false)}
                          className="flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                            {prod.images?.[0]?.url ? (
                              <Image
                                src={prod.images[0].url}
                                alt={prod.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-sm">🔬</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#1a3a6b] truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {prod.sku || 'VE-INSTRUMENT'}
                            </p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 mt-1 pt-1.5 px-3.5">
                        <Link
                          href={`/products?search=${encodeURIComponent(trimmedSearch)}`}
                          onClick={() => setSearchFocused(false)}
                          className="block text-xs font-semibold text-orange-600 hover:text-orange-700 py-1"
                        >
                          View all results for &ldquo;{trimmedSearch}&rdquo; →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 px-4 text-center text-xs text-slate-500">
                      No live matches for &ldquo;{trimmedSearch}&rdquo;. Press Enter to search full catalog.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clean, Spacious Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/' ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Home
            </Link>

            {/* Our Products Link & Dropdown */}
            <div
              ref={dropdownRef}
              className="relative flex items-center"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link
                href="/products"
                onClick={() => setProductsOpen(false)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  pathname.startsWith('/products') || pathname.startsWith('/categories') || productsOpen
                    ? 'text-orange-600 font-bold'
                    : 'text-slate-700 hover:text-orange-600'
                }`}
              >
                <span>Our Products</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${productsOpen ? 'rotate-180 text-orange-600' : 'text-slate-400'}`}
                />
              </Link>
              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-72 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50 mt-1"
                  >
                    <Link
                      href="/products"
                      onClick={() => setProductsOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 transition-colors border-b border-slate-100 mb-1"
                    >
                      <span>All Products (View All)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setProductsOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                    <Link
                      href="/products"
                      onClick={() => setProductsOpen(false)}
                      className="block px-4 py-2.5 text-xs font-bold text-orange-600 border-t border-slate-100 mt-1 hover:bg-orange-50 transition-colors"
                    >
                      Browse Complete Catalog →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/catalogues"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                pathname.startsWith('/catalogues') ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Catalogue
            </Link>

            <Link
              href="/videos"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                pathname.startsWith('/videos') ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Videos
            </Link>

            <Link
              href="/blog"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                pathname.startsWith('/blog') ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                pathname.startsWith('/about') ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                pathname.startsWith('/contact') ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/request-quote"
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg shadow-sm whitespace-nowrap transition-colors"
            >
              Get Quote
            </Link>

            {/* Mobile Hamburger Menu Toggle Button - ALWAYS visible and unclipped on mobile & tablet */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:text-orange-600 active:scale-95 transition-all shrink-0 shadow-sm"
              aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5 text-slate-900" /> : <Menu className="h-5 w-5 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer & Backdrop */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Tap to close backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 top-[64px] z-40 bg-black/50 backdrop-blur-xs lg:hidden"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative z-50 lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-2xl max-h-[82vh] overflow-y-auto"
              >
                {/* Mobile Search Input with Instant Enter Navigation */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-[#1a3a6b] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="search"
                      placeholder="Search microscopes, skeleton, models..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                    />
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Main Navigation Links */}
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      pathname === '/' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Home
                  </Link>

                  {/* Expandable Product Categories in Mobile Menu */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#1a3a6b]">
                      <Link
                        href="/products"
                        onClick={() => setMobileOpen(false)}
                        className="hover:text-orange-600 transition-colors"
                      >
                        Our Products
                      </Link>
                      <Link
                        href="/products"
                        onClick={() => setMobileOpen(false)}
                        className="text-orange-600 font-semibold normal-case text-xs hover:underline"
                      >
                        All Products →
                      </Link>
                    </div>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                          pathname === `/categories/${cat.slug}`
                            ? 'bg-white text-orange-600 font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-white hover:text-orange-600'
                        }`}
                      >
                        <span className="text-sm">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/catalogues"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      pathname.startsWith('/catalogues') ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Catalogue
                  </Link>

                  <Link
                    href="/videos"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      pathname.startsWith('/videos') ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Showcase Videos
                  </Link>

                  <Link
                    href="/blog"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      pathname.startsWith('/blog') ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Blog
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      pathname.startsWith('/about') ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    About Us
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      pathname.startsWith('/contact') ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Direct Call & WhatsApp Action Bar */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={whatsappChatUrl(site.phoneTel, 'Namaste Vinayak Enterprises! Mujhe scientific lab equipment ke baare me jaankari chahiye.')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>

                {/* Primary CTA */}
                <div>
                  <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl shadow-md">
                    <Link href="/request-quote" onClick={() => setMobileOpen(false)}>
                      Request Institutional Quote →
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

export default WebsiteHeader;
