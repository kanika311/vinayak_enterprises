'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { SearchBar } from '@/components/admin/search-bar';
import { Pagination } from '@/components/admin/pagination';
import { LoadingSpinner } from '@/components/admin/loading';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet } from '@/lib/api';

interface Customer { _id: string; name: string; company: string; email: string; phone?: string; type: string; isActive: boolean; }

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search, typeFilter],
    queryFn: () => apiGet<{ customers: Customer[]; pages: number; page: number }>('/customers', { page, limit: 10, search, type: typeFilter }),
  });

  return (
    <div>
      <PageHeader title="Customer Management" description="Customers, dealers, distributors, institutions, schools, colleges" />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." onSearch={() => setPage(1)} />
        <select className="h-10 rounded-md border px-3 text-sm" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          {['customer', 'dealer', 'distributor', 'institution', 'school', 'college'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Company</TableHead><TableHead>Email</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {data?.customers?.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.company}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                    <TableCell><Badge variant={c.isActive ? 'success' : 'secondary'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
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
