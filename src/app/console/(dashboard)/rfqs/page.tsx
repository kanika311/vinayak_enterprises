'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { LoadingSpinner, EmptyState } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet, apiPut } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { RFQ } from '@/types';

const statusOptions = ['pending', 'quoted', 'accepted', 'rejected'];

export default function RFQsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['rfqs', page],
    queryFn: () => apiGet<{ rfqs: RFQ[]; pages: number; page: number }>('/rfqs', { page, limit: 10 }),
    refetchOnMount: 'always',
  });

  const { data: report } = useQuery({
    queryKey: ['rfq-report'],
    queryFn: () => apiGet<RFQ[]>('/rfqs/report'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiPut(`/rfqs/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rfqs'] }),
  });

  const exportReport = () => {
    if (!report) return;
    const csv = 'Name,Email,Company,Product,Quantity,Budget,Status,Date\n' +
      report.map((r) => `${r.name},${r.email},${r.companyName},${r.product?.name || r.productName || ''},${r.quantity},${r.budget || ''},${r.status},${r.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rfq-report.csv'; a.click();
  };

  const productLabel = (rfq: RFQ) => rfq.product?.name || rfq.productName || 'General enquiry';

  return (
    <div>
      <PageHeader
        title="Quote Requests"
        description="Shows submissions from Get Quote page and Contact Us → Request Quotation tab"
        action={<Button onClick={exportReport}><Download className="mr-2 h-4 w-4" /> Export Report</Button>}
      />
      <div className="mb-6 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-900">
        <strong>Looking for general enquiries?</strong>{' '}
        Contact → <em>General Inquiry</em> and <em>Catalogue Request</em> are under{' '}
        <a href="/console/leads" className="font-semibold underline">Contact Forms</a>, not here.
      </div>
      {isLoading ? <LoadingSpinner /> : !data?.rfqs?.length ? (
        <EmptyState message="No quote requests yet. Submit a test quote from the website." />
      ) : (
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
                {data.rfqs.map((rfq) => (
                  <TableRow key={rfq._id}>
                    <TableCell className="font-medium">{rfq.companyName}</TableCell>
                    <TableCell>{rfq.name}<br /><span className="text-xs text-muted-foreground">{rfq.email}{rfq.phone ? ` · ${rfq.phone}` : ''}</span></TableCell>
                    <TableCell>{productLabel(rfq)}</TableCell>
                    <TableCell>{rfq.quantity}</TableCell>
                    <TableCell>{rfq.budget || '-'}</TableCell>
                    <TableCell>
                      <select
                        className="text-xs rounded border px-2 py-1"
                        value={rfq.status}
                        onChange={(e) => updateMutation.mutate({ id: rfq._id, status: e.target.value })}
                      >
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </TableCell>
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
