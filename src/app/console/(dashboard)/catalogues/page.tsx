'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import axios from 'axios';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Trash2,
  ExternalLink,
  Download,
  Eye,
  Check,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner, EmptyState } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet, apiDelete, apiPut } from '@/lib/api';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Catalogue {
  _id: string;
  title: string;
  slug: string;
  downloadCount: number;
  isActive: boolean;
  createdAt: string;
  file: { url: string; filename?: string };
}

export default function AdminCataloguesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [directFilename, setDirectFilename] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-catalogues'],
    queryFn: () => apiGet<{ catalogues: Catalogue[] }>('/catalogues'),
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => apiPut(`/catalogues/${id}`, { isActive: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-catalogues'] });
      queryClient.invalidateQueries({ queryKey: ['catalogues-public'] });
      setUploadSuccess('Catalogue activated and is now live on the website!');
      setTimeout(() => setUploadSuccess(''), 4000);
    },
    onError: () => {
      setErrorMsg('Failed to activate catalogue.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/catalogues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-catalogues'] });
      queryClient.invalidateQueries({ queryKey: ['catalogues-public'] });
    },
  });

  // 1. Upload PDF file
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a PDF file first.');
      return;
    }
    setErrorMsg('');
    setIsUploading(true);
    setUploadPercent(0);
    setUploadSuccess('');

    try {
      // 1. Try Direct Cloudinary Signed Upload (bypasses Vercel 4.5MB request limit!)
      let directUploadDone = false;
      try {
        const sig = await apiGet<{
          signature: string;
          timestamp: number;
          apiKey: string;
          cloudName: string;
          folder: string;
        }>('/catalogues/signature');

        if (sig?.signature && sig?.cloudName) {
          const fd = new FormData();
          fd.append('file', selectedFile);
          fd.append('api_key', sig.apiKey);
          fd.append('timestamp', String(sig.timestamp));
          fd.append('signature', sig.signature);
          fd.append('folder', sig.folder);

          const cdnRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
            fd,
            {
              onUploadProgress: (progressEvent) => {
                const total = progressEvent.total || selectedFile.size;
                const percent = Math.min(99, Math.round((progressEvent.loaded * 100) / total));
                setUploadPercent(percent);
              },
            }
          );

          if (cdnRes.data?.secure_url) {
            setUploadPercent(100);
            await api.post('/catalogues', {
              title: title.trim() || selectedFile.name.replace(/\.pdf$/i, ''),
              file: {
                url: cdnRes.data.secure_url,
                filename: selectedFile.name,
                publicId: cdnRes.data.public_id,
              },
              category: 'All Products',
              pageCount: cdnRes.data?.pages || 1,
              isActive: true,
            });

            directUploadDone = true;
          }
        }
      } catch (directErr) {
        console.warn('Direct Cloudinary upload error:', directErr);
      }

      // 2. Fallback to server upload route if direct upload was not completed
      if (!directUploadDone) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (title.trim()) formData.append('title', title.trim());

        await api.post('/catalogues/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSelectedFile(null);
      setTitle('');
      setUploadPercent(0);
      setUploadSuccess('Catalogue PDF uploaded and published successfully as the active live catalogue!');
      await queryClient.invalidateQueries({ queryKey: ['admin-catalogues'] });
      await queryClient.invalidateQueries({ queryKey: ['catalogues-public'] });
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to upload PDF. Please check file size and internet connection.';
      setErrorMsg(msg || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadPercent(0);
    }
  };

  // 2. Add via direct PDF URL (e.g. Cloudinary, Google Drive, CDN)
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) {
      setErrorMsg('Please enter a valid PDF URL.');
      return;
    }
    setErrorMsg('');
    setIsUploading(true);
    setUploadSuccess('');

    try {
      await api.post('/catalogues', {
        title: title.trim() || directFilename.trim() || 'Vinayak Enterprises Product Catalogue 2026',
        file: {
          url: directUrl.trim(),
          filename: directFilename.trim() || 'product-catalogue.pdf',
        },
        category: 'All Products',
        isActive: true,
      });

      setTitle('');
      setDirectUrl('');
      setDirectFilename('');
      setUploadSuccess('Catalogue link published successfully as the active live catalogue!');
      await queryClient.invalidateQueries({ queryKey: ['admin-catalogues'] });
      await queryClient.invalidateQueries({ queryKey: ['catalogues-public'] });
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to save catalogue URL.';
      setErrorMsg(msg || 'Saving failed');
    } finally {
      setIsUploading(false);
    }
  };

  const catalogues = data?.catalogues || [];
  const activeCatalogue = catalogues.find((c) => c.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Product Catalogue Management"
          description="Upload and publish product catalogues in PDF format. Active catalogue is instantly displayed on the public website with online viewing and compressed download options."
        />
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
            <Link href="/catalogues" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" /> View Public Site (/catalogues)
            </Link>
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/90 text-xs text-blue-900 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-950 mb-0.5">
            Admin Guide: PDF Catalogue Upload &amp; Public Display
          </p>
          <p className="text-blue-800 leading-relaxed">
            Yahan se aap product catalogue ki PDF upload kar sakte hain. Upload hote hi wo seedhe public website{' '}
            <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-semibold">/catalogues</code> par display hogi jahan
            visitors online catalogue padh sakte hain aur high-speed / compressed PDF format mein download kar sakte hain.
          </p>
        </div>
      </div>

      {/* Upload PDF Section */}
      <Card className="border-2 border-blue-200/80 shadow-sm bg-gradient-to-b from-white to-blue-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
            <UploadCloud className="h-5 w-5 text-blue-600" />
            Upload New Catalogue PDF
          </CardTitle>
          <CardDescription>
            Choose a PDF file from your device or paste a hosted PDF URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Custom Tabs */}
          <div className="flex items-center gap-2 mb-5 p-1 bg-slate-100 rounded-lg w-fit border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'file'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="h-4 w-4" /> Upload PDF File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="h-4 w-4" /> Direct PDF Link / Cloud URL
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === 'file' && (
            <form onSubmit={handleFileUpload} className="space-y-4 max-w-xl">
                <div>
                  <Label>Catalogue Title</Label>
                  <Input
                    placeholder="e.g. Vinayak Enterprises Official Product Catalogue 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Agar khali chhodenge to file ka name automatically use hoga.
                  </p>
                </div>

                <div>
                  <Label>Select PDF File *</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setSelectedFile(f);
                          if (!title) setTitle(f.name.replace(/\.pdf$/i, ''));
                        }
                      }}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-600 file:text-white
                        hover:file:bg-blue-700 cursor-pointer border rounded-md p-1 bg-white"
                      required
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-green-700 font-medium mt-1.5 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" /> Selected: {selectedFile.name} (
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {isUploading && uploadPercent > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-blue-700 font-semibold">
                      <span>Uploading to Cloud CDN...</span>
                      <span>{uploadPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                        style={{ width: `${uploadPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="text-xs text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="bg-blue-600 hover:bg-blue-700 font-semibold"
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {uploadPercent > 0 ? `Uploading... ${uploadPercent}%` : 'Uploading & Activating PDF...'}
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" /> Upload &amp; Set Live as Active Catalogue
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Tab 2: Direct PDF URL */}
            {activeTab === 'url' && (
              <form onSubmit={handleUrlSubmit} className="space-y-4 max-w-xl">
                <div>
                  <Label>Catalogue Title *</Label>
                  <Input
                    placeholder="e.g. Vinayak Enterprises Product Catalogue 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label>Direct PDF URL *</Label>
                  <Input
                    placeholder="https://res.cloudinary.com/.../catalogue.pdf"
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    className="mt-1 font-mono text-xs"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Paste Cloudinary, Google Drive direct link, or CDN hosted PDF URL.
                  </p>
                </div>

                <div>
                  <Label>Display Filename (Optional)</Label>
                  <Input
                    placeholder="e.g. Vinayak-Enterprises-Catalogue-2026.pdf"
                    value={directFilename}
                    onChange={(e) => setDirectFilename(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>

                {errorMsg && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="text-xs text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading || !directUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700 font-semibold"
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Save &amp; Set Live as Active Catalogue
                    </>
                  )}
                </Button>
              </form>
            )}
        </CardContent>
      </Card>

      {/* Catalogues Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Uploaded Catalogues</CardTitle>
            <CardDescription>
              {catalogues.length} catalogue{catalogues.length === 1 ? '' : 's'} found.{' '}
              {activeCatalogue ? (
                <span className="text-green-700 font-medium">
                  Active catalogue: &quot;{activeCatalogue.title}&quot;
                </span>
              ) : (
                <span className="text-amber-700 font-medium">No active catalogue selected</span>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : catalogues.length === 0 ? (
            <EmptyState message="No catalogues uploaded yet. Upload your first PDF catalogue above." />
          ) : (
            <div className="rounded-lg border bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catalogue Details</TableHead>
                    <TableHead>File Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogues.map((c) => (
                    <TableRow key={c._id} className={c.isActive ? 'bg-blue-50/30' : ''}>
                      <TableCell>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {c.title}
                          {c.isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">slug: {c.slug}</div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={c.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1 text-xs font-mono max-w-[200px] truncate"
                          title={c.file.url}
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{c.file.filename || 'catalogue.pdf'}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {c.isActive ? (
                          <Badge variant="success" className="bg-green-600 text-white font-medium">
                            Active Live
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary">Archived</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50"
                              onClick={() => activateMutation.mutate(c._id)}
                              disabled={activateMutation.isPending}
                            >
                              Set Live
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs font-medium">
                        {c.downloadCount} downloads
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {c.createdAt ? formatDate(c.createdAt) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button asChild variant="ghost" size="icon" title="Download PDF">
                            <a href={c.file.url} target="_blank" rel="noopener noreferrer" download>
                              <Download className="h-4 w-4 text-slate-600" />
                            </a>
                          </Button>
                          <Button asChild variant="ghost" size="icon" title="View in New Tab">
                            <a href={c.file.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 text-slate-600" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={() => {
                              if (window.confirm(`Delete catalogue "${c.title}"?`)) {
                                deleteMutation.mutate(c._id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
