'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Trash2, Star } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner, EmptyState } from '@/components/admin/loading';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  designation?: string;
  email?: string;
  productName?: string;
  review: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const statusBadge: Record<Testimonial['status'], 'default' | 'success' | 'secondary' | 'destructive'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'destructive',
};

const tabs: { key: 'all' | Testimonial['status']; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

export default function TestimonialsPage() {
  const [tab, setTab] = useState<'all' | Testimonial['status']>('pending');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', designation: '', productName: '', review: '', rating: 5 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => apiGet<Testimonial[]>('/testimonials'),
    refetchOnMount: 'always',
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials-public'] });
  };

  const createMutation = useMutation({
    mutationFn: () => apiPost('/testimonials', form),
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setForm({ name: '', company: '', designation: '', productName: '', review: '', rating: 5 });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Testimonial['status'] }) => apiPut(`/testimonials/${id}`, { status }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/testimonials/${id}`),
    onSuccess: invalidate,
  });

  const all = data || [];
  const counts = {
    pending: all.filter((t) => t.status === 'pending').length,
    approved: all.filter((t) => t.status === 'approved').length,
    rejected: all.filter((t) => t.status === 'rejected').length,
  };
  const filtered = tab === 'all' ? all : all.filter((t) => t.status === tab);

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Approve or reject client reviews submitted from the website. Approved reviews show on the homepage."
        action={<Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Manually</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>New Testimonial (auto-approved)</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Company / Institution</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Designation</Label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
            <div><Label>Product Purchased</Label><Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} /></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Review</Label><Textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} /></div>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.name || !form.company || !form.review}>
              {createMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? 'default' : 'outline'}
            size="sm"
            className={tab === t.key ? 'bg-[#1a3a6b]' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.key !== 'all' && counts[t.key] > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-1.5 text-xs">{counts[t.key]}</span>
            )}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState message={`No ${tab === 'all' ? '' : tab} testimonials.`} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t._id} className="flex flex-col">
              <CardContent className="pt-6 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.designation ? `${t.designation}, ` : ''}{t.company}
                    </p>
                  </div>
                  <Badge variant={statusBadge[t.status]} className="capitalize shrink-0">{t.status}</Badge>
                </div>

                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>

                {t.productName && (
                  <p className="text-xs text-blue-600 mt-2">Purchased: <span className="font-medium">{t.productName}</span></p>
                )}

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">&ldquo;{t.review}&rdquo;</p>
                <p className="text-xs text-slate-400 mt-3">{formatDate(t.createdAt)}</p>
              </CardContent>

              <div className="flex gap-2 border-t p-3">
                {t.status !== 'approved' && (
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => statusMutation.mutate({ id: t._id, status: 'approved' })}>
                    <Check className="mr-1 h-4 w-4" /> Approve
                  </Button>
                )}
                {t.status !== 'rejected' && (
                  <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:bg-red-50" onClick={() => statusMutation.mutate({ id: t._id, status: 'rejected' })}>
                    <X className="mr-1 h-4 w-4" /> Reject
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete this testimonial permanently?')) deleteMutation.mutate(t._id); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
