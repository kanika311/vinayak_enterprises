'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner } from '@/components/admin/loading';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet } from '@/lib/api';

interface Catalogue {
  _id: string; title: string; slug: string; downloadCount: number; isActive: boolean;
  file: { url: string; filename?: string };
}

export default function CataloguesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['catalogues'],
    queryFn: () => apiGet<{ catalogues: Catalogue[] }>('/catalogues'),
  });

  return (
    <div>
      <PageHeader title="Catalogue Management" description="Upload PDF catalogues and track downloads" />
      {isLoading ? <LoadingSpinner /> : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>File</TableHead><TableHead>Downloads</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.catalogues?.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell><a href={c.file.url} target="_blank" rel="noopener" className="text-primary hover:underline">{c.file.filename || 'PDF'}</a></TableCell>
                  <TableCell>{c.downloadCount}</TableCell>
                  <TableCell><Badge variant={c.isActive ? 'success' : 'secondary'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
