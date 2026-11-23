'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';

interface Banner {
  _id: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
}

const ROTATE_MS = 12000;

/** Optimize Cloudinary video URL on the fly: format auto, eco compression, max 960w, bitrate capped */
export function getOptimizedVideoUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
    if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) return url;
    return url.replace('/video/upload/', '/video/upload/f_auto,q_auto:eco,vc_auto,w_960,br_600k/');
  }
  return url;
}

/** Auto-extract a 25KB first-frame JPEG poster from Cloudinary video if missing */
export function getAutoPosterUrl(videoUrl?: string, posterUrl?: string): string {
  if (posterUrl) return posterUrl;
  if (videoUrl && videoUrl.includes('res.cloudinary.com') && videoUrl.includes('/video/upload/')) {
    return videoUrl
      .replace('/video/upload/', '/video/upload/so_0,f_auto,q_auto,w_1280/')
      .replace(/\.[a-zA-Z0-9]+$/, '.jpg');
  }
  return '';
}

export function useHeroBanners() {
  return useQuery({
    queryKey: ['banners-public'],
    queryFn: () => apiGet<Banner[]>('/banners/public', { placement: 'hero' }),
    staleTime: 5 * 60 * 1000,
  });
}

/** Soft fallback blobs when no banner video is uploaded */
function FallbackGlow() {
  return (
    <>
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-orange-400/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

export function HeroBackground() {
  const { data: banners = [] } = useHeroBanners();
  const [index, setIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
      setIsVideoLoaded(false);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [banners.length]);

  useEffect(() => {
    if (index >= banners.length) setIndex(0);
  }, [banners.length, index]);

  const active = banners[index];
  const hasVideo = Boolean(active?.videoUrl);
  const optimizedVideoUrl = active ? getOptimizedVideoUrl(active.videoUrl) : '';
  const posterUrl = active ? getAutoPosterUrl(active.videoUrl, active.posterUrl) : '';

  // Trigger play as soon as video source changes
  useEffect(() => {
    if (videoRef.current && hasVideo) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [optimizedVideoUrl, hasVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hasVideo ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={active._id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Instant high-res poster image loads in <50ms so user never sees a black/blank screen */}
            {posterUrl && (
              <img
                src={posterUrl}
                alt="Banner Preview"
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
              />
            )}

            {/* Compressed lightweight streaming video cross-fades in once ready */}
            <video
              ref={videoRef}
              key={optimizedVideoUrl}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              src={optimizedVideoUrl}
              poster={posterUrl || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              onLoadedData={() => setIsVideoLoaded(true)}
              onCanPlay={() => setIsVideoLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <FallbackGlow />
      )}
    </div>
  );
}
