'use client';

import { useEffect, useState } from 'react';
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

export function useHeroBanners() {
  return useQuery({
    queryKey: ['banners-public'],
    queryFn: () => apiGet<Banner[]>('/banners/public', { placement: 'hero' }),
    staleTime: 60_000,
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

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [banners.length]);

  useEffect(() => {
    if (index >= banners.length) setIndex(0);
  }, [banners.length, index]);

  const active = banners[index];
  const hasVideo = Boolean(active?.videoUrl);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hasVideo ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={active._id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <video
              key={active.videoUrl}
              className="absolute inset-0 h-full w-full object-cover object-center"
              src={active.videoUrl}
              poster={active.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <FallbackGlow />
      )}
    </div>
  );
}
