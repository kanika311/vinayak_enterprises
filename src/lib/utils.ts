import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

/** Extract YouTube Video ID from any standard or short URL */
export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

/** Convert any YouTube URL to safe responsive embed URL */
export function getYouTubeEmbedUrl(url?: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
}

/** Convert Cloudinary image URLs to modern WebP with auto quality */
export function getWebpImageUrl(url?: string, width?: number): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    if (url.includes('/upload/f_webp')) return url;
    const transform = width ? `f_webp,q_auto,w_${width}` : 'f_webp,q_auto';
    return url.replace('/image/upload/', `/image/upload/${transform}/`).replace(/\.[a-zA-Z0-9]+$/, '.webp');
  }
  return url;
}

/** Automatically get a high-quality WebP/JPEG poster for Cloudinary or YouTube videos */
export function getWebpPosterUrl(videoUrl?: string, posterUrl?: string): string {
  if (posterUrl) {
    // If the saved poster has a black 0s frame (so_0), automatically upgrade to 1.5s frame
    if (posterUrl.includes('res.cloudinary.com') && (posterUrl.includes('/so_0,') || posterUrl.includes('/so_0/'))) {
      return posterUrl
        .replace('/video/upload/so_0,f_webp', '/video/upload/so_1.5,f_auto')
        .replace('/video/upload/so_0/', '/video/upload/so_1.5,f_auto,q_auto,w_800/')
        .replace(/\.[a-zA-Z0-9]+$/, '.jpg');
    }
    return getWebpImageUrl(posterUrl, 800);
  }
  if (videoUrl) {
    if (videoUrl.includes('res.cloudinary.com') && videoUrl.includes('/video/upload/')) {
      // Snapshot frame at 1.5s so we never get a black opening frame (so_1.5)
      if (videoUrl.includes('/upload/so_')) return videoUrl;
      return videoUrl
        .replace('/video/upload/', '/video/upload/so_1.5,f_auto,q_auto,w_800/')
        .replace(/\.[a-zA-Z0-9]+$/, '.jpg');
    }
    const ytId = extractYouTubeId(videoUrl);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }
  return '';
}

/** Optimize Cloudinary streaming video */
export function getOptimizedVideoUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
    if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) return url;
    return url.replace('/video/upload/', '/video/upload/f_auto,q_auto:eco,vc_auto,w_1280/');
  }
  return url;
}
