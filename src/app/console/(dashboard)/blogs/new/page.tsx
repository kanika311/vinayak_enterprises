'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { apiPost } from '@/lib/api';
import { ADMIN_BASE } from '@/lib/constants';

export default function NewBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: '', tags: '', seoTitle: '', seoDescription: '', status: 'draft' });

  const mutation = useMutation({
    mutationFn: () => apiPost('/blogs', { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
    onSuccess: () => router.push(`${ADMIN_BASE}/blogs`),
  });

  return (
    <div>
      <PageHeader title="New Blog Post" />
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Content</Label><Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
            <div><Label>SEO Title</Label><Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
            <div><Label>SEO Description</Label><Input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Publish</Button>
        </CardContent>
      </Card>
    </div>
  );
}
