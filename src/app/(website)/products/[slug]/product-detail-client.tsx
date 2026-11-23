'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';
import { getWebpImageUrl } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductDetailClient({ slug, initialProduct }: { slug: string; initialProduct?: Product | null }) {
  const { site } = useSiteContact();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: product = initialProduct, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiGet<Product>(`/products/slug/${slug}`),
    initialData: initialProduct || undefined,
  });

  if (isLoading && !product) {
    return <div className="container mx-auto px-4 py-20 text-center text-slate-500">Loading product details...</div>;
  }
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-4 text-sm">The product you are looking for may have been updated or removed.</p>
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : '';
  const categorySlug = typeof product.category === 'object' ? product.category.slug : '';

  const singleOrderWhatsAppMessage = `Namaste Vinayak Enterprises! Mujhe single piece order / jaankari chahiye:\n- Product: ${product.name}\n- SKU: ${product.sku}${product.price ? `\n- Price: ₹${product.price} / ${product.priceUnit || 'Piece'}` : ''}\nKripya delivery aur order confirmation process batayein.`;

  const bulkOrderWhatsAppMessage = `Namaste Vinayak Enterprises! Mujhe bulk / institutional supply ke liye quote chahiye:\n- Product: ${product.name}\n- SKU: ${product.sku}\nKripya quantity discount aur wholesale quotation provide karein.`;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[activeImageIndex] || images[0];

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          {categoryName && (
            <>
              <span>/</span>
              <Link href={`/categories/${categorySlug}`} className="hover:text-blue-600">
                {categoryName}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 bg-white rounded-2xl border p-6 lg:p-10 shadow-sm">
          <div>
            <div
              className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden relative group cursor-pointer border border-slate-200"
              onClick={() => images.length > 0 && setIsLightboxOpen(true)}
              title="Click to view fullscreen photo"
            >
              {currentImage?.url ? (
                <>
                  <Image
                    key={currentImage.url}
                    src={getWebpImageUrl(currentImage.url, 900)}
                    alt={currentImage.alt || `${product.name} - view ${activeImageIndex + 1} by Vinayak Enterprises`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    unoptimized={currentImage.url.startsWith('/uploads/')}
                  />

                  {/* Click to Zoom indicator */}
                  <div className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm transition-opacity opacity-80 group-hover:opacity-100 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to zoom</span>
                  </div>

                  {/* Photo count indicator */}
                  {images.length > 1 && (
                    <div className="absolute top-3 left-3 bg-slate-900/70 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                      {activeImageIndex + 1} / {images.length} Photos
                    </div>
                  )}

                  {/* Left / Right arrows on main image */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        aria-label="Previous photo"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="Next photo"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-8xl" aria-label="Product thumbnail placeholder">
                  🔬
                </div>
              )}
            </div>

            {/* Thumbnails below */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-3.5 overflow-x-auto pb-1 items-center">
                {images.map((img, i) => (
                  <button
                    key={`${img.url}-${i}`}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg border-2 bg-slate-50 overflow-hidden transition-all duration-200 cursor-pointer ${
                      activeImageIndex === i
                        ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105 shadow-sm'
                        : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <Image
                      src={getWebpImageUrl(img.url, 160)}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                      unoptimized={img.url.startsWith('/uploads/')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {categoryName && (
              <Link href={`/categories/${categorySlug}`} className="text-sm text-blue-600 font-semibold hover:underline">
                {categoryName}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 leading-tight">{product.name}</h1>
            <p className="text-sm text-slate-400 mt-1">SKU: <span className="font-mono">{product.sku}</span></p>
            <p className="text-slate-600 mt-4 leading-relaxed">{product.shortDescription}</p>

            {/* Pricing Section */}
            {product.price ? (
              <div className="mt-5 p-5 bg-gradient-to-br from-blue-50/70 via-white to-amber-50/40 rounded-2xl border border-blue-200/80 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Single Piece Price
                  </span>
                  <span className="text-xs text-slate-500">Retail / Sample Order</span>
                </div>

                <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#1a3a6b]">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    / {product.priceUnit || 'Piece'}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <span className="text-lg text-slate-400 line-through">
                        ₹{Number(product.mrp).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  * Single unit price inclusive of standard taxes &amp; packaging.
                </p>

                {/* Bulk Order Callout Banner */}
                <div className="mt-4 pt-4 border-t border-blue-200/70 bg-white/90 rounded-xl p-4 border border-blue-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0">
                        📦
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            Bulk / Institutional Orders?
                          </h4>
                          <span className="text-[10px] uppercase font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                            Wholesale Rates
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Bulk orders ke liye special discount aur custom quotes ke liye humse contact karein.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <Button asChild size="sm" className="bg-[#1a3a6b] hover:bg-[#12284c] text-white">
                        <Link href={`/request-quote?product=${product._id}`}>
                          Request Bulk Quote
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50">
                        <a href={whatsappChatUrl(site.whatsapp, bulkOrderWhatsAppMessage)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-3.5 w-3.5 mr-1 text-green-600" /> WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xl font-bold text-slate-800">Price on Request</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Single unit ya bulk institutional order ke rates ke liye humse contact karein.
                    </p>
                  </div>
                  <Button asChild className="bg-[#1a3a6b] hover:bg-[#12284c] text-white">
                    <Link href={`/request-quote?product=${product._id}`}>Request Quote</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <a href={whatsappChatUrl(site.whatsapp, singleOrderWhatsAppMessage)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" /> Order / Inquire on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/request-quote?product=${product._id}`}>Request Quote</Link>
              </Button>
              <Button asChild variant="ghost" className="text-slate-600">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>

            {product.features?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-slate-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {product.longDescription && (
          <div className="mt-8 bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Product Overview &amp; Applications</h2>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line">{product.longDescription}</div>
          </div>
        )}

        {product.specifications?.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Technical Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec) => (
                    <tr key={spec.key} className="border-b last:border-0">
                      <td className="py-3 font-medium text-slate-700 w-1/3">{spec.key}</td>
                      <td className="py-3 text-slate-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {product.faq?.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-amber-500 shrink-0" />
              Frequently Asked Questions (FAQs)
            </h2>
            <div className="space-y-4">
              {product.faq.map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
                  <h3 className="font-semibold text-slate-900 text-base mb-2 flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">Q:</span>
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed pl-6">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.brochure?.url && (
          <div className="mt-6">
            <Button asChild variant="outline">
              <a href={product.brochure.url} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" /> Download Product Brochure (PDF)
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between text-white max-w-6xl mx-auto w-full z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm sm:text-base truncate max-w-md">{product.name}</span>
              {images.length > 1 && (
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono">
                  {activeImageIndex + 1} / {images.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image */}
          <div
            className="relative flex-1 flex items-center justify-center my-2 max-w-5xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full h-[70vh] max-h-[800px]">
              <Image
                src={getWebpImageUrl(currentImage.url, 1400)}
                alt={currentImage.alt || product.name}
                fill
                priority
                sizes="95vw"
                className="object-contain"
                unoptimized={currentImage.url.startsWith('/uploads/')}
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next photo"
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all hover:scale-110 cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnails row at bottom of lightbox */}
          {images.length > 1 && (
            <div
              className="flex gap-2 justify-center overflow-x-auto max-w-4xl mx-auto w-full py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={`${img.url}-lightbox-${i}`}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                    activeImageIndex === i
                      ? 'border-orange-500 scale-110 shadow-lg ring-2 ring-orange-500/50'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Thumbnail ${i + 1}`}
                >
                  <Image
                    src={getWebpImageUrl(img.url, 160)}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                    unoptimized={img.url.startsWith('/uploads/')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
