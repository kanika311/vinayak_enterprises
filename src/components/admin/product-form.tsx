'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

  return (
    <div>
      <PageHeader title={isNew ? 'Add Product' : 'Edit Product'} />
      <form onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          ...form,
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
            <CardHeader><CardTitle>Descriptions &amp; SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Short Description *</Label><Textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required /></div>
              <div><Label>Long Description *</Label><Textarea rows={4} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} required /></div>
              <div><Label>Features (one per line)</Label><Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
              <div><Label>SEO Title</Label><Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
              <div><Label>SEO Description</Label><Input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
          <CardContent>
            <ProductImageUpload images={images} onChange={setImages} productName={form.name} />
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Product'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
