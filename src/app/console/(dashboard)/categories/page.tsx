'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/admin/loading';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', slug: '' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiGet<Category[]>('/categories'),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => apiPost('/categories', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setShowForm(false); setForm({ name: '', description: '', slug: '' }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  return (
    <div>
      <PageHeader title="Categories" description="Microscopes, Anatomy Models, Manikins, Laboratory Equipment" action={<Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Category</Button>} />
      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>New Category</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="md:col-span-3"><Button onClick={() => createMutation.mutate(form)} disabled={!form.name}>Create</Button></div>
          </CardContent>
        </Card>
      )}
      {isLoading ? <LoadingSpinner /> : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Status</TableHead><TableHead>Subcategories</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell><Badge variant={cat.isActive ? 'success' : 'secondary'}>{cat.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>{cat.subcategories?.length || 0}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cat._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
