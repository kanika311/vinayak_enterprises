'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';
import type { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { site } = useSiteContact();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiGet<Product>(`/products/slug/${slug}`),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center text-slate-500">Loading...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;

  const categoryName = typeof product.category === 'object' ? product.category.name : '';

  const singleOrderWhatsAppMessage = `Namaste Vinayak Enterprises! Mujhe single piece order / jaankari chahiye:\n- Product: ${product.name}\n- SKU: ${product.sku}${product.price ? `\n- Price: ₹${product.price} / ${product.priceUnit || 'Piece'}` : ''}\nKripya delivery aur order confirmation process batayein.`;

  const bulkOrderWhatsAppMessage = `Namaste Vinayak Enterprises! Mujhe bulk / institutional supply ke liye quote chahiye:\n- Product: ${product.name}\n- SKU: ${product.sku}\nKripya quantity discount aur wholesale quotation provide karein.`;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link href="/products" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 bg-white rounded-2xl border p-6 lg:p-10">
          <div>
            <div className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden relative">
              {product.images?.[0]?.url ? (
                <Image src={product.images[0].url} alt={product.name} fill className="object-contain p-4" unoptimized={product.images[0].url.startsWith('/uploads/')} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-8xl">🔬</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {product.images.map((img) => (
                  <div key={img.url} className="relative h-16 w-16 shrink-0 rounded-lg border bg-slate-50 overflow-hidden">
                    <Image src={img.url} alt="" fill className="object-contain p-1" unoptimized={img.url.startsWith('/uploads/')} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {categoryName && <span className="text-sm text-blue-600 font-medium">{categoryName}</span>}
            <h1 className="text-3xl font-bold text-slate-900 mt-1">{product.name}</h1>
            <p className="text-sm text-slate-400 mt-1">SKU: {product.sku}</p>
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
                          Bulk order ke liye special discount aur custom quotes ke liye humse contact karein.
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
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {product.longDescription && (
          <div className="mt-8 bg-white rounded-2xl border p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line">{product.longDescription}</div>
          </div>
        )}

        {product.specifications?.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Specifications</h2>
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
        )}

        {product.brochure?.url && (
          <div className="mt-6">
            <Button asChild variant="outline">
              <a href={product.brochure.url} target="_blank" rel="noopener">
                <FileText className="mr-2 h-4 w-4" /> Download Brochure
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
