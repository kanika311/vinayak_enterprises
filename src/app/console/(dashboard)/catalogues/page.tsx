'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadCloud, FileText, CheckCircle, Trash2, ExternalLink, Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner, EmptyState } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet, apiDelete } from '@/lib/api';
import api from '@/lib/api';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-catalogues'],
    queryFn: () => apiGet<{ catalogues: Catalogue[] }>('/catalogues'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/catalogues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-catalogues'] });
      queryClient.invalidateQueries({ queryKey: ['catalogues-public'] });
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a PDF file first.');
      return;
    }
    setErrorMsg('');
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (title.trim()) formData.append('title', title.trim());

      await api.post('/catalogues/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSelectedFile(null);
      setTitle('');
      setUploadSuccess(true);
      await queryClient.invalidateQueries({ queryKey: ['admin-catalogues'] });
      await queryClient.invalidateQueries({ queryKey: ['catalogues-public'] });
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to upload PDF. Please check connection and try again.';
      setErrorMsg(msg || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const catalogues = data?.catalogues || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catalogue Management"
        description="Upload product PDF catalogues. The active catalogue displays on the public website with interactive page turning."
      />

      {/* Upload PDF Section */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-blue-600" />
            Upload New Catalogue PDF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
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
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700 cursor-pointer"
                  required
                />
              </div>
              {selectedFile && (
                <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <Label>Catalogue Title (Optional)</Label>
              <Input
                placeholder="e.g. Vinayak Enterprises Product Catalogue 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
                {errorMsg}
              </div>
            )}

            {uploadSuccess && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Catalogue PDF uploaded and published successfully!
              </div>
            )}

            <Button type="submit" disabled={isUploading || !selectedFile} className="bg-blue-600 hover:bg-blue-700">
              {isUploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading PDF...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload &amp; Activate Catalogue
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Catalogues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Uploaded Catalogues</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : catalogues.length === 0 ? (
            <EmptyState message="No catalogues uploaded yet. Upload your first PDF catalogue above." />
          ) : (
            <div className="rounded-lg border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogues.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-semibold text-slate-900">{c.title}</TableCell>
                      <TableCell>
                        <a
                          href={c.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1 text-xs font-mono"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {c.file.filename || 'catalogue.pdf'}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.isActive ? 'success' : 'secondary'}>
                          {c.isActive ? 'Active Live' : 'Archived'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs">
                        {c.downloadCount} downloads
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="icon">
                            <a href={c.file.url} target="_blank" rel="noopener noreferrer" download>
                              <Download className="h-4 w-4 text-slate-500" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
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
