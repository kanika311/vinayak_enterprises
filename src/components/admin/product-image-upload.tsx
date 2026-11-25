'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  ImagePlus,
  Link2,
  Loader2,
  Trash2,
  Upload,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiUpload } from '@/lib/api';
import { compressImageToWebp } from '@/lib/client-compress';

export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

interface ProductImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  productName?: string;
}

export function ProductImageUpload({ images, onChange, productName }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ total: number; done: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    const validFiles = fileList.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed (JPG, PNG, WebP, GIF)');
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;
    setError('');
    setUploading(true);
    setUploadProgress({ total: validFiles.length, done: 0 });

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const compressed = await compressImageToWebp(file, 1600, 1600, 0.82);
        const result = await apiUpload<{ url: string; publicId?: string }>('/products/upload-image', compressed);
        setUploadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : null));
        return {
          url: result.url,
          publicId: result.publicId,
          alt: productName || file.name.replace(/\.[^/.]+$/, ''),
        };
      });

      const uploaded = await Promise.all(uploadPromises);
      if (uploaded.length) onChange([...images, ...uploaded]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message.includes('Cloudinary') ? `${message} — saved locally if server allows` : message);
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...images, { url, alt: productName || '' }]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const makeMainImage = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([target, ...remaining]);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="cursor-pointer"
          >
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-orange-600" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploadProgress
              ? `Uploading ${uploadProgress.done}/${uploadProgress.total} Photos...`
              : 'Upload Multiple Photos'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="cursor-pointer"
          >
            <Link2 className="mr-2 h-4 w-4" /> Add Image URL
          </Button>
        </div>
        {images.length > 0 && (
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            Total {images.length} {images.length === 1 ? 'photo' : 'photos'} added
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" onClick={addUrl}>
            Add
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Drag & Drop Upload Zone */}
      {images.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            isDragging
              ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
              : 'border-slate-300 bg-slate-50 hover:border-[#1a3a6b] hover:bg-blue-50/40'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center text-center p-4">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mb-2" />
              <span className="text-sm font-semibold text-slate-700">
                {uploadProgress
                  ? `Uploading ${uploadProgress.done} of ${uploadProgress.total} photos...`
                  : 'Uploading photos...'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center p-4">
              <ImagePlus className="h-10 w-10 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-700">
                Drag &amp; drop multiple photos here, or click to browse
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Supports multiple selection: JPG, PNG, WebP · First image will be the primary main photo
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {images.map((img, i) => (
              <div
                key={`${img.url}-${i}`}
                className={`relative group aspect-square rounded-xl border-2 overflow-hidden bg-slate-100 transition-all ${
                  i === 0 ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20' : 'border-slate-200'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Product image ${i + 1}`}
                  fill
                  className="object-contain p-1.5"
                  unoptimized={img.url.startsWith('/uploads/')}
                />

                {/* Main Image Badge */}
                {i === 0 ? (
                  <span className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    Main Photo
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeMainImage(i)}
                    className="absolute top-2 left-2 bg-white/90 hover:bg-white text-slate-800 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Set as main display photo"
                  >
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    Set Main
                  </button>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow cursor-pointer"
                  title="Delete this photo"
                  aria-label="Delete photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                {/* Reorder controls */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => moveImage(i, i - 1)}
                    className="text-white hover:text-orange-400 disabled:opacity-30 cursor-pointer"
                    title="Move left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-white font-mono px-1">{i + 1}</span>
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => moveImage(i, i + 1)}
                    className="text-white hover:text-orange-400 disabled:opacity-30 cursor-pointer"
                    title="Move right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add More button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50/30 flex flex-col items-center justify-center text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              ) : (
                <>
                  <ImagePlus className="h-7 w-7 mb-1" />
                  <span className="text-xs font-semibold">Add more</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        <Label className="text-xs">Tip:</Label> Pehla image (Main Photo) homepage, category lists aur product detail page par main preview dikhega. Visitors thumbnails par click karke baaki sabhi photos fullscreen zoom ke saath dekh sakte hain.
      </p>
    </div>
  );
}

