'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/admin/loading';
import { apiGet, apiPost } from '@/lib/api';

interface Testimonial { _id: string; name: string; company: string; designation?: string; review: string; rating: number; isActive: boolean; }

export default function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', designation: '', review: '', rating: 5 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: () => apiGet<Testimonial[]>('/testimonials') });
  const createMutation = useMutation({
    mutationFn: () => apiPost('/testimonials', form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testimonials'] }); setShowForm(false); },
  });

  return (
    <div>
      <PageHeader title="Testimonials" description="Client reviews and ratings" action={<Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Review</Button>} />
      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>New Testimonial</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Designation</Label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Review</Label><Textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} /></div>
            <Button onClick={() => createMutation.mutate()}>Save</Button>
          </CardContent>
        </Card>
      )}
      {isLoading ? <LoadingSpinner /> : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Company</TableHead><TableHead>Rating</TableHead><TableHead>Review</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.company}</TableCell>
                  <TableCell>{'★'.repeat(t.rating)}</TableCell>
                  <TableCell className="max-w-md truncate">{t.review}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
