'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/admin/loading';
import { apiGet, apiPost } from '@/lib/api';

interface AdminUser { _id: string; name: string; email: string; role: string; isActive: boolean; }

const ROLES = ['super_admin', 'admin', 'content_manager', 'sales_executive'];

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admins'], queryFn: () => apiGet<AdminUser[]>('/admins') });

  const createMutation = useMutation({
    mutationFn: () => apiPost('/admins', form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admins'] }); setShowForm(false); },
  });

  return (
    <div>
      <PageHeader title="Role Management" description="Super Admin, Admin, Content Manager, Sales Executive" action={<Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add User</Button>} />
      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>New Admin User</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div>
              <Label>Role</Label>
              <select className="flex h-10 w-full rounded-md border px-3 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <Button onClick={() => createMutation.mutate()}>Create User</Button>
          </CardContent>
        </Card>
      )}
      {isLoading ? <LoadingSpinner /> : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell><Badge variant="outline">{admin.role.replace(/_/g, ' ')}</Badge></TableCell>
                  <TableCell><Badge variant={admin.isActive ? 'success' : 'secondary'}>{admin.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
