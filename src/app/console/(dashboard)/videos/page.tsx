'use client';

import { useRef, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Trash2, Upload, Video, Play, Eye, EyeOff, Film, Link as LinkIcon,
  CheckCircle, Sparkles, X, ExternalLink
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner, EmptyState } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '@/lib/api';
import { getWebpPosterUrl, getYouTubeEmbedUrl, extractYouTubeId } from '@/lib/utils';
import type { ShowcaseVideo } from '@/types';

const CATEGORIES = [
  'Microscopes',
  'Anatomy Models',
  'CPR Manikins',
  'Lab Equipment',
  'Demonstration',
  'General',
] as const;

export default function ShowcaseVideosPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Microscopes');
  const [duration, setDuration] = useState('1:45');
  const [order, setOrder] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPublicId, setVideoPublicId] = useState<string | undefined>();
  const [posterUrl, setPosterUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [error, setError] = useState('');

  // Active filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Preview Modal
  const [activePreview, setActivePreview] = useState<ShowcaseVideo | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: () => apiGet<ShowcaseVideo[]>('/videos'),
    refetchOnMount: 'always',
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
    queryClient.invalidateQueries({ queryKey: ['videos-public'] });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      apiPost('/videos', {
        title,
        description,
        videoUrl,
        videoPublicId,
        posterUrl: posterUrl || getWebpPosterUrl(videoUrl),
        category,
        duration,
        order,
        isActive: true,
        isFeatured: true,
      }),
    onSuccess: () => {
      invalidate();
      resetForm();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save video';
      setError(msg);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiPut(`/videos/${id}`, { isActive }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/videos/${id}`),
    onSuccess: invalidate,
  });

  const resetForm = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setCategory('Microscopes');
    setDuration('1:45');
    setOrder(0);
    setVideoUrl('');
    setVideoPublicId(undefined);
    setPosterUrl('');
    setUploadPercent(0);
    setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv|avi|m4v)$/i)) {
      setError('Please select a valid video file (MP4, WebM, MOV)');
      return;
    }

    setError('');
    setUploading(true);
    setUploadPercent(0);

    if (!title) {
      setTitle(
        file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      );
    }

    try {
      // 1. Direct-to-Cloudinary signed upload (handles large HD videos bypassing Vercel 4.5MB limit)
      let uploadSuccess = false;
      let signatureError = '';
      try {
        const sig = await apiGet<{
          signature: string;
          timestamp: number;
          apiKey: string;
          cloudName: string;
          folder: string;
        }>('/videos/signature');

        if (sig?.signature && sig?.cloudName) {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('api_key', sig.apiKey);
          fd.append('timestamp', String(sig.timestamp));
          fd.append('signature', sig.signature);
          fd.append('folder', sig.folder);

          const cdnRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
            fd,
            {
              onUploadProgress: (progressEvent) => {
                const total = progressEvent.total || file.size;
                const percent = Math.min(99, Math.round((progressEvent.loaded * 100) / total));
                setUploadPercent(percent);
              },
            }
          );

          if (cdnRes.data?.secure_url) {
            setUploadPercent(100);
            setVideoUrl(cdnRes.data.secure_url);
            setVideoPublicId(cdnRes.data.public_id);
            setPosterUrl(getWebpPosterUrl(cdnRes.data.secure_url));
            uploadSuccess = true;
          }
        }
      } catch (directErr: unknown) {
        signatureError =
          (directErr as { response?: { data?: { message?: string; error?: { message?: string } } } })?.response?.data?.message ||
          (directErr as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
          (directErr as Error)?.message ||
          '';
        console.warn('Direct Cloudinary signed upload failed, falling back to server upload:', directErr);
      }

      // 2. Server upload fallback (for smaller files or local development)
      if (!uploadSuccess) {
        if (file.size > 4.5 * 1024 * 1024) {
          const reason = signatureError ? ` (${signatureError})` : '';
          throw new Error(
            `Video size is ${(file.size / (1024 * 1024)).toFixed(1)}MB, exceeding Vercel's 4.5MB server limit. Direct CDN upload could not proceed${reason}. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your Vercel Project Settings, OR switch to the "Video / YouTube URL" tab above to paste a YouTube link instantly.`
          );
        }
        const result = await apiUpload<{ url: string; publicId?: string; posterUrl?: string }>(
          '/videos/upload',
          file,
          'showcase_videos'
        );
        setVideoUrl(result.url);
        setVideoPublicId(result.publicId);
        setPosterUrl(result.posterUrl || getWebpPosterUrl(result.url));
      }
    } catch (err: unknown) {
      console.error('Video upload error:', err);
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response?.data?.error?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Failed to upload video. Please ensure Cloudinary credentials are set on Vercel or use a YouTube link.';
      setError(msg);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleUrlChange = (val: string) => {
    setVideoUrl(val);
    setVideoPublicId(undefined);
    const poster = getWebpPosterUrl(val);
    if (poster) setPosterUrl(poster);
  };

  const filteredVideos =
    selectedCategory === 'All'
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  const previewPoster = posterUrl || getWebpPosterUrl(videoUrl);
  const isYouTube = !!extractYouTubeId(videoUrl);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Showcase Videos"
        description="Upload product demonstration videos and equipment walkthroughs. Thumbnails are automatically generated and served in high-performance WebP format."
        action={
          !showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#1a3a6b] hover:bg-[#152e55] gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Video
            </Button>
          ) : undefined
        }
      />

      {/* Creation Form */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50/20 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#1a3a6b]" />
                Add New Showcase Video
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Uploaded videos or YouTube embeds will appear in the website&apos;s Equipment Video Showcase.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetForm} className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Input method selector */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg max-w-sm">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'file' ? 'bg-white shadow text-[#1a3a6b]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload File (MP4/WebM)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'url' ? 'bg-white shadow text-[#1a3a6b]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" /> Video / YouTube URL
              </button>
            </div>

            {/* Video Input */}
            {uploadMode === 'file' ? (
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Select Video File (MP4, WebM, MOV &mdash; Direct CDN Upload with Auto WebP Thumbnail)
                </Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => !uploading && fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    uploading
                      ? 'border-blue-300 bg-blue-50/30 cursor-wait'
                      : videoUrl
                      ? 'border-emerald-300 bg-emerald-50/40 cursor-pointer'
                      : 'border-slate-300 hover:border-[#1a3a6b] bg-white cursor-pointer'
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2.5 text-slate-600 max-w-sm mx-auto">
                      <LoadingSpinner />
                      <div className="w-full">
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>
                            {uploadPercent > 0 && uploadPercent < 100
                              ? 'Uploading HD video...'
                              : 'Generating WebP thumbnail poster...'}
                          </span>
                          <span className="text-[#1a3a6b]">{uploadPercent > 0 ? `${uploadPercent}%` : 'Starting...'}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(8, uploadPercent)}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Direct-to-CDN upload active. HD equipment videos of any size supported.
                      </p>
                    </div>
                  ) : videoUrl ? (
                    <div className="flex flex-col items-center gap-1.5 text-emerald-700">
                      <CheckCircle className="w-7 h-7 text-emerald-600" />
                      <p className="text-sm font-bold">Video uploaded successfully!</p>
                      <p className="text-xs text-slate-500 font-mono truncate max-w-md">{videoUrl}</p>
                      <span className="text-xs text-[#1a3a6b] underline mt-1">Click to replace file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Upload className="w-8 h-8 text-slate-400" />
                      <p className="text-sm font-medium">Click to choose or drag an MP4, WebM or MOV video</p>
                      <p className="text-xs text-slate-400">Microscope walkthroughs, anatomy assembly, CPR tutorials (any size)</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1.5">
                  💡 Need to publish a video right now? Switch to{' '}
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className="text-[#1a3a6b] font-semibold underline hover:text-orange-600"
                  >
                    Video / YouTube URL
                  </button>{' '}
                  to paste any YouTube link with auto-generated WebP poster!
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="video-url" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Video URL or YouTube Link
                </Label>
                <Input
                  id="video-url"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://res.cloudinary.com/.../demo.mp4"
                  value={videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="bg-white"
                />
                <p className="text-xs text-slate-400 mt-1">
                  YouTube links auto-generate high-definition thumbnails; Cloudinary links auto-generate WebP frame posters.
                </p>
              </div>
            )}

            {/* Title and Category */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video-title" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Video Title *
                </Label>
                <Input
                  id="video-title"
                  placeholder="e.g. Vilakshan Netra Binocular Microscope Demonstration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <Label htmlFor="video-category" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Category *
                </Label>
                <select
                  id="video-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="video-desc" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Short Description
              </Label>
              <textarea
                id="video-desc"
                rows={2}
                placeholder="Key equipment features, slide preparation, or hands-on medical demonstration summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
              />
            </div>

            {/* Duration and Order */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video-duration" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Duration (e.g. 1:45, 2:30)
                </Label>
                <Input
                  id="video-duration"
                  placeholder="1:45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <Label htmlFor="video-order" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Display Order (lower numbers appear first)
                </Label>
                <Input
                  id="video-order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="bg-white"
                />
              </div>
            </div>

            {/* Live Preview if Video is present */}
            {videoUrl && (
              <div className="rounded-xl border border-blue-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#1a3a6b] flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Preview &amp; WebP Poster
                </p>
                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-inner">
                    {isYouTube ? (
                      <iframe
                        src={getYouTubeEmbedUrl(videoUrl) || ''}
                        title="Preview"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={videoUrl}
                        controls
                        poster={previewPoster}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-slate-800 text-sm">{title || 'Video Title'}</p>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-[11px] bg-blue-50 text-[#1a3a6b]">
                        {category}
                      </Badge>
                      <span className="text-slate-400">⏱ {duration}</span>
                    </div>
                    <p className="text-slate-500 line-clamp-2">{description || 'No description provided.'}</p>
                    {previewPoster && (
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium pt-1">
                        <CheckCircle className="w-3.5 h-3.5" /> WebP poster auto-generated
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => createMutation.mutate()}
                disabled={!title || !videoUrl || createMutation.isPending}
                className="bg-[#1a3a6b] hover:bg-[#152e55] px-6"
              >
                {createMutation.isPending ? 'Publishing...' : 'Save & Publish Video'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#1a3a6b] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white flex flex-col items-center justify-center">
          <Film className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No showcase videos found</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-1 mb-4">
            Click &apos;Add Video&apos; above to upload equipment demonstration videos or add YouTube walkthroughs.
          </p>
          <Button onClick={() => setShowForm(true)} className="bg-[#1a3a6b]">
            <Plus className="w-4 h-4 mr-2" /> Add First Video
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const poster = video.posterUrl || getWebpPosterUrl(video.videoUrl);
            return (
              <Card
                key={video._id}
                className="overflow-hidden border-slate-200 hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {poster ? (
                    <img
                      src={poster}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Film className="w-12 h-12" />
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div
                    onClick={() => setActivePreview(video)}
                    className="absolute inset-0 bg-black/40 group-hover:bg-black/25 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#1a3a6b] shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <Badge className="bg-black/70 backdrop-blur-sm text-white text-[10px] border-none font-medium">
                      {video.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    <span className="bg-black/80 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded font-mono">
                      ⏱ {video.duration || '1:30'}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 flex-1 mb-3">
                    {video.description || 'Equipment demonstration video for laboratory education and institutional supply.'}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> {video.views || 0} views
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toggleMutation.mutate({ id: video._id, isActive: !video.isActive })
                        }
                        className={`h-8 px-2 text-xs font-semibold gap-1 ${
                          video.isActive
                            ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {video.isActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Hidden
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete "${video.title}"?`)) {
                            deleteMutation.mutate(video._id);
                          }
                        }}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Video Preview Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b bg-slate-50">
              <div>
                <Badge className="bg-[#1a3a6b] text-white text-xs mb-1">
                  {activePreview.category}
                </Badge>
                <h3 className="font-bold text-slate-900 text-base">{activePreview.title}</h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-black relative">
              {extractYouTubeId(activePreview.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activePreview.videoUrl) || ''}
                  title={activePreview.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activePreview.videoUrl}
                  controls
                  autoPlay
                  poster={activePreview.posterUrl || getWebpPosterUrl(activePreview.videoUrl)}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-4 bg-white flex items-center justify-between text-xs text-slate-600 border-t">
              <p className="line-clamp-2 max-w-lg">{activePreview.description}</p>
              <a
                href={activePreview.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#1a3a6b] font-semibold hover:underline shrink-0"
              >
                Open Original <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
