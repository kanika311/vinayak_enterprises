'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FEATURED_PRODUCTS, PRODUCT_CATEGORIES } from '@/lib/constants';
import { CategoryGrid } from '@/components/website/category-grid';
import { ProductQuoteCard } from '@/components/website/product-quote-card';
import { WelcomeSection, BusinessTrustBar } from '@/components/website/business-section';
import { HeroBackground } from '@/components/website/hero-background';
import { AnimatedButton, PulseCTA } from '@/components/website/animated-button';
import { AnimatedHeading, staggerContainer, fadeUp, slideInRight, popIn } from '@/components/website/motion';
import { ProductMarquee } from '@/components/website/product-marquee';

export default function HomePage() {
  const showcaseProducts = FEATURED_PRODUCTS;

  const categorySections = PRODUCT_CATEGORIES.slice(0, 4).map((cat) => ({
    ...cat,
    products: showcaseProducts.filter((p) => p.categorySlug === cat.slug).slice(0, 5),
  })).filter((s) => s.products.length > 0);

  const defaultSection = categorySections.length === 0 ? [{
    ...PRODUCT_CATEGORIES[0],
    products: showcaseProducts.slice(0, 5),
  }] : categorySections;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#1a3a6b] via-[#1e4a8a] to-[#2563eb] text-white overflow-hidden">
        <HeroBackground />
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.span
                variants={popIn}
                className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 shadow-lg shadow-orange-500/40"
              >
                WHOLESALE · DEALER · INSTITUTION
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Laboratory &amp; Scientific Instruments at Best Prices
              </motion.h1>
              <motion.p variants={fadeUp} className="text-blue-100 text-lg mb-8 leading-relaxed">
                Chemistry lab instruments, microscopes, anatomy models, physics equipment &amp; educational teaching aids — supplied across India.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <PulseCTA href="/products">View All Products</PulseCTA>
                <AnimatedButton href="/request-quote" variant="outline">Get Quote</AnimatedButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {showcaseProducts.slice(0, 4).map((p, i) => (
                <motion.div key={p._id} variants={slideInRight} custom={i}>
                  <Link href={`/products/${p.slug}`}>
                    <motion.div
                      className={`bg-white/10 backdrop-blur-md border border-white/25 rounded-xl p-4 cursor-pointer ${i === 0 ? 'col-span-2' : ''}`}
                      whileHover={{
                        scale: 1.04,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderColor: 'rgba(251,146,60,0.6)',
                        y: -4,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <p className="font-semibold text-sm line-clamp-2">{p.name}</p>
                      <motion.p
                        className="text-orange-300 font-bold mt-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        ₹ {p.price}{p.unit}
                      </motion.p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scrolling ticker */}
        <ProductMarquee products={showcaseProducts.slice(0, 6)} />
      </section>

      <CategoryGrid />

      {/* Featured products */}
      <section className="py-14 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex items-center justify-between mb-10 gap-4"
          >
            <AnimatedHeading title="Our Products" subtitle="Browse our complete range — prices shown are indicative" />
            <motion.div variants={fadeUp} className="hidden sm:block">
              <Link href="/products" className="text-[#1a3a6b] font-semibold text-sm hover:text-orange-600 flex items-center gap-1 group">
                View Complete Range
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {showcaseProducts.slice(0, 8).map((product, i) => (
              <ProductQuoteCard key={product._id} product={product} index={i} />
            ))}
          </div>

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

      <WelcomeSection />
      <BusinessTrustBar />

      {/* Category sections */}
      {defaultSection.map((section, sIdx) => (
        <motion.section
          key={section.slug}
          className="py-12 bg-slate-50 even:bg-white overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex items-center justify-between mb-8 pb-3 border-b-2 border-[#1a3a6b]"
            >
              <motion.h2 variants={fadeUp} className="text-xl md:text-2xl font-bold text-[#1a3a6b] flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: sIdx * 0.5 }}
                  className="text-3xl"
                >
                  {section.icon}
                </motion.span>
                {section.name}
              </motion.h2>
              <motion.div variants={fadeUp} whileHover={{ x: 4 }}>
                <Link href={`/categories/${section.slug}`} className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                  View All →
                </Link>
              </motion.div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {section.products.map((product, i) => (
                <ProductQuoteCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        </motion.section>
      ))}

      {/* CTA */}
      <section className="relative py-16 bg-[#1a3a6b] text-white overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.15), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-3">
              Get in Touch With Us for Best Deals
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200 mb-8 max-w-xl mx-auto">
              Contact us for wholesale pricing, dealer enquiries &amp; institutional bulk orders.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <AnimatedButton href="/contact" variant="primary">Contact Us</AnimatedButton>
              <AnimatedButton href="/catalogues" variant="outline">Download Catalogue</AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
