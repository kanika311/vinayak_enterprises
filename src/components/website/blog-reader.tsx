'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Maximize2,
  Minimize2,
  Search,
  CalendarDays,
  User,
  Clock,
  Eye,
  BookOpen,
  Sparkles,
  Check,
  Copy,
  MessageCircle,
  X,
  ArrowRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

// Fallback high-quality articles if database has only 1 or no blog yet
const FALLBACK_BLOGS: Blog[] = [
  {
    _id: 'fallback-1',
    title: 'Importance of Human Anatomy Models in Medical Education',
    slug: 'importance-of-human-anatomy-models-in-medical-education',
    category: 'Human Anatomy Model',
    tags: ['Anatomy', 'Medical Education', 'Colleges', 'Skeleton Models'],
    author: { name: 'Vinayak Enterprises Editorial & Technical Team' },
    views: 142,
    createdAt: '2026-11-19T10:00:00.000Z',
    publishedAt: '2026-11-19T10:00:00.000Z',
    status: 'published',
    excerpt:
      'Discover how human anatomy models enhance medical education, practical dissection knowledge, and hands-on diagnostic training for medical and nursing students.',
    content: `Human anatomy models are an indispensable foundation in modern medical, nursing, and biological education. They bridge the critical gap between two-dimensional textbook diagrams and three-dimensional clinical reality.

## 1. Tactile Learning and Spatial Understanding
Medical and biology students often struggle to visualize complex spatial relationships from flat diagrams alone. Anatomical models—such as life-size articulated skeletons, disarticulated skull models with magnetic removable calvaria, and multi-part torso models—enable students to touch, rotate, and physically examine internal organ placement.

## 2. Complementing Cadaveric Dissection
While cadaver dissection remains traditional, it comes with logistical hurdles, high recurring costs, ethical considerations, and limited availability. High-fidelity anatomical PVC and fiberglass models provide continuous, repeatable, year-round study opportunities without tissue degradation.

## 3. Patient Communication & Simulation
Beyond classrooms, anatomical models are vital in clinical consultations. Surgeons and physicians use desktop heart, eye, and spinal models to explain diagnoses, surgical procedures, and anatomical conditions clearly to patients and their families.

## Conclusion
Investing in durable, anatomically precise models elevates educational outcomes across schools, colleges, and healthcare training institutes nationwide.`,
  },
  {
    _id: 'fallback-2',
    title: 'How to Choose the Right Microscope for Educational & Research Labs',
    slug: 'how-to-choose-the-right-microscope-for-educational-and-research-labs',
    category: 'Microscopes',
    tags: ['Microscopes', 'Laboratory Equipment', 'Research', 'School Labs'],
    author: { name: 'Vinayak Enterprises Editorial & Technical Team' },
    views: 98,
    createdAt: '2026-11-14T10:00:00.000Z',
    publishedAt: '2026-11-14T10:00:00.000Z',
    status: 'published',
    excerpt:
      'A practical guide to selecting monocular, binocular, and digital USB microscopes for educational institutes, pathology laboratories, and university research.',
    content: `Selecting the right microscope requires evaluating the optical resolution, mechanical stage stability, illumination type, and user ergonomics for your specific curriculum or diagnostic workload.

## Monocular vs. Binocular Microscopes
For introductory school laboratories, sturdy monocular student microscopes provide robust durability and ease of use. However, for senior university students, pathology labs, and extended hours of research, binocular microscopes significantly reduce eye fatigue and provide stereo depth perception.

## Digital & USB Connectivity
Modern classrooms benefit tremendously from digital microscopes featuring HDMI or USB connectivity. Educators can broadcast high-resolution live specimen feeds directly to digital smartboards, facilitating group discussions and interactive digital image capture.

## Key Specifications to Check
- **Optical Glass & Objectives:** Look for achromatic or semi-plan objectives for sharp edge-to-edge clarity.
- **Illumination:** High-intensity LED cold lighting provides uniform brightness with minimal heat radiation.
- **Coaxial Focus:** Separate coarse and fine focusing controls ensure micro-level precision when examining cellular slides.`,
  },
  {
    _id: 'fallback-3',
    title: 'Standard Safety Guidelines & Best Practices for Chemistry Laboratories',
    slug: 'standard-safety-guidelines-for-chemistry-laboratories',
    category: 'Laboratory Equipment',
    tags: ['Chemistry', 'Safety', 'Lab Equipment', 'Guidelines'],
    author: { name: 'Vinayak Enterprises Editorial & Technical Team' },
    views: 76,
    createdAt: '2026-11-11T10:00:00.000Z',
    publishedAt: '2026-11-11T10:00:00.000Z',
    status: 'published',
    excerpt:
      'Essential safety precautions, storage guidelines, and equipment handling protocols every laboratory technician and educator should implement.',
    content: `Maintaining stringent safety standards in chemistry and biology laboratories protects students, educators, and laboratory infrastructure from accidents and chemical exposure.

## Proper Storage of Glassware & Apparatus
Borosilicate glassware, magnetic stirrers, and heating mantles must be regularly inspected for micro-cracks before thermal use. Broken or chipped glassware should be discarded immediately into designated sharps bins.

## Personal Protective Equipment (PPE)
Mandatory laboratory protocols require high-grade nitrile gloves, chemical splash goggles, and flame-retardant lab coats during all active experimentation.

## Ventilation & Fume Control
Volatile organic reagents and acid digestions must strictly be conducted inside certified fume hoods with appropriate exhaust air velocity to prevent toxic inhalation.`,
  },
];

