'use client';

import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';

interface Catalogue {
  _id: string; title: string; description?: string;
  file: { url: string; filename?: string }; downloadCount: number;
}

export default function CataloguesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['catalogues-public'],
    queryFn: () => apiGet<{ catalogues: Catalogue[] }>('/catalogues'),
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">Product Catalogues</h1>
          <p className="text-slate-500 mt-1">Download our latest product catalogues in PDF format</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-xl border h-24 animate-pulse" />)
        ) : !data?.catalogues?.length ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">📄</p>
            <p>Catalogues coming soon</p>
          </div>
        ) : (
          data.catalogues.map((cat) => (
            <div key={cat._id} className="bg-white rounded-xl border p-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">{cat.title}</h3>
                {cat.description && <p className="text-sm text-slate-500 mt-1">{cat.description}</p>}
                <p className="text-xs text-slate-400 mt-1">{cat.downloadCount} downloads</p>
              </div>
              <Button asChild className="shrink-0 bg-blue-600">
                <a href={cat.file.url} target="_blank" rel="noopener">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </a>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
