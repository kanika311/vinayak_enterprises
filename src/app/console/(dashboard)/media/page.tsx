'use client';

import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiGet, apiUpload, apiDelete } from '@/lib/api';

interface MediaItem { _id: string; name: string; type: string; url: string; size?: number; mimeType?: string; }

export default function MediaPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => apiGet<{ media: MediaItem[] }>('/media', { page: 1, limit: 50 }),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => apiUpload<MediaItem>('/media/upload', file, 'media'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/media/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  return (
    <div>
      <PageHeader title="Media Library" description="Images, videos, PDFs — Cloudinary integration" action={
        <>
          <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*,.pdf" />
          <Button onClick={() => fileRef.current?.click()} disabled={uploadMutation.isPending}>
            <Upload className="mr-2 h-4 w-4" /> {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </>
      } />
      {isLoading ? <LoadingSpinner /> : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.media?.map((item) => (
            <div key={item._id} className="rounded-lg border bg-white p-4">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="h-32 w-full rounded object-cover mb-3" />
              ) : (
                <div className="h-32 w-full rounded bg-muted flex items-center justify-center mb-3">
                  <Badge>{item.type}</Badge>
                </div>
              )}
              <p className="text-sm font-medium truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline">{item.type}</Badge>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
