'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ExternalLink, ShieldCheck, MessageCircle, FileText } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { getWebpPosterUrl, getYouTubeEmbedUrl, extractYouTubeId } from '@/lib/utils';
import { SITE } from '@/lib/constants';
import { whatsappChatUrl } from '@/lib/site-contact';
import type { ShowcaseVideo } from '@/types';

// Curated demo videos to ensure high visual quality out of the box
const CURATED_DEFAULT_VIDEOS: ShowcaseVideo[] = [
  {
    _id: 'sample-video-1',
    title: 'Vilakshan Netra Binocular Research Microscope Demonstration',
    description: 'High-power 1600x magnification walkthrough with quadruple revolving nosepiece, LED illumination and mechanical stage control for medical colleges.',
    videoUrl: 'https://res.cloudinary.com/dd29usied/video/upload/v1785066120/showcase_videos/microscope_demo.mp4',
    posterUrl: 'https://res.cloudinary.com/dd29usied/image/upload/f_webp,q_auto,w_800/v1785065986/products/catalog/tljlusfoz45gowdaxczk.webp',
    category: 'Microscopes',
    duration: '2:15',
    isFeatured: true,
    isActive: true,
    order: 1,
    views: 428,
  },
  {
    _id: 'sample-video-2',
    title: 'Full Size Articulated Human Skeleton Assembly & Joint Movement',
    description: 'Life-size 5 ft 2 in medical PVC skeleton demonstration featuring removable skull, articulated limbs, and flexible spinal column for anatomy classrooms.',
    videoUrl: 'https://res.cloudinary.com/dd29usied/video/upload/v1785066125/showcase_videos/skeleton_demo.mp4',
    posterUrl: 'https://res.cloudinary.com/dd29usied/image/upload/f_webp,q_auto,w_800/v1785065974/products/catalog/l4zckbklllzijum1ehbq.webp',
    category: 'Anatomy Models',
    duration: '1:50',
    isFeatured: true,
    isActive: true,
    order: 2,
    views: 312,
  },
  {
    _id: 'sample-video-3',
    title: 'Adult CPR Training Manikin Chest Compression & AED Simulation',
    description: 'Hands-on BLS/ACLS training walkthrough demonstrating compression depth feedback, airway management, and realistic chest rise.',
    videoUrl: 'https://res.cloudinary.com/dd29usied/video/upload/v1785066130/showcase_videos/cpr_demo.mp4',
    posterUrl: 'https://res.cloudinary.com/dd29usied/image/upload/f_webp,q_auto,w_800/v1785066000/products/catalog/hyvmsc0zmm5cdar6jg4z.webp',
    category: 'CPR Manikins',
    duration: '2:40',
    isFeatured: true,
    isActive: true,
    order: 3,
    views: 589,
  },
  {
    _id: 'sample-video-4',
    title: 'Laboratory Water Distillation Unit & Borosilicate Glassware Setup',
    description: 'Demonstration of stainless steel double distillation apparatus and precision lab glassware engineered for chemistry and pharmacy research.',
    videoUrl: 'https://res.cloudinary.com/dd29usied/video/upload/v1785066135/showcase_videos/lab_distillation_demo.mp4',
    posterUrl: 'https://res.cloudinary.com/dd29usied/image/upload/f_webp,q_auto,w_800/v1785066014/products/catalog/fng8fr7vhlxf7cfgg9aw.webp',
    category: 'Lab Equipment',
    duration: '1:35',
    isFeatured: true,
    isActive: true,
    order: 4,
    views: 264,
  },
];

const CATEGORY_TABS = [
  'All',
  'Microscopes',
  'Anatomy Models',
  'CPR Manikins',
  'Lab Equipment',
] as const;

