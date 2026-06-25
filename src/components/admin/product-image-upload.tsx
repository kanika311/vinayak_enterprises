'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiUpload } from '@/lib/api';

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
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    setUploading(true);

    try {
      const uploaded: ProductImage[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed (JPG, PNG, WebP, GIF)');
          continue;
        }
        const result = await apiUpload<{ url: string; publicId?: string }>('/products/upload-image', file);
        uploaded.push({ url: result.url, publicId: result.publicId, alt: productName || file.name });
      }
      if (uploaded.length) onChange([...images, ...uploaded]);
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
    onChange([...images, { url, alt: productName || '' }]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
        <Button type="button" variant="outline" onClick={() => setShowUrlInput(!showUrlInput)}>
          <Link2 className="mr-2 h-4 w-4" /> Add Image URL
        </Button>
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
          <Button type="button" onClick={addUrl}>Add</Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#1a3a6b] hover:bg-blue-50/50 transition-colors"
        >
          <ImagePlus className="h-10 w-10 text-slate-300 mb-2" />
          <span className="text-sm text-slate-500">Click to upload product images</span>
          <span className="text-xs text-slate-400 mt-1">JPG, PNG, WebP · First image is the main photo</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={`${img.url}-${i}`} className="relative group aspect-square rounded-lg border overflow-hidden bg-slate-100">
              <Image src={img.url} alt={img.alt || `Product image ${i + 1}`} fill className="object-cover" unoptimized={img.url.startsWith('/uploads/')} />
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-[#1a3a6b] text-white text-[10px] font-bold px-2 py-0.5 rounded">Main</span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#1a3a6b] hover:text-[#1a3a6b]"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs mt-1">Add more</span>
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        <Label className="text-xs">Tip:</Label> The first image appears on the product page and listing cards.
      </p>
    </div>
  );
}
