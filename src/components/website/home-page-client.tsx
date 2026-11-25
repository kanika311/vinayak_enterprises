'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, CheckCircle2, ArrowRight, FileText, PhoneCall, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/website/product-card';
import { HeroBackground, useHeroBanners } from '@/components/website/hero-background';
import { staggerContainer, fadeUp } from '@/components/website/motion';
import { ProductMarquee } from '@/components/website/product-marquee';
import { StatsBar, WhyChooseUsSection } from '@/components/website/home-credibility';
import { HomeFAQSection } from '@/components/website/home-faq';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FALLBACK_PRODUCTS, FALLBACK_BLOGS } from '@/lib/fallback-data';
import type { Product, Blog, Category } from '@/types';

const VideoShowcaseSection = dynamic(
  () => import('@/components/website/video-showcase-section').then((m) => m.VideoShowcaseSection),
  { ssr: true }
);

const TestimonialsSection = dynamic(
  () => import('@/components/website/testimonials-section').then((m) => m.TestimonialsSection),
  { ssr: true }
);

export interface HomePageClientProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
  initialBlogs?: Blog[];
  initialTestimonials?: any[];
  initialVideos?: any[];
  initialBanners?: any[];
}

export function HomePageClient({
  initialProducts,
  initialCategories,
  initialBlogs,
  initialTestimonials,
  initialVideos,
  initialBanners,
}: HomePageClientProps = {}) {
  const { data: productsData } = useQuery({
    queryKey: ['products-public', 'homepage'],
    queryFn: () =>
      apiGet<{ products: Product[] }>('/products', {
        status: 'published',
        limit: 8,
        sortBy: 'createdAt',
        order: 'desc',
      }),
    initialData: initialProducts?.length ? { products: initialProducts } : undefined,
  });

  const { data: blogsData } = useQuery({
    queryKey: ['blogs-public', 'homepage'],
    queryFn: () => apiGet<{ blogs: Blog[] }>('/blogs', { status: 'published', limit: 8 }),
    initialData: initialBlogs?.length ? { blogs: initialBlogs } : undefined,
  });

  const { data: banners = [] } = useHeroBanners(initialBanners);
  const hasHeroVideo = banners.length > 0;

  const rawProducts = productsData?.products || [];
  const products = rawProducts.length > 0 ? rawProducts : (initialProducts?.length ? initialProducts : FALLBACK_PRODUCTS);
  const featured = products.slice(0, 8);

  const rawBlogs = blogsData?.blogs || [];
  const blogs = rawBlogs.length > 0 ? rawBlogs : (initialBlogs?.length ? initialBlogs : FALLBACK_BLOGS);

  // Horizontal auto-scroll controller for Blogs section (unique blogs, no repeat)
  const blogScrollRef = useRef<HTMLDivElement>(null);
  const [blogPaused, setBlogPaused] = useState(false);
  const [blogScrollDirection, setBlogScrollDirection] = useState<'forward' | 'backward'>('forward');
  const isBlogTransitioningRef = useRef(false);

  useEffect(() => {
    const container = blogScrollRef.current;
    if (!container || blogs.length <= 1) return;

    let rafId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!blogPaused && !isBlogTransitioningRef.current && container) {
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (maxScroll > 10) {
          const speed = 0.038 * delta;

          if (blogScrollDirection === 'forward') {
            container.scrollLeft += speed;
            if (container.scrollLeft >= maxScroll - 2) {
              isBlogTransitioningRef.current = true;
              setTimeout(() => {
                setBlogScrollDirection('backward');
                isBlogTransitioningRef.current = false;
              }, 2200);
            }
          } else {
            container.scrollLeft -= speed;
            if (container.scrollLeft <= 2) {
              isBlogTransitioningRef.current = true;
              setTimeout(() => {
                setBlogScrollDirection('forward');
                isBlogTransitioningRef.current = false;
              }, 2200);
            }
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [blogPaused, blogs.length, blogScrollDirection]);

  const handleBlogScroll = (dir: 'left' | 'right') => {
    const container = blogScrollRef.current;
    if (!container) return;
    setBlogPaused(true);
    const amount = 350;
    container.scrollBy({
      left: dir === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
    setTimeout(() => setBlogPaused(false), 2500);
  };

  return (
    <div className="bg-white">
      {/* 1. CRYSTAL CLEAR, MODERN HERO SECTION */}
      <section
        className={`relative overflow-hidden text-white flex flex-col justify-center ${
          hasHeroVideo
            ? 'min-h-[64vh] md:min-h-[72vh] bg-slate-950'
            : 'min-h-[58vh] bg-gradient-to-r from-[#1a3a6b] via-[#1e4a8a] to-[#2563eb]'
        }`}
        aria-label="Introduction Hero"
      >
        <HeroBackground initialBanners={initialBanners} />

        {hasHeroVideo && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/45 pointer-events-none z-[1]" />
        )}

        <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
          <div className="max-w-2xl lg:max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Trust Badge */}
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-1.5 bg-orange-500/95 text-white text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-sm border border-orange-400/40">
                  <ShieldCheck className="h-3.5 w-3.5" /> Direct Manufacturer · Ambala Cantt, India
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-extrabold tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-white drop-shadow-sm mb-4"
              >
                Precision Scientific Instruments &amp; Anatomical Models
              </motion.h1>

              {/* Understandable, Concise Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed mb-7 max-w-2xl"
              >
                Direct bulk institutional manufacturer of medical skeletons, human anatomy models, research microscopes, and hospital training apparatus supplied across India.
              </motion.p>

              {/* Clean Action Buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/products"
                  className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 text-sm sm:text-base inline-flex items-center gap-2 group"
                >
                  Explore Products <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/request-quote"
                  className="bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/30 font-semibold px-6 py-3 rounded-xl backdrop-blur-md transition-all duration-200 text-sm sm:text-base inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-orange-400" /> Request Quote
                </Link>
              </motion.div>

              {/* 3 Quick Value Highlights */}
              <motion.div
                variants={fadeUp}
                className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Factory Direct Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Medical Grade Accuracy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Pan-India GST Supply</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <StatsBar />

      {/* 3. VISUAL PRODUCT MARQUEE STRIP */}
      {products.length > 0 && (
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 overflow-hidden">
          <ProductMarquee products={products.slice(0, 12)} />
        </div>
      )}

      {/* 4. FEATURED PRODUCTS (Clean, Single Centered Headline) */}
      <section className="py-14 md:py-18 bg-white" aria-labelledby="featured-products-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2
              id="featured-products-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a3a6b] tracking-tight"
            >
              Products
            </h2>
            <div className="mt-2.5">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-orange-600 hover:text-orange-700 transition-colors"
              >
                View All Products <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {featured.length === 0 ? (
            <p className="text-center text-slate-500 py-12">Products loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#15305a] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-colors text-sm sm:text-base"
            >
              Get Custom Quote for School / College / Lab <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. VIDEO DEMONSTRATIONS (Lazy poster, instant load) */}
      <VideoShowcaseSection isHomepage initialVideos={initialVideos} />

      {/* 6. WHY CHOOSE US CREDIBILITY */}
      <WhyChooseUsSection />

      {/* 7. TECHNICAL KNOWLEDGE & BLOG */}
      <section className="py-14 md:py-18 bg-slate-50 border-t border-slate-200 overflow-hidden" aria-labelledby="blog-heading">
        <div className="container mx-auto px-4">
          {/* Header with single centered "Blogs" heading */}
          <div className="text-center mb-6">
            <h2 id="blog-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a3a6b] tracking-tight">
              Blogs
            </h2>

            <div className="mt-2.5 flex items-center justify-center gap-4">
              {/* Manual Left/Right Scroll Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleBlogScroll('left')}
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Previous blog"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleBlogScroll('right')}
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Next blog"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* View All Blogs Button */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 bg-[#1a3a6b] hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all group"
              >
                <span>View All Blogs</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Horizontal Scrolling Track for Blogs (No repeat, unique cards) */}
          {blogs.length > 0 && (
            <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
              <div
                ref={blogScrollRef}
                onMouseEnter={() => setBlogPaused(true)}
                onMouseLeave={() => setBlogPaused(false)}
                onTouchStart={() => setBlogPaused(true)}
                onTouchEnd={() => {
                  setTimeout(() => setBlogPaused(false), 2500);
                }}
                className="flex gap-5 overflow-x-auto scrollbar-none py-3 scroll-smooth select-none cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {blogs.map((blog, idx) => (
                  <div
                    key={blog._id || idx}
                    className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0"
                  >
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="aspect-[16/10] bg-slate-50 flex items-center justify-center overflow-hidden relative">
                        {blog.featuredImage?.url ? (
                          <Image
                            src={blog.featuredImage.url}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <span className="text-5xl">📖</span>
                        )}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="bg-[#1a3a6b] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            Lab Guide
                          </span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-[#1a3a6b] line-clamp-2 leading-snug text-sm sm:text-base">
                            {blog.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {blog.excerpt || blog.content.slice(0, 100)}
                          </p>
                        </div>
                        <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                          <span className="font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                            Read Guide →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>
      </section>

      {/* 8. TESTIMONIALS & CLIENT EXPERIENCES */}
      <TestimonialsSection initialTestimonials={initialTestimonials} />

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <HomeFAQSection />

      {/* 10. CLEAN, STRUCTURED INSTITUTIONAL QUOTE CTA */}
      <section className="py-14 bg-gradient-to-r from-[#1a3a6b] to-[#122b52] text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
            Need Bulk Institutional Pricing or Government Tender Support?
          </h2>
          {/* <p className="text-slate-200 mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Send us your apparatus list or requirements. We provide itemized GST quotations, product datasheets, and tender compliance documentation.
          </p> */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/request-quote"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-xl shadow-md transition-colors text-sm sm:text-base"
            >
              Request Bulk Quote
            </Link>
            <Link
              href="/catalogues"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-7 py-3 rounded-xl backdrop-blur-sm transition-colors text-sm sm:text-base"
            >
              Download PDF Catalog
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-7 py-3 rounded-xl backdrop-blur-sm transition-colors text-sm sm:text-base inline-flex items-center gap-1.5"
            >
              <PhoneCall className="h-4 w-4" /> Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePageClient;
