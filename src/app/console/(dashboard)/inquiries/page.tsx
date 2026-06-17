'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { LoadingSpinner } from '@/components/admin/loading';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Inquiry { _id: string; type: string; name: string; email: string; subject?: string; message: string; status: string; createdAt: string; }

export default function InquiriesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['inquiries', page],
    queryFn: () => apiGet<{ inquiries: Inquiry[]; pages: number; page: number }>('/inquiries', { page, limit: 10 }),
  });

  return (
    <div>
      <PageHeader title="Inquiry Management" description="Product inquiries, contact requests, email requests" />
      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {data?.inquiries?.map((inq) => (
                  <TableRow key={inq._id}>
                    <TableCell><Badge variant="outline">{inq.type.replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell className="font-medium">{inq.name}</TableCell>
                    <TableCell>{inq.email}</TableCell>
                    <TableCell>{inq.subject || inq.message.slice(0, 50)}</TableCell>
                    <TableCell><Badge>{inq.status}</Badge></TableCell>
                    <TableCell>{formatDate(inq.createdAt)}</TableCell>
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
