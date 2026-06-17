'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';
import type { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiGet<Product>(`/products/slug/${slug}`),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center text-slate-500">Loading...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;

  const categoryName = typeof product.category === 'object' ? product.category.name : '';

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link href="/products" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 bg-white rounded-2xl border p-6 lg:p-10">
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
            {product.images?.[0]?.url ? (
              <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">🔬</div>
            )}
          </div>

          <div>
            {categoryName && <span className="text-sm text-blue-600 font-medium">{categoryName}</span>}
            <h1 className="text-3xl font-bold text-slate-900 mt-1">{product.name}</h1>
            <p className="text-sm text-slate-400 mt-1">SKU: {product.sku}</p>
            <p className="text-slate-600 mt-4 leading-relaxed">{product.shortDescription}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/request-quote?product=${product._id}`}>Request Quote</Link>
              </Button>
              <Button asChild variant="outline">
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
