'use client';

import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Subscriber { _id: string; email: string; name?: string; subscribedAt: string; }

export default function NewsletterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const res = await api.get('/subscribers', { params: { page: 1, limit: 50 } });
      return res.data.data as { subscribers: Subscriber[]; total: number };
    },
  });

  const exportCSV = async () => {
    const res = await api.get('/subscribers/export', { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscribers.csv'; a.click();
  };

  return (
    <div>
      <PageHeader title="Newsletter" description={`${data?.total || 0} subscribers`} action={<Button onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>} />
      {isLoading ? <LoadingSpinner /> : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Name</TableHead><TableHead>Subscribed</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.subscribers?.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.name || '-'}</TableCell>
                  <TableCell>{formatDate(s.subscribedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
