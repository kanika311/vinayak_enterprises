'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Upload, Video, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner, EmptyState } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '@/lib/api';

interface Banner {
  _id: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
  placement: string;
  isActive: boolean;
  order: number;
}

export default function BannersPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPublicId, setVideoPublicId] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => apiGet<Banner[]>('/banners'),
    refetchOnMount: 'always',
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['banners'] });
    queryClient.invalidateQueries({ queryKey: ['banners-public'] });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      apiPost('/banners', {
        title,
        videoUrl,
        videoPublicId,
        order,
        isActive: true,
        placement: 'hero',
      }),
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setTitle('');
      setOrder(0);
      setVideoUrl('');
      setVideoPublicId(undefined);
      setError('');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create banner';
      setError(msg);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiPut(`/banners/${id}`, { isActive }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/banners/${id}`),
    onSuccess: invalidate,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const result = await apiUpload<{ url: string; publicId?: string }>(
        '/banners/upload-video',
        file,
        'banners'
      );
      setVideoUrl(result.url);
      setVideoPublicId(result.publicId);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Video upload failed (use MP4/WebM, max 50MB)';
      setError(msg);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const banners = data || [];

  return (
    <div>
      <PageHeader
        title="Banner Videos"
        description="Upload looping background videos for the homepage hero banner. Active videos play muted on a loop."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" /> Add Banner Video
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Hero Banner Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lab showcase reel"
                />
              </div>
              <div>
                <Label>Display order</Label>
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label>Video file (MP4 / WebM)</Label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={handleUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload video'}
                </Button>
                {videoUrl && <Badge variant="success">Video ready</Badge>}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Short clips work best (10–30s). Video autoplays muted and loops on the homepage.
              </p>
            </div>

            {videoUrl && (
              <video
                src={videoUrl}
                className="w-full max-w-md rounded-lg border bg-black aspect-video object-cover"
                muted
                loop
                playsInline
                controls
              />
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <Button
                disabled={!title.trim() || !videoUrl || createMutation.isPending}
                onClick={() => createMutation.mutate()}
              >
                {createMutation.isPending ? 'Saving...' : 'Save banner'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : banners.length === 0 ? (
        <EmptyState message="No banner videos yet. Upload an MP4/WebM clip for the homepage hero background." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {banners.map((banner) => (
            <Card key={banner._id}>
              <CardContent className="p-4 space-y-3">
                <video
                  src={banner.videoUrl}
                  className="w-full rounded-lg border bg-black aspect-video object-cover"
                  muted
                  loop
                  playsInline
                  controls
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-slate-500" />
                      <h3 className="font-semibold text-slate-900">{banner.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Order {banner.order} · {banner.placement}
                    </p>
                  </div>
                  <Badge variant={banner.isActive ? 'success' : 'secondary'}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleMutation.mutate({ id: banner._id, isActive: !banner.isActive })
                    }
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff className="mr-1 h-4 w-4" /> Disable
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 h-4 w-4" /> Enable
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm('Delete this banner video?')) deleteMutation.mutate(banner._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
