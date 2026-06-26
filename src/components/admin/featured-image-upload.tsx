'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiUpload } from '@/lib/api';

export interface FeaturedImage {
  url: string;
  publicId?: string;
}

interface FeaturedImageUploadProps {
  value?: FeaturedImage | null;
  onChange: (image: FeaturedImage | null) => void;
  /** API endpoint to upload to. Defaults to the blog image endpoint. */
  endpoint?: string;
}

export function FeaturedImageUpload({ value, onChange, endpoint = '/blogs/upload-image' }: FeaturedImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed (JPG, PNG, WebP, GIF)');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const result = await apiUpload<{ url: string; publicId?: string }>(endpoint, file);
      onChange({ url: result.url, publicId: result.publicId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message.includes('Cloudinary') ? `${message} — saved locally if server allows` : message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onChange({ url });
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {uploading ? 'Uploading...' : value ? 'Replace Image' : 'Upload Image'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setShowUrlInput(!showUrlInput)}>
          <Link2 className="mr-2 h-4 w-4" /> Add Image URL
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" onClick={addUrl}>Add</Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value?.url ? (
        <div className="relative group w-full max-w-sm aspect-video rounded-lg border overflow-hidden bg-slate-100">
          <Image
            src={value.url}
            alt="Featured"
            fill
            className="object-cover"
            unoptimized={value.url.startsWith('/uploads/')}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove image"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full max-w-sm h-36 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#1a3a6b] hover:bg-blue-50/50 transition-colors"
        >
          <ImagePlus className="h-9 w-9 text-slate-300 mb-2" />
          <span className="text-sm text-slate-500">Click to upload a featured image</span>
          <span className="text-xs text-slate-400 mt-1">JPG, PNG, WebP · shown on blog cards & post header</span>
        </button>
      )}
    </div>
  );
}
