'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/website/product-card';
import { WelcomeSection, BusinessTrustBar } from '@/components/website/business-section';
import { HeroBackground, useHeroBanners } from '@/components/website/hero-background';
import { AnimatedButton, PulseCTA } from '@/components/website/animated-button';
import { AnimatedHeading, staggerContainer, fadeUp, slideInRight } from '@/components/website/motion';
import { ProductMarquee } from '@/components/website/product-marquee';
import { StatsBar, WhyChooseUsSection } from '@/components/website/home-credibility';
import { HomeFAQSection } from '@/components/website/home-faq';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { SITE } from '@/lib/constants';
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
}

export function HomePageClient({
  initialProducts,
  initialCategories,
  initialBlogs,
  initialTestimonials,
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
    queryFn: () => apiGet<{ blogs: Blog[] }>('/blogs', { status: 'published', limit: 3 }),
    initialData: initialBlogs?.length ? { blogs: initialBlogs } : undefined,
  });

  const { data: banners = [] } = useHeroBanners();
  const hasHeroVideo = banners.length > 0;

  const rawProducts = productsData?.products || [];
  const products = rawProducts.length > 0 ? rawProducts : (initialProducts?.length ? initialProducts : FALLBACK_PRODUCTS);
  const featured = products.slice(0, 8);
  const latest = products.slice(0, 4);

  const rawBlogs = blogsData?.blogs || [];
  const blogs = rawBlogs.length > 0 ? rawBlogs : (initialBlogs?.length ? initialBlogs : FALLBACK_BLOGS);

  return (
    <>
      <section
        className={`relative overflow-hidden text-white ${
          hasHeroVideo
            ? 'min-h-[70vh] md:min-h-[82vh] flex flex-col bg-black'
            : 'bg-gradient-to-r from-[#1a3a6b] via-[#1e4a8a] to-[#2563eb]'
        }`}
        aria-label="Hero"
      >
        <HeroBackground />

        {hasHeroVideo && (
          <>
            {/* Rich gradient overlay so text has high contrast and is readable over bright video */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/35 pointer-events-none z-[1]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none z-[1]" />
          </>
        )}

        <div
          className={`container mx-auto px-4 relative z-10 flex-1 flex items-end md:items-center ${
            hasHeroVideo ? 'py-14 md:py-20' : 'py-12 md:py-20'
          }`}
        >
          <div className={`w-full ${hasHeroVideo ? 'max-w-2xl lg:max-w-3xl' : 'grid lg:grid-cols-2 gap-10 items-center'}`}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className={hasHeroVideo ? 'drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]' : ''}
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3.5 shadow-md border border-orange-400/30"
              >
                MANUFACTURER · BULK SUPPLIER · AMBALA
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="font-extrabold tracking-tight leading-tight mb-3 sm:mb-4 text-white"
              >
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
                  Vinayak Enterprises
                </span>
                <span className="block text-base sm:text-lg md:text-xl font-semibold text-orange-400 mt-2 sm:mt-2.5 leading-snug drop-shadow-sm">
                  Scientific Instruments, Laboratory Equipment &amp; Anatomy Models Manufacturer in Ambala
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className={`mb-6 leading-relaxed ${
                  hasHeroVideo ? 'text-white/90 text-sm sm:text-base md:text-lg max-w-xl' : 'text-blue-100 text-base md:text-lg max-w-xl'
                }`}
              >
                Direct manufacturer &amp; bulk institutional supplier of precision scientific instruments, hospital training manikins, and educational lab apparatus across India.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                <PulseCTA href="/products">View Products</PulseCTA>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  <Link
                    href="/request-quote"
                    className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                      hasHeroVideo
                        ? 'border-white bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-slate-900 shadow-sm'
                        : 'border-white/70 text-white hover:bg-white/15'
                    }`}
                  >
                    Get Quote
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/catalogues"
                    className={`inline-flex items-center gap-2 font-semibold px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                      hasHeroVideo
                        ? 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-md border border-white/20'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Catalogue
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {!hasHeroVideo && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="hidden lg:grid grid-cols-2 gap-3"
              >
                {latest.map((p, i) => (
                  <motion.div key={p._id} variants={slideInRight} custom={i}>
                    <Link href={`/products/${p.slug}`}>
                      <motion.div
                        className="bg-white/10 backdrop-blur-md border border-white/25 rounded-xl p-4 cursor-pointer"
                        whileHover={{
                          scale: 1.04,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderColor: 'rgba(251,146,60,0.6)',
                          y: -4,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <p className="font-semibold text-sm line-clamp-2">{p.name}</p>
                        <p className="text-orange-300 font-bold mt-1 text-sm">Get Quote →</p>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {products.length > 0 && <ProductMarquee products={products.slice(0, 6)} />}
      </section>

      <StatsBar />

      <section className="py-14 bg-white overflow-hidden" aria-labelledby="products-heading">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex items-end justify-between mb-8 gap-4"
          >
            <AnimatedHeading
              title="Featured Laboratory Equipment & Scientific Instruments"
              subtitle="Microscopes, anatomy models, CPR manikins & laboratory equipment — request a quote for institutional bulk supply"
            />
            <motion.div variants={fadeUp} className="hidden sm:block shrink-0">
              <Link
                href="/products"
                className="text-[#1a3a6b] font-semibold text-sm hover:text-orange-600 flex items-center gap-1"
              >
                View Complete Range →
              </Link>
            </motion.div>
          </motion.div>

          {featured.length === 0 ? (
            <p className="text-center text-slate-500 py-12">Products coming soon. Add products from the admin console.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AnimatedButton href="/request-quote" variant="green" className="px-10">
              Get Quote for Bulk Order
            </AnimatedButton>
          </motion.div>
        </div>
      </section>

      <VideoShowcaseSection />
      <WhyChooseUsSection />

      <section className="py-14 bg-white overflow-hidden" aria-labelledby="blog-heading">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 id="blog-heading" className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Latest from the Science Education &amp; Lab Equipment Blog
              </h2>
              <p className="text-slate-600 mt-1.5 text-sm">
                Guides on anatomy models, laboratory equipment and science education
              </p>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-orange-600 hover:text-orange-700 shrink-0">
              View All →
            </Link>
          </div>
          {blogs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group flex flex-col h-full bg-[#f7f5f2] rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-white flex items-center justify-center overflow-hidden relative">
                    {blog.featuredImage?.url ? (
                      <Image
                        src={blog.featuredImage.url}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="text-5xl">📝</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-[#1a3a6b] line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 flex-1">
                      {blog.excerpt || blog.content.slice(0, 100)}
                    </p>
                    <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-200/80">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#f7f5f2] px-6 py-10 text-center">
              <p className="text-slate-500 text-sm">Articles published from the admin panel appear here.</p>
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection initialTestimonials={initialTestimonials} />
      <HomeFAQSection />
      <WelcomeSection />
      <BusinessTrustBar />

      <section className="relative py-16 overflow-hidden" aria-labelledby="cta-heading">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#2a4a7a_0%,_#152a4a_45%,_#0f1f35_100%)]"
          aria-hidden
        />
        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <motion.h2
            id="cta-heading"
            className="text-2xl md:text-3xl font-bold mb-3 tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready for institutional supply &amp; bulk pricing?
          </motion.h2>
          <motion.p
            className="text-slate-300 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Share your requirement list — we respond with competitive quotations for schools, colleges, hospitals and
            laboratories across India.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatedButton href="/request-quote" variant="primary">
              Request a Quote
            </AnimatedButton>
            <AnimatedButton href="/catalogues" variant="outline">
              Download Catalogue
            </AnimatedButton>
            <AnimatedButton href="/contact" variant="outline">
              Contact Us
            </AnimatedButton>
          </div>
        </div>
      </section>
    </>
  );
}