export function VideoShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<ShowcaseVideo | null>(null);

  const { data: dbVideos } = useQuery({
    queryKey: ['videos-public'],
    queryFn: () => apiGet<ShowcaseVideo[]>('/videos/public'),
    staleTime: 5 * 60 * 1000,
  });

  const allVideos = (dbVideos && dbVideos.length > 0) ? dbVideos : CURATED_DEFAULT_VIDEOS;

  const filteredVideos =
    selectedCategory === 'All'
      ? allVideos
      : allVideos.filter((v) => v.category === selectedCategory);

  const handleOpenVideo = (video: ShowcaseVideo) => {
    setActiveVideo(video);
    // Track view asynchronously if it has a real DB ID
    if (video._id && !video._id.startsWith('sample-')) {
      apiPost(`/videos/${video._id}/view`, {}).catch(() => {});
    }
  };

  const getWhatsAppLink = (video: ShowcaseVideo) => {
    const msg = `Namaste Vinayak Enterprises! Maine aapki website par "${video.title}" ka demonstration video dekha. Is equipment ki specification, bulk pricing aur availability share kijiye.`;
    return whatsappChatUrl(SITE.whatsapp, msg);
  };

  return (
    <section
      className="py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80 relative overflow-hidden"
      aria-labelledby="videos-heading"
    >
      {/* Decorative gradient glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2
            id="videos-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Videos
          </h2>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm ${
                selectedCategory === cat
                  ? 'bg-[#1a3a6b] text-white shadow-blue-900/20 shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video, idx) => {
            const poster = video.posterUrl || getWebpPosterUrl(video.videoUrl);
            return (
              <motion.div
                key={video._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Poster / Video Thumbnail with Play Button */}
                <div
                  onClick={() => handleOpenVideo(video)}
                  className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                >
                  {poster ? (
                    <img
                      src={poster}
                      alt={`${video.title} demonstration video - Vinayak Enterprises`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <Play className="w-10 h-10" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block bg-white/90 backdrop-blur-md text-[#1a3a6b] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {video.category}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="inline-block bg-black/75 backdrop-blur-md text-white text-[11px] font-mono px-2 py-0.5 rounded shadow">
                      ⏱ {video.duration || '1:30'}
                    </span>
                  </div>

                  {/* Glowing Animated Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 text-[#1a3a6b] shadow-2xl flex items-center justify-center group-hover:scale-115 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <Play className="w-6 h-6 ml-1 fill-current" />
                    </div>
                  </div>

                  {/* WebP badge */}
                  <div className="absolute bottom-2 left-2.5 z-10 flex items-center gap-1 text-[10px] text-white/90 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HD 1080p · WebP</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      onClick={() => handleOpenVideo(video)}
                      className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-[#1a3a6b] cursor-pointer transition-colors"
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenVideo(video)}
                      className="text-xs font-bold text-[#1a3a6b] hover:text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                    >
                      Watch Video →
                    </button>
                    <a
                      href={getWhatsAppLink(video)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
                      title="Ask quote for this video on WhatsApp"
                      aria-label="Ask on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-emerald-100" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Video Playback Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-4 border-b bg-slate-50/90">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1a3a6b] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {activeVideo.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">⏱ {activeVideo.duration || '1:30'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
                  aria-label="Close video player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player Box */}
              <div className="aspect-video bg-black relative w-full overflow-hidden">
                {extractYouTubeId(activeVideo.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeVideo.videoUrl) || ''}
                    title={activeVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    poster={activeVideo.posterUrl || getWebpPosterUrl(activeVideo.videoUrl)}
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Video Info & CTAs */}
              <div className="p-5 overflow-y-auto space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {activeVideo.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-[#1a3a6b]">Bulk Inquiry / Institutional Supply</p>
                    <p className="text-slate-500">Manufactured at Ambala, Haryana · GST Invoice · Pan-India Dispatch</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`/request-quote?product=${encodeURIComponent(activeVideo.title)}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#1a3a6b] hover:bg-[#152e55] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5" /> Request Quote
                    </a>
                    <a
                      href={getWhatsAppLink(activeVideo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
