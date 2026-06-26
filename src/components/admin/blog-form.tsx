'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { FeaturedImageUpload, type FeaturedImage } from '@/components/admin/featured-image-upload';
import { apiGet, apiPost, apiPut } from '@/lib/api';
import { ADMIN_BASE } from '@/lib/constants';
import type { Blog } from '@/types';

export function BlogForm({ blogId }: { blogId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = !blogId;

  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const blog = await apiGet<Blog>(`/blogs/${blogId}`);
      setForm({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || '',
        category: blog.category || '',
        tags: blog.tags?.join(', ') || '',
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        status: blog.status,
      });
      setFeaturedImage(blog.featuredImage?.url ? blog.featuredImage : null);
      return blog;
    },
    enabled: !!blogId,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featuredImage: featuredImage ?? null,
      };
      return isNew ? apiPost('/blogs', payload) : apiPut(`/blogs/${blogId}`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blogs'] });
      await queryClient.invalidateQueries({ queryKey: ['blogs-public'] });
      router.push(`${ADMIN_BASE}/blogs`);
    },
  });

  if (!isNew && isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={isNew ? 'New Blog Post' : 'Edit Blog Post'} />
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label>Content *</Label><Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div>
          <div>
            <Label>Featured Image</Label>
            <p className="text-xs text-muted-foreground mb-2">Appears at the top of the post and on blog cards.</p>
            <FeaturedImageUpload value={featuredImage} onChange={setFeaturedImage} />
          </div>
          <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div>
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="md:col-span-2"><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
            <div><Label>SEO Title</Label><Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
            <div><Label>SEO Description</Label><Input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div>
          </div>
          <div className="flex gap-3">
            <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.title || !form.content}>
              {mutation.isPending ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(`${ADMIN_BASE}/blogs`)}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
