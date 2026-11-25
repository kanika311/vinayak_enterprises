'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, X, ExternalLink, ShieldCheck, MessageCircle, FileText, ArrowRight, RotateCcw } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { getWebpPosterUrl, getYouTubeEmbedUrl, extractYouTubeId, getOptimizedVideoUrl } from '@/lib/utils';
import { SITE } from '@/lib/constants';
import { whatsappChatUrl } from '@/lib/site-contact';
import type { ShowcaseVideo } from '@/types';

// Curated fallback videos if database is momentarily empty
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
  'General',
] as const;

export function VideosClientPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<ShowcaseVideo | null>(null);

  const { data: dbVideos, isLoading } = useQuery({
    queryKey: ['videos-public'],
    queryFn: () => apiGet<ShowcaseVideo[]>('/videos/public'),
    staleTime: 5 * 60 * 1000,
  });

  const allVideos = (dbVideos && dbVideos.length > 0) ? dbVideos : CURATED_DEFAULT_VIDEOS;

  const filteredVideos = allVideos.filter((v) => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      v.title.toLowerCase().includes(query) ||
      (v.description && v.description.toLowerCase().includes(query)) ||
      (v.category && v.category.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const handleOpenVideo = (video: ShowcaseVideo) => {
    setActiveVideo(video);
    if (video._id && !video._id.startsWith('sample-')) {
      apiPost(`/videos/${video._id}/view`, {}).catch(() => {});
    }
  };

  const getWhatsAppLink = (video: ShowcaseVideo) => {
    const msg = `Namaste Vinayak Enterprises! Maine aapki website par "${video.title}" ka demonstration video dekha. Is equipment ki specification, bulk pricing aur availability share kijiye.`;
    return whatsappChatUrl(SITE.whatsapp, msg);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. HERO HEADER */}
      <div className="bg-[#1a3a6b] text-white py-12 md:py-16 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-blue-200 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-orange-400 font-semibold">Videos</span>
          </nav>

          <span className="inline-block bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 shadow uppercase tracking-wider">
            All Demonstration Videos
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Equipment Demonstrations &amp; Walkthroughs
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Browse our full library of product demonstrations, anatomical model assembly reels, research microscopes, and hospital training apparatus.
          </p>

          {/* Quick Stats in Header */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> High-Definition 1080p
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              🔬 Medical &amp; Science Lab Gear
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              🇮🇳 Ambala Cantt Direct Manufacturing
            </span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos by name or equipment..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] bg-slate-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1a3a6b] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. VIDEO GRID & COUNT */}
      <div className="container mx-auto px-4 mt-8">
        {/* Count & Status */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Showing <strong className="text-slate-900 font-bold">{filteredVideos.length}</strong> {filteredVideos.length === 1 ? 'video' : 'videos'}
            {selectedCategory !== 'All' && <span> in <span className="text-orange-600 font-bold">&quot;{selectedCategory}&quot;</span></span>}
            {searchQuery && <span> matching <span className="text-[#1a3a6b] font-bold">&quot;{searchQuery}&quot;</span></span>}
          </p>

          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Video Cards Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, idx) => (
              <motion.div
                key={video._id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Video Preview Box */}
                <div
                  onClick={() => handleOpenVideo(video)}
                  className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={video.posterUrl || getWebpPosterUrl(video.videoUrl)}
                    alt={`${video.title} demonstration video - Vinayak Enterprises`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none group-hover:from-black/85 transition-colors" />

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block bg-white/95 backdrop-blur-md text-[#1a3a6b] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {video.category}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                    <span className="inline-block bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                      ⏱ {video.duration || '1:45'}
                    </span>
                  </div>

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-13 h-13 rounded-full bg-white/95 text-[#1a3a6b] shadow-2xl flex items-center justify-center group-hover:scale-115 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Bottom Video Spec Tag */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-[11px] text-white/95 font-medium">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>HD 1080p · Click to Play</span>
                    </div>
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      onClick={() => handleOpenVideo(video)}
                      className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors"
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenVideo(video)}
                      className="text-xs font-bold text-[#1a3a6b] hover:text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-all cursor-pointer"
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
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <span className="text-5xl block mb-3">🎬</span>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Videos Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              We couldn&apos;t find any equipment demonstration matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a3a6b] text-white rounded-xl text-xs font-bold hover:bg-[#12284c] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> View All Videos
            </button>
          </div>
        )}
      </div>

      {/* 4. BOTTOM INSTITUTIONAL ASSISTANCE BOX */}
      <div className="container mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2563eb] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-wider block mb-1">
              Custom Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Need a Custom Video Demonstration?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Medical colleges, universities, and institutions can request custom video walkthroughs of any specific apparatus, dissection model, or microscope before issuing tender purchase orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/request-quote"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-colors inline-flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Request Official Quote
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                'Namaste Vinayak Enterprises! Mujhe scientific equipment / anatomy model ke specific live demonstration video ki requirement hai. Kripya details share karein.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Demo Request
            </a>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE VIDEO PLAYBACK MODAL */}
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
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
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
                    <Link
                      href={`/request-quote?product=${encodeURIComponent(activeVideo.title)}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#1a3a6b] hover:bg-[#152e55] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5" /> Request Quote
                    </Link>
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
    </div>
  );
}
