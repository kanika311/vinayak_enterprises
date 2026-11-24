'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Layers, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/website/product-card';
import { apiGet } from '@/lib/api';
import { fadeUp, staggerContainer } from '@/components/website/motion';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data';
import type { Product, Category } from '@/types';

interface ProductsClientProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
}

function ProductsClientContent({
  initialProducts = [],
  initialCategories = [],
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const urlSearch = searchParams?.get('search') || '';
  const urlCategory = searchParams?.get('category') || '';

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);

  // Synchronize when URL search parameters change
  useEffect(() => {
    const s = searchParams?.get('search') || '';
    const c = searchParams?.get('category') || '';
    setSearch(s);
    setCategory(c);
  }, [searchParams]);

  const { data: categories = initialCategories } = useQuery({
    queryKey: ['categories-public-with-products'],
    queryFn: () => apiGet<Category[]>('/categories', { active: true, hasProducts: true }),
    initialData: initialCategories,
  });

  const categoryList =
    categories && categories.length > 0
      ? categories
      : PRODUCT_CATEGORIES.map((c) => ({
          _id: c.slug,
          name: c.name,
          slug: c.slug,
          isActive: true,
          order: 0,
          subcategories: [],
        }));

  const { data, isLoading } = useQuery({
    queryKey: ['products-public', search, category],
    queryFn: () =>
      apiGet<{ products: Product[] }>('/products', {
        status: 'published',
        limit: 48,
        search: search.trim(),
        category,
      }),
  });

  // Base pool for instant fallback filtering
  const allPool = initialProducts && initialProducts.length > 0 ? initialProducts : FALLBACK_PRODUCTS;

  let displayProducts: Product[] = [];
  if (data?.products && data.products.length > 0) {
    displayProducts = data.products;
  } else if (search.trim() || category) {
    const term = search.trim().toLowerCase();
    displayProducts = allPool.filter((p) => {
      const matchSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(term)) ||
        (p.longDescription && p.longDescription.toLowerCase().includes(term)) ||
        (p.sku && p.sku.toLowerCase().includes(term)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(term));

      const catId = typeof p.category === 'object' && p.category !== null ? (p.category as any)._id : p.category;
      const catSlug = typeof p.category === 'object' && p.category !== null ? (p.category as any).slug : '';
      const matchCat = !category || catId === category || catSlug === category;

      return matchSearch && matchCat;
    });
  } else {
    displayProducts = allPool;
  }

  const activeCategoryDoc = categoryList.find((c) => c._id === category || c.slug === category);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Clean, spacious breadcrumb banner */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b] tracking-tight">
                {activeCategoryDoc ? activeCategoryDoc.name : 'Scientific Equipment & Anatomy Models'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Direct manufacturer &amp; bulk supplier catalogue · Ambala Cantt, India
              </p>
            </div>
            <div className="text-sm text-slate-500">
              Showing <strong className="text-slate-900">{displayProducts.length}</strong> products
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#1a3a6b]">
                <Layers className="h-4 w-4" />
                <h3 className="font-bold text-sm tracking-wide uppercase">Categories</h3>
              </div>

              <button
                onClick={() => setCategory('')}
                className={`block w-full text-left px-3.5 py-2.5 rounded-lg text-sm mb-1.5 transition-all font-medium ${
                  !category
                    ? 'bg-[#1a3a6b] text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                All Products ({allPool.length})
              </button>

              <div className="space-y-1">
                {categoryList.map((cat) => {
                  const isSelected = category === cat._id || category === cat.slug;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => setCategory(cat._id)}
                      className={`block w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                        isSelected
                          ? 'bg-[#1a3a6b] text-white shadow-sm font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Search Input Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search by name, model, SKU (e.g. microscope, skeleton, heart)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {(search || category) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                  }}
                  className="text-xs font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 px-3 py-2.5 rounded-xl transition-colors shrink-0"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Results active state label */}
            {search && (
              <div className="mb-4 text-sm text-slate-600 flex items-center justify-between">
                <span>
                  Search results for: <strong className="text-slate-900">&ldquo;{search}&rdquo;</strong> ({displayProducts.length} found)
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {isLoading && displayProducts.length === 0 ? (
                <div key="loading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-slate-200 h-80 animate-pulse"
                    />
                  ))}
                </div>
              ) : displayProducts.length === 0 ? (
                <div
                  key="empty"
                  className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
                >
                  <p className="text-5xl mb-4">🔬</p>
                  <h3 className="text-lg font-bold text-slate-800">No products match your search</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    We could not find anything matching &ldquo;{search}&rdquo;. Try another term or view all categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setCategory('');
                    }}
                    className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1a3a6b] text-white text-sm font-semibold hover:bg-[#15305a] transition-colors"
                  >
                    View All Products <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <motion.div
                  key="products"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayProducts.map((p, i) => (
                    <motion.div key={p._id} variants={fadeUp} custom={i}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsClient(props: ProductsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
          Loading catalog...
        </div>
      }
    >
      <ProductsClientContent {...props} />
    </Suspense>
  );
}
