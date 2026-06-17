'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { SearchBar } from '@/components/admin/search-bar';
import { Pagination } from '@/components/admin/pagination';
import { LoadingSpinner } from '@/components/admin/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet, apiPut } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Lead } from '@/types';

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'destructive' | 'outline'> = {
  new: 'default', contacted: 'secondary', qualified: 'success', converted: 'success', lost: 'destructive',
};

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['leads', page, search, statusFilter],
    queryFn: () => apiGet<{ leads: Lead[]; total: number; pages: number; page: number }>('/leads', { page, limit: 10, search, status: statusFilter }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiPut(`/leads/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return (
    <div>
      <PageHeader title="Lead Management" description="Contact forms, quotes, catalogue downloads, product enquiries" />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search leads..." onSearch={() => setPage(1)} />
        <select className="h-10 rounded-md border px-3 text-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          {['new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Company</TableHead><TableHead>Email</TableHead>
                  <TableHead>Source</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.leads?.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company || '-'}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell><Badge variant="outline">{lead.leadSource.replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell><Badge variant={statusColors[lead.status] || 'secondary'}>{lead.status}</Badge></TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell>
                      <select className="text-xs rounded border px-2 py-1" value={lead.status} onChange={(e) => updateMutation.mutate({ id: lead._id, status: e.target.value })}>
                        {['new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {data && <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
