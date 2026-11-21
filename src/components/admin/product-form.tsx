'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ProductImageUpload, type ProductImage } from '@/components/admin/product-image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/admin/loading';
import { apiGet, apiPost, apiPut } from '@/lib/api';
import { ADMIN_BASE } from '@/lib/constants';
import type { Category, Product } from '@/types';

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = !productId;

  const [images, setImages] = useState<ProductImage[]>([]);
  const [form, setForm] = useState({
    name: '', sku: '', category: '', subcategory: '', slug: '',
    price: '', mrp: '', priceUnit: 'Piece',
    shortDescription: '', longDescription: '', status: 'published' as 'draft' | 'published',
    features: '', seoTitle: '', seoDescription: '', metaKeywords: '',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiGet<Category[]>('/categories'),
  });

  const { isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const product = await apiGet<Product>(`/products/${productId}`);
      setForm({
        name: product.name, sku: product.sku,
        category: typeof product.category === 'object' ? product.category._id : String(product.category),
        subcategory: product.subcategory || '', slug: product.slug,
        price: product.price !== undefined && product.price !== null ? String(product.price) : '',
        mrp: product.mrp !== undefined && product.mrp !== null ? String(product.mrp) : '',
        priceUnit: product.priceUnit || 'Piece',
        shortDescription: product.shortDescription, longDescription: product.longDescription,
        status: product.status, features: product.features?.join('\n') || '',
        seoTitle: product.seoTitle || '', seoDescription: product.seoDescription || '',
        metaKeywords: product.metaKeywords?.join(', ') || '',
      });
      setImages(product.images || []);
      return product;
    },
    enabled: !!productId,
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      isNew ? apiPost('/products', data) : apiPut(`/products/${productId}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['products-public'] });
      if (productId) await queryClient.invalidateQueries({ queryKey: ['product', productId] });
      router.push(`${ADMIN_BASE}/products`);
    },
  });

  if (!isNew && isLoading) return <LoadingSpinner />;

  const goBack = () => router.push(`${ADMIN_BASE}/products`);

  return (
    <div>
      <div className="mb-4">
        <Button type="button" variant="ghost" size="sm" onClick={goBack} className="-ml-2 text-slate-600">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Products
        </Button>
      </div>
      <PageHeader title={isNew ? 'Add Product' : 'Edit Product'} />
      <form onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          ...form,
          price: form.price ? Number(form.price) : undefined,
          mrp: form.mrp ? Number(form.mrp) : undefined,
          priceUnit: form.priceUnit || 'Piece',
          images,
          features: form.features.split('\n').filter(Boolean),
          metaKeywords: form.metaKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        });
      }}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>SKU *</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></div>
              <div>
                <Label>Category *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div><Label>Subcategory</Label><Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div>
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing (Single Unit &amp; Retail)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Single Unit Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Display price for single piece/retail buyers.
                  </p>
                </div>
                <div>
                  <Label>MRP / List Price (₹) (Optional)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 2000"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Shows strikethrough original price if higher.
                  </p>
                </div>
              </div>

              <div>
                <Label>Unit / Pack</Label>
                <div className="flex flex-wrap gap-2 mt-1.5 mb-2">
                  {['Piece', 'Set', 'Pack', 'Unit', 'Pair', 'Box'].map((u) => (
                    <Button
                      key={u}
                      type="button"
                      variant={form.priceUnit === u ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setForm({ ...form, priceUnit: u })}
                    >
                      per {u}
                    </Button>
                  ))}
                </div>
                <Input
                  placeholder="Custom unit (e.g. Piece, Set)"
                  value={form.priceUnit}
                  onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                />
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold block mb-1">📦 Bulk Orders Policy:</span>
                Website par yeh price <strong>single product</strong> ke liye dikhega. Saath hi ek callout box rahega jisme likha hoga: <em>&ldquo;Bulk order ke liye special discount paane ke liye contact karein&rdquo;</em>, jisse bulk buyers quote submit kar sakein.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle>Descriptions &amp; SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Short Description *</Label><Textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required /></div>
              <div><Label>Long Description *</Label><Textarea rows={4} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} required /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div><Label>Features (one per line)</Label><Textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
              <div><Label>SEO Title</Label><Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
              <div><Label>SEO Description</Label><Input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
          <CardContent>
            <ProductImageUpload images={images} onChange={setImages} productName={form.name} />
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Product'}</Button>
          <Button type="button" variant="outline" onClick={goBack}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
