'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/website/product-card';
import { apiGet } from '@/lib/api';
import { getCategoryStyle } from '@/lib/category-styles';
import { fadeUp, staggerContainer } from '@/components/website/motion';
import { AnimatedButton } from '@/components/website/animated-button';
import type { Category, Product } from '@/types';

export function CategoryDetailClient({
  slug,
  initialCategory,
  initialProducts,
}: {
  slug: string;
  initialCategory?: Category | null;
  initialProducts?: Product[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 9;

  const { data: category = initialCategory, isLoading: catLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => apiGet<Category>(`/categories/slug/${slug}`),
    initialData: initialCategory || undefined,
  });

  const { data: productsData, isLoading: prodLoading } = useQuery({
    queryKey: ['products-public', 'category', category?._id],
    queryFn: () =>
      apiGet<{ products: Product[] }>('/products', {
        status: 'published',
        category: category!._id,
        limit: 100,
      }),
    enabled: !!category?._id,
    initialData: initialProducts?.length ? { products: initialProducts } : undefined,
  });

  const style = getCategoryStyle(slug);
  const products = productsData?.products || [];
  const isLoading = catLoading || prodLoading;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, products.length);
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#1a3a6b] text-white overflow-hidden relative">
        <div className="container mx-auto px-4 py-10 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp}>
              <Link href="/categories" className="text-blue-200 text-sm hover:text-white mb-2 inline-block">
                ← All Categories
              </Link>
            </motion.div>
            <motion.span variants={fadeUp} className="text-5xl block mb-3">
              {style.icon}
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-3xl font-bold">
              {category?.name || slug.replace(/-/g, ' ')}
            </motion.h1>
            {category?.description && (
              <motion.p variants={fadeUp} className="text-blue-200 mt-2 max-w-2xl">
                {category.description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10" ref={gridRef}>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-white rounded-xl border animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg">No products currently listed in this category.</p>
            <p className="text-sm text-slate-400 mt-1">Contact us for custom manufacturing or institutional requests.</p>
            <div className="mt-6">
              <AnimatedButton href="/request-quote" variant="green">
                Request a Custom Quote
              </AnimatedButton>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-xs sm:text-sm text-slate-500">
              Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{products.length}</strong> products
            </div>
            <motion.div
              key={`category-products-${safeCurrentPage}`}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {paginatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-slate-500">
                  Page {safeCurrentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-2xs"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[36px] h-9 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                          isActive
                            ? 'bg-[#1a3a6b] text-white shadow-md'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-2xs"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