function readingTime(text: string) {
  const words = (text || '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

interface BlogReaderProps {
  initialSlug?: string;
  initialBlogs?: Blog[];
}

export function BlogReader({ initialSlug, initialBlogs }: BlogReaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullWindow, setIsFullWindow] = useState(false);
  const [mobileTopicsOpen, setMobileTopicsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentTopRef = useRef<HTMLDivElement>(null);

  // Fetch blogs from API
  const { data, isLoading } = useQuery({
    queryKey: ['blogs-public', 'reader'],
    queryFn: () => apiGet<{ blogs: Blog[] }>('/blogs', { status: 'published', limit: 50 }),
    initialData: initialBlogs?.length ? { blogs: initialBlogs } : undefined,
    refetchOnMount: 'always',
  });

  // Display database blogs directly
  const allBlogs = useMemo(() => {
    return data?.blogs || [];
  }, [data?.blogs]);

  // Active blog state
  const [activeSlug, setActiveSlug] = useState<string>(() => initialSlug || '');

  // Keep activeSlug in sync once blogs load
  useEffect(() => {
    if (initialSlug) {
      setActiveSlug(initialSlug);
    } else if (!activeSlug && allBlogs.length > 0) {
      setActiveSlug(allBlogs[0].slug);
    }
  }, [initialSlug, allBlogs, activeSlug]);

  // Current active blog object
  const activeBlog = useMemo(() => {
    if (!allBlogs.length) return null;
    return allBlogs.find((b) => b.slug === activeSlug) || allBlogs[0];
  }, [allBlogs, activeSlug]);

  const currentIndex = useMemo(() => {
    if (!activeBlog) return 0;
    return allBlogs.findIndex((b) => b.slug === activeBlog.slug);
  }, [allBlogs, activeBlog]);

  // Filtered list for search
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allBlogs;
    return allBlogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [allBlogs, searchQuery]);

  // Switch active blog smoothly
  const handleSelectBlog = (slug: string) => {
    setActiveSlug(slug);
    setMobileTopicsOpen(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/blog/${slug}`);
      contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleSelectBlog(allBlogs[currentIndex - 1].slug);
    }
  };

  const handleNext = () => {
    if (currentIndex < allBlogs.length - 1) {
      handleSelectBlog(allBlogs[currentIndex + 1].slug);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator?.share && activeBlog) {
      try {
        await navigator.share({
          title: activeBlog.title,
          text: activeBlog.excerpt || activeBlog.title,
          url: currentUrl,
        });
      } catch {
        setShareOpen(!shareOpen);
      }
    } else {
      setShareOpen(!shareOpen);
    }
  };

  if (isLoading && allBlogs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 text-slate-500">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Loading knowledge journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 pt-5">
        <div className="flex gap-6 items-start relative">
          {/* ========================================================= */}
          {/* LEFT PANEL: TOPICS / BLOGS LIST (STICKY)                  */}
          {/* ========================================================= */}
          <aside
            className={`
              transition-all duration-300
              ${isFullWindow ? 'hidden' : 'hidden lg:block'}
              lg:w-80 xl:w-96 shrink-0
              sticky top-20 z-10
              h-[calc(100vh-6rem)]
            `}
          >
            <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-4">
              {/* Header */}
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-orange-600 uppercase mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  <span>Scientific Journal</span>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Blogs</h2>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                    {allBlogs.length}
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search article titles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Topics List with Custom Scrollbar */}
              <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 custom-scrollbar">
                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No articles found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredBlogs.map((b) => {
                    const isActive = activeBlog?.slug === b.slug;
                    return (
                      <button
                        key={b._id || b.slug}
                        onClick={() => handleSelectBlog(b.slug)}
                        className={`
                          w-full text-left p-3.5 rounded-xl border transition-all text-xs relative block group
                          ${
                            isActive
                              ? 'bg-sky-50/90 border-sky-300 text-sky-950 shadow-sm'
                              : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 text-slate-700'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase ${
                              isActive ? 'text-sky-700' : 'text-blue-600'
                            }`}
                          >
                            {b.category || 'Article'}
                          </span>
                          {isActive && (
                            <span className="h-2 w-2 rounded-full bg-sky-500 ring-4 ring-sky-100" />
                          )}
                        </div>

                        <h3
                          className={`font-bold line-clamp-2 leading-snug ${
                            isActive ? 'text-slate-950' : 'text-slate-800 group-hover:text-blue-600'
                          }`}
                        >
                          {b.title}
                        </h3>

                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(b.publishedAt || b.createdAt)}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MOBILE TOPICS DRAWER MODAL                                */}
          {/* ========================================================= */}
          <AnimatePresence>
            {mobileTopicsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-start"
                onClick={() => setMobileTopicsOpen(false)}
              >
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="w-80 max-w-[85vw] h-full bg-white p-4 shadow-2xl flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">
                        Scientific Journal
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">Articles &amp; Topics</h3>
                    </div>
                    <button
                      onClick={() => setMobileTopicsOpen(false)}
                      className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative mt-3 mb-2">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="search"
                      placeholder="Search article titles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 custom-scrollbar">
                    {filteredBlogs.map((b) => {
                      const isActive = activeBlog?.slug === b.slug;
                      return (
                        <button
                          key={b._id || b.slug}
                          onClick={() => handleSelectBlog(b.slug)}
                          className={`w-full text-left p-3 rounded-xl border text-xs block ${
                            isActive
                              ? 'bg-sky-50 border-sky-300 text-sky-950 font-semibold'
                              : 'bg-white border-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase text-blue-600 block mb-0.5">
                            {b.category || 'Article'}
                          </span>
                          <span className="font-bold line-clamp-2">{b.title}</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {formatDate(b.publishedAt || b.createdAt)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================= */}
          {/* MAIN READING AREA                                         */}
          {/* ========================================================= */}
          <main className="flex-1 min-w-0" ref={contentTopRef}>
            {/* Top Sticky Bar */}
            <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-sm mb-5 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Left Controls: Prev, Next, Full Window */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentIndex <= 0}
                    className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-slate-200"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentIndex >= allBlogs.length - 1}
                    className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-slate-200"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullWindow(!isFullWindow)}
                    className="hidden lg:inline-flex h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    title={isFullWindow ? 'Show sidebar' : 'Full window'}
                  >
                    {isFullWindow ? (
                      <>
                        <Minimize2 className="h-3.5 w-3.5 mr-1.5" /> Split View
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3.5 w-3.5 mr-1.5" /> Full Window
                      </>
                    )}
                  </Button>

                  {/* Mobile Topics Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMobileTopicsOpen(true)}
                    className="lg:hidden h-8 px-2.5 text-xs text-blue-700 border-blue-200 bg-blue-50/50"
                  >
                    <Menu className="h-3.5 w-3.5 mr-1" /> Topics ({allBlogs.length})
                  </Button>
                </div>

                {/* Right Controls: Share Button */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleNativeShare}
                    className="h-8 px-3 text-xs text-slate-700 hover:text-[#1a3a6b] border-slate-200 hover:border-slate-300"
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1.5 text-blue-600" /> Share
                  </Button>

                  {/* Share Popover */}
                  {shareOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1">
                        Share Article
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy Link
                        </span>
                        {copied ? (
                          <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Copied!
                          </span>
                        ) : null}
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          (activeBlog?.title || 'Check this article') + ' - ' + currentUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg hover:bg-green-50 text-green-700 font-medium"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-green-600" /> Share via WhatsApp
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          activeBlog?.title || ''
                        )}&url=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        <span className="font-bold text-xs">𝕏</span> Share on Twitter/X
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          currentUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg hover:bg-blue-50 text-blue-700 font-medium"
                      >
                        <span className="font-bold text-xs">in</span> Share on LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Breadcrumb row */}
              {activeBlog && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100 overflow-x-auto whitespace-nowrap">
                  <Link href="/" className="hover:text-blue-600">
                    Home
                  </Link>
                  <span>&gt;</span>
                  <Link href="/blog" className="hover:text-blue-600">
                    Blogs
                  </Link>
                  {activeBlog.category && (
                    <>
                      <span>&gt;</span>
                      <span className="text-slate-700 font-medium">{activeBlog.category}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Active Blog Article */}
            {activeBlog ? (
              <motion.article
                key={activeBlog.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* HERO CARD: Photo on left, Details on right (as in image) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
                    {/* Left: Photo / Illustration */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-100 border border-slate-100 flex items-center justify-center">
                      {activeBlog.featuredImage?.url ? (
                        <Image
                          src={activeBlog.featuredImage.url}
                          alt={activeBlog.title}
                          fill
                          className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                          unoptimized={activeBlog.featuredImage.url.startsWith('/uploads/')}
                          priority
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <BookOpen className="h-20 w-20 text-[#1a3a6b]/20" strokeWidth={1.2} />
                          <span className="text-xs text-slate-400 mt-2 font-medium">
                            Scientific Instruments Journal
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Title & Meta Info */}
                    <div>
                      {activeBlog.category && (
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full mb-3">
                          {activeBlog.category}
                        </span>
                      )}

                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-serif leading-tight tracking-tight">
                        {activeBlog.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-500 mt-5 pt-5 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          {formatDate(activeBlog.publishedAt || activeBlog.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-4 w-4 text-blue-600" />
                          By {activeBlog.author?.name && activeBlog.author.name !== 'Super Admin' ? activeBlog.author.name : 'Vinayak Enterprises Editorial & Technical Team'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-blue-600" />
                          {readingTime(activeBlog.content)} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION / BODY CARD */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm">
                  {/* Lead excerpt */}
                  {activeBlog.excerpt && (
                    <div className="mb-8 p-4 sm:p-5 rounded-xl bg-blue-50/60 border-l-4 border-[#1a3a6b] text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
                      {activeBlog.excerpt}
                    </div>
                  )}

                  {/* Formatted Content */}
                  <div className="prose prose-slate max-w-none space-y-5 text-slate-700 leading-relaxed text-base sm:text-[17px]">
                    {activeBlog.content.split(/\n\s*\n/).map((para, i) => {
                      const trimmed = para.trim();
                      if (trimmed.startsWith('## ')) {
                        return (
                          <h2
                            key={i}
                            className="text-xl sm:text-2xl font-bold text-[#1a3a6b] pt-5 pb-1 border-b border-slate-100 tracking-tight"
                          >
                            {trimmed.replace(/^##\s+/, '')}
                          </h2>
                        );
                      }
                      if (trimmed.startsWith('### ')) {
                        return (
                          <h3 key={i} className="text-lg sm:text-xl font-bold text-slate-900 pt-3">
                            {trimmed.replace(/^###\s+/, '')}
                          </h3>
                        );
                      }
                      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                        const items = trimmed.split('\n').filter(Boolean);
                        return (
                          <ul key={i} className="space-y-1.5 my-3 pl-5 list-disc marker:text-blue-600">
                            {items.map((it, idx) => (
                              <li key={idx} className="text-slate-700">
                                {it.replace(/^[-*]\s+/, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={i} className="text-slate-700 leading-8">
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>

                  {/* Tags */}
                  {activeBlog.tags && activeBlog.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                        Tags:
                      </span>
                      {activeBlog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author Credentials & Verification Card */}
                  <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-full bg-[#1a3a6b] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow">
                      VE
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          Vinayak Enterprises Editorial &amp; Technical Team
                        </h4>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Verified Industry Specialist
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Authored and fact-checked by the scientific instrument engineers and anatomy model specialists at Vinayak Enterprises (Ambala Cantt, Haryana). Reviewing equipment durability, anatomical accuracy, and lab safety protocols for Indian educational institutions.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Next/Prev Card Navigation */}
                  <div className="grid sm:grid-cols-2 gap-4 mt-10 pt-8 border-t border-slate-100">
                    {currentIndex > 0 ? (
                      <button
                        onClick={handlePrev}
                        className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
                      >
                        <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mb-1">
                          <ChevronLeft className="h-3.5 w-3.5" /> Previous Article
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-blue-700">
                          {allBlogs[currentIndex - 1].title}
                        </h4>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentIndex < allBlogs.length - 1 && (
                      <button
                        onClick={handleNext}
                        className="text-right p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all group sm:col-start-2"
                      >
                        <span className="text-[11px] font-bold text-blue-600 flex items-center justify-end gap-1 mb-1">
                          Next Article <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-blue-700">
                          {allBlogs[currentIndex + 1].title}
                        </h4>
                      </button>
                    )}
                  </div>

                  {/* Institutional / Bulk Procurement CTA */}
                  <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#1a3a6b] to-[#1e4a8a] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base">
                        Need Scientific Instruments or Anatomy Models?
                      </h4>
                      <p className="text-xs text-blue-200 mt-1 max-w-lg">
                        Vinayak Enterprises supplies high-precision laboratory equipment and teaching models to schools, medical colleges, and research institutes across India.
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button asChild size="sm" variant="accent">
                        <Link href="/request-quote">Request Quote</Link>
                      </Button>
                      <Button asChild size="sm" variant="heroOutline">
                        <Link href="/contact">Contact Sales</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ) : (
              <div className="bg-white rounded-2xl border p-12 text-center text-slate-400">
                <p>No blog post selected.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default BlogReader;
