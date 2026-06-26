'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CategoryGrid } from '@/components/website/category-grid';
import { ProductCard } from '@/components/website/product-card';
import { WelcomeSection, BusinessTrustBar } from '@/components/website/business-section';
import { HeroBackground } from '@/components/website/hero-background';
import { AnimatedButton, PulseCTA } from '@/components/website/animated-button';
import { AnimatedHeading, staggerContainer, fadeUp, slideInRight } from '@/components/website/motion';
import { ProductMarquee } from '@/components/website/product-marquee';
import { ManufacturingSection } from '@/components/website/manufacturing-section';
import { Carousel } from '@/components/website/carousel';
import { TestimonialsSection } from '@/components/website/testimonials-section';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { SITE } from '@/lib/constants';
import type { Product, Blog } from '@/types';

export default function HomePage() {
  const { data: productsData } = useQuery({
    queryKey: ['products-public', 'homepage'],
    queryFn: () => apiGet<{ products: Product[] }>('/products', { status: 'published', limit: 12, sortBy: 'createdAt', order: 'desc' }),
  });

  const { data: blogsData } = useQuery({
    queryKey: ['blogs-public', 'homepage'],
    queryFn: () => apiGet<{ blogs: Blog[] }>('/blogs', { status: 'published', limit: 3 }),
  });

  const products = productsData?.products || [];
  const featured = products.slice(0, 12);
  const latest = products.slice(0, 4);
  const blogs = blogsData?.blogs || [];

  return (
    <>
      <section className="relative bg-gradient-to-r from-[#1a3a6b] via-[#1e4a8a] to-[#2563eb] text-white overflow-hidden">
        <HeroBackground />
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.span variants={fadeUp} className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 shadow-lg shadow-orange-500/40">
                MANUFACTURER · BULK SUPPLIER · DISTRIBUTOR
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {SITE.name}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-blue-100 text-lg mb-8 leading-relaxed">
                Scientific Instruments, Laboratory Equipment, Human Anatomy Models, Educational Teaching Aids
                &amp; Medical Training Products — manufactured and supplied across India from {SITE.location}.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <PulseCTA href="/products">View All Products</PulseCTA>
                <AnimatedButton href="/request-quote" variant="outline">Get Quote</AnimatedButton>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="hidden lg:grid grid-cols-2 gap-3">
              {latest.map((p, i) => (
                <motion.div key={p._id} variants={slideInRight} custom={i}>
                  <Link href={`/products/${p.slug}`}>
                    <motion.div
                      className={`bg-white/10 backdrop-blur-md border border-white/25 rounded-xl p-4 cursor-pointer ${i === 0 ? 'col-span-2' : ''}`}
                      whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(251,146,60,0.6)', y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="font-semibold text-sm line-clamp-2">{p.name}</p>
                      <p className="text-orange-300 font-bold mt-1 text-sm">Get Quote →</p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        {products.length > 0 && <ProductMarquee products={products.slice(0, 6)} />}
      </section>

      <CategoryGrid />

      <section className="py-10 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex items-end justify-between mb-6 gap-4">
            <AnimatedHeading title="Our Products" subtitle="Latest from our catalogue — request a quote for pricing" />
            <motion.div variants={fadeUp} className="hidden sm:block shrink-0">
              <Link href="/products" className="text-[#1a3a6b] font-semibold text-sm hover:text-orange-600 flex items-center gap-1">View Complete Range →</Link>
            </motion.div>
          </motion.div>

          {featured.length === 0 ? (
            <p className="text-center text-slate-500 py-12">Products coming soon. Add products from the admin console.</p>
          ) : (
            <Carousel itemClassName="w-[72%] sm:w-[44%] lg:w-[23.5%]">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Carousel>
          )}

          <motion.div className="text-center mt-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <AnimatedButton href="/request-quote" variant="green" className="px-10">Get Quote for Bulk Order</AnimatedButton>
          </motion.div>
        </div>
      </section>

      <ManufacturingSection />

      <section className="py-10 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a6b]">Latest from the Blog</h2>
              <p className="text-slate-500 mt-1 text-sm">News and insights from scientific education</p>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-orange-600 hover:text-orange-700 shrink-0">View All →</Link>
          </div>
          {blogs.length > 0 ? (
            <Carousel itemClassName="w-[80%] sm:w-[48%] lg:w-[32%]">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog.slug}`} className="group block h-full bg-white rounded-xl border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center overflow-hidden">
                    {blog.featuredImage?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={blog.featuredImage.url} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="text-5xl">📝</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{blog.excerpt || blog.content.slice(0, 100)}</p>
                    <p className="text-xs text-slate-400 mt-3">{formatDate(blog.publishedAt || blog.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </Carousel>
          ) : (
            <div className="rounded-xl border border-dashed bg-white px-6 py-10 text-center">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-slate-500 text-sm">Articles published from the admin panel appear here.</p>
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />

      <WelcomeSection />
      <BusinessTrustBar />

      <section className="relative py-12 bg-[#1a3a6b] text-white overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 className="text-2xl md:text-3xl font-bold mb-3">Get in Touch With Us for Best Deals</motion.h2>
          <motion.p className="text-blue-200 mb-8 max-w-xl mx-auto">Bulk manufacturing, institutional supply &amp; distribution for schools, colleges, hospitals &amp; laboratories.</motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatedButton href="/contact" variant="primary">Contact Us</AnimatedButton>
            <AnimatedButton href="/catalogues" variant="outline">Download Catalogue</AnimatedButton>
          </div>
        </div>
      </section>
    </>
  );
}
