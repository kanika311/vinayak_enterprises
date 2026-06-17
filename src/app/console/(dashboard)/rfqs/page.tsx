'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { LoadingSpinner } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { RFQ } from '@/types';

export default function RFQsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['rfqs', page],
    queryFn: () => apiGet<{ rfqs: RFQ[]; pages: number; page: number }>('/rfqs', { page, limit: 10 }),
  });

  const { data: report } = useQuery({
    queryKey: ['rfq-report'],
    queryFn: () => apiGet<RFQ[]>('/rfqs/report'),
  });

  const exportReport = () => {
    if (!report) return;
    const csv = 'Name,Email,Company,Product,Quantity,Budget,Status,Date\n' +
      report.map((r) => `${r.name},${r.email},${r.companyName},${r.product?.name},${r.quantity},${r.budget || ''},${r.status},${r.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rfq-report.csv'; a.click();
  };

  return (
    <div>
      <PageHeader title="RFQ Requests" description="Request for Quote management and reports" action={<Button onClick={exportReport}><Download className="mr-2 h-4 w-4" /> Export Report</Button>} />
      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead><TableHead>Contact</TableHead><TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead><TableHead>Budget</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.rfqs?.map((rfq) => (
                  <TableRow key={rfq._id}>
                    <TableCell className="font-medium">{rfq.companyName}</TableCell>
                    <TableCell>{rfq.name}<br /><span className="text-xs text-muted-foreground">{rfq.email}</span></TableCell>
                    <TableCell>{rfq.product?.name}</TableCell>
                    <TableCell>{rfq.quantity}</TableCell>
                    <TableCell>{rfq.budget || '-'}</TableCell>
                    <TableCell><Badge>{rfq.status}</Badge></TableCell>
                    <TableCell>{formatDate(rfq.createdAt)}</TableCell>
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
