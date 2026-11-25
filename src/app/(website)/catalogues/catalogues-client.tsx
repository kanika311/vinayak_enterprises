'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
  Download,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  Check,
  Copy,
  FileText,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet, apiPost } from '@/lib/api';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';

export interface Catalogue {
  _id: string;
  title: string;
  slug: string;
  file: { url: string; filename?: string; publicId?: string };
  pageCount?: number;
  downloadCount: number;
  isActive: boolean;
}

interface CataloguesClientProps {
  initialCatalogue?: Catalogue | null;
}

// Realistic synthesized paper turning sound (zero external audio dependencies)
function playPageFlipSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const bufferSize = Math.floor(ctx.sampleRate * 0.2); // 200ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      const env = t < 0.1 ? t / 0.1 : Math.pow(1 - t, 2);
      channelData[i] = (Math.random() * 2 - 1) * env;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.18);
    filter.Q.value = 1.3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.32, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.19);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
  } catch {
    // Audio context not allowed before first gesture
  }
}

// Convert Cloudinary PDF URL into high-resolution, bandwidth-optimized page image
function getCloudinaryPageUrl(url: string, page: number, isMobile = false): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) {
    // Mobile uses w_800 for 3x faster load time and 60% lower payload
    const width = isMobile ? 'w_800' : 'w_1000';
    return url
      .replace('/image/upload/', `/image/upload/pg_${page},f_auto,q_auto:good,${width}/`)
      .replace(/\.pdf($|\?)/i, '.jpg$1');
  }
  return url;
}

export function CataloguesClient({ initialCatalogue }: CataloguesClientProps) {
  const { site } = useSiteContact();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [pageLoading, setPageLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);
  const preloadedUrls = useRef<Set<string>>(new Set());

  // Screen size listener for mobile optimization
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch active catalogue with SSR initialData for ZERO waiting time
  const { data, isLoading } = useQuery({
    queryKey: ['catalogues-public'],
    queryFn: () => apiGet<{ catalogues: Catalogue[] }>('/catalogues'),
    initialData: initialCatalogue ? { catalogues: [initialCatalogue] } : undefined,
  });

  const activeCatalogue =
    data?.catalogues?.find((c) => c.isActive) || initialCatalogue || data?.catalogues?.[0];
  const fileUrl = activeCatalogue?.file?.url;
  const isCloudinaryPdf =
    !!fileUrl && fileUrl.includes('res.cloudinary.com') && /\.pdf($|\?)/i.test(fileUrl);

  const totalPages =
    activeCatalogue?.pageCount && activeCatalogue.pageCount > 1
      ? activeCatalogue.pageCount
      : 11;

  // Touch swipe handling for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    setTouchStartX(null);
  };

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < totalPages) {
          setFlipDirection('next');
          playPageFlipSound();
          setPageLoading(true);
          setCurrentPage((p) => Math.min(totalPages, p + 1));
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) {
          setFlipDirection('prev');
          playPageFlipSound();
          setPageLoading(true);
          setCurrentPage((p) => Math.max(1, p - 1));
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentPage, totalPages]);

  // Aggressive Background Preloading: Preload current, next 2 pages, and previous page
  useEffect(() => {
    if (!fileUrl || !isCloudinaryPdf) return;

    const preloadPage = (pg: number) => {
      if (pg < 1 || pg > totalPages) return;
      const pUrl = getCloudinaryPageUrl(fileUrl, pg, isMobile);
      if (!pUrl || preloadedUrls.current.has(pUrl)) return;
      preloadedUrls.current.add(pUrl);
      const img = new Image();
      img.src = pUrl;
    };

    preloadPage(currentPage);
    preloadPage(currentPage + 1);
    preloadPage(currentPage + 2);
    if (currentPage > 1) {
      preloadPage(currentPage - 1);
    }
  }, [currentPage, fileUrl, isCloudinaryPdf, totalPages, isMobile]);

  // Track and trigger file download
  const handleDownload = () => {
    if (!fileUrl) return;

    if (activeCatalogue?._id) {
      apiPost(`/catalogues/${activeCatalogue._id}/download`, {}).catch(() => {});
    }

    const downloadUrl = fileUrl.includes('res.cloudinary.com')
      ? fileUrl.replace('/image/upload/', '/image/upload/fl_attachment/')
      : fileUrl;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = activeCatalogue?.file?.filename || 'Vinayak-Enterprises-Product-Catalogue.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Turn page handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setFlipDirection('prev');
      playPageFlipSound();
      setPageLoading(true);
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setFlipDirection('next');
      playPageFlipSound();
      setPageLoading(true);
      setCurrentPage((p) => p + 1);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
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

  const bulkWhatsAppMessage = `Namaste Vinayak Enterprises! Maine aapka product catalogue dekha hai. Mujhe institutional supply / bulk order ke liye quotation aur wholesale rates chahiye. Kripya details share karein.`;

  return (
    <div
      ref={readerContainerRef}
      className={`min-h-screen bg-[#edf1f5] text-slate-900 transition-colors ${
        isFullScreen ? 'p-2 sm:p-6 bg-slate-950 flex flex-col justify-center' : 'py-4 sm:py-6 px-2.5 sm:px-6'
      }`}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* ========================================================= */}
        {/* TOP STATUS BAR: Date + Controls                          */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 sm:mb-3 px-1 sm:px-2">
          <div className="font-medium tracking-wide flex items-center gap-1.5 text-slate-700 text-[11px] sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="font-semibold">Vinayak Enterprises E-Catalogue</span>
            <span className="hidden sm:inline text-slate-400">| Ambala Cantt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs font-medium cursor-pointer"
            >
              {isZoomed ? <ZoomOut className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
              <span>{isZoomed ? '100%' : 'Zoom'}</span>
            </button>

            <button
              onClick={toggleFullScreen}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-md bg-[#1a3a6b] text-white hover:bg-[#12284c] shadow-xs font-semibold text-[11px] sm:text-xs cursor-pointer"
            >
              {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span>{isFullScreen ? 'Exit Full' : 'फुल स्क्रीन'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER FLIPBOOK VIEWER (OR CLEAN LOADING STATE)           */}
        {/* ========================================================= */}
        {isLoading && !activeCatalogue ? (
          /* Sleek Loading State - Never show random fake catalogue */
          <div className="w-full max-w-[760px] mx-auto min-h-[480px] sm:min-h-[660px] bg-white rounded-2xl border border-slate-200/90 shadow-lg flex flex-col items-center justify-center p-8 text-center select-none">
            <div className="relative mb-5">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a3a6b]">
                <FileText className="h-8 w-8 animate-pulse text-[#1a3a6b]" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 border-2 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1a3a6b]">
              कैटलॉग लोड हो रहा है...
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
              Vinayak Enterprises official product catalogue is loading in high resolution from Ambala Cantt.
            </p>
          </div>
        ) : !activeCatalogue ? (
          /* Empty State if no catalogue uploaded */
          <div className="w-full max-w-[760px] mx-auto min-h-[420px] bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col items-center justify-center p-8 text-center select-none">
            <div className="h-16 w-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1a3a6b]">
              नवीनतम कैटलॉग (Official Catalogue)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
              हमारे 2026 संपूर्ण प्रोडक्ट कैटलॉग की PDF कॉपी सीधे WhatsApp या कॉल पर तुरंत प्राप्त करें।
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button asChild className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm">
                <a
                  href={whatsappChatUrl(site.whatsapp, bulkWhatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp पर कैटलॉग मंगाएं
                </a>
              </Button>
              <Button asChild variant="outline" className="border-slate-300 font-bold text-sm">
                <a href={`tel:${site.phone}`}>
                  <Phone className="mr-2 h-4 w-4" /> कॉल करें: {site.phone}
                </a>
              </Button>
            </div>
          </div>
        ) : (
          /* Active Flipbook Viewer */
          <div className="relative flex items-center justify-center select-none">
            {/* Left Circular Arrow: HIDDEN ON MOBILE to avoid blocking catalogue content */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              aria-label="Previous Page"
              className={`
                hidden sm:flex
                absolute -left-3 sm:-left-7 md:-left-9 z-30
                h-12 w-12 sm:h-14 sm:w-14 rounded-full
                border-2 shadow-2xl items-center justify-center
                transition-all duration-200
                ${
                  currentPage <= 1
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-30 pointer-events-none'
                    : 'bg-white hover:bg-[#1a3a6b] text-[#1a3a6b] hover:text-white border-slate-300 hover:border-[#1a3a6b] hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-blue-50/70'
                }
              `}
              title="Previous Page (पिछला पृष्ठ)"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            {/* Central Flipbook Card */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`w-full max-w-[760px] relative rounded-xl shadow-2xl bg-white border border-slate-300/80 overflow-hidden transition-transform duration-200 ${
                isZoomed ? 'scale-105 sm:scale-125 z-40' : ''
              }`}
              style={{ perspective: '1200px' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{
                    rotateY: flipDirection === 'next' ? -15 : 15,
                    opacity: 0.9,
                    transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                  }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{
                    rotateY: flipDirection === 'next' ? 15 : -15,
                    opacity: 0.9,
                    transformOrigin: flipDirection === 'next' ? 'right center' : 'left center',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="w-full"
                >
                  {isCloudinaryPdf ? (
                    <div className="relative min-h-[460px] sm:min-h-[700px] flex items-center justify-center bg-white overflow-hidden">
                      {pageLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-2xs z-10 transition-opacity">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 border-3 border-[#1a3a6b] border-t-transparent rounded-full animate-spin mb-2" />
                          <span className="text-[11px] sm:text-xs font-bold text-[#1a3a6b]">
                            पृष्ठ {currentPage} लोड हो रहा है...
                          </span>
                        </div>
                      )}
                      <img
                        src={getCloudinaryPageUrl(fileUrl, currentPage, isMobile)}
                        alt={`Vinayak Enterprises Catalogue - Page ${currentPage}`}
                        className="w-full h-auto max-h-[820px] object-contain mx-auto select-none"
                        onLoad={() => setPageLoading(false)}
                        onError={() => setPageLoading(false)}
                      />
                    </div>
                  ) : (
                    /* Fallback to direct PDF viewer iframe if non-Cloudinary URL */
                    <div className="w-full h-[520px] sm:h-[720px] bg-slate-100 flex items-center justify-center">
                      <iframe
                        src={`${fileUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
                        title="Catalogue PDF"
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom-Left Corner: Page Number Pill */}
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-20">
                <span className="bg-black/80 text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-md backdrop-blur-xs tracking-wider">
                  पृष्ठ {currentPage} / {totalPages}
                </span>
              </div>

              {/* Bottom-Right Corner: Fullscreen Button (Desktop only; on mobile it is in top bar) */}
              <div className="hidden sm:block absolute bottom-3 right-3 z-20">
                <button
                  onClick={toggleFullScreen}
                  className="bg-black/80 hover:bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>फुल स्क्रीन</span>
                </button>
              </div>
            </div>

            {/* Right Circular Arrow: HIDDEN ON MOBILE to avoid blocking catalogue content */}
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              aria-label="Next Page"
              className={`
                hidden sm:flex
                absolute -right-3 sm:-right-7 md:-right-9 z-30
                h-12 w-12 sm:h-14 sm:w-14 rounded-full
                border-2 shadow-2xl items-center justify-center
                transition-all duration-200
                ${
                  currentPage >= totalPages
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-30 pointer-events-none'
                    : 'bg-[#1a3a6b] hover:bg-[#12284c] text-white border-[#1a3a6b] hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-blue-200/80 shadow-blue-900/30'
                }
              `}
              title="Next Page (अगला पृष्ठ)"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* DEDICATED BOTTOM PAGE CONTROLS (NON-OVERLAPPING ON MOBILE) */}
        {/* ========================================================= */}
        {activeCatalogue && (
          <>
            <div className="mt-3 sm:mt-4 bg-white rounded-2xl border border-slate-200/90 p-2.5 sm:p-4 shadow-sm flex items-center justify-between gap-1.5 sm:gap-4 select-none">
              {/* Previous Page Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="h-10 sm:h-11 px-2.5 sm:px-5 font-bold text-xs sm:text-sm shrink-0 border-slate-300 text-slate-700 hover:text-[#1a3a6b] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4 sm:mr-1 shrink-0" />
                <span className="hidden sm:inline">पिछला पृष्ठ (Prev)</span>
                <span className="sm:hidden text-xs">पिछला</span>
              </Button>

              {/* Quick Page Jump Selector */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <span className="hidden sm:inline text-xs font-bold text-slate-500 uppercase tracking-wider">
                  पृष्ठ:
                </span>
                <div className="relative">
                  <select
                    value={currentPage}
                    onChange={(e) => {
                      playPageFlipSound();
                      setPageLoading(true);
                      setFlipDirection(Number(e.target.value) > currentPage ? 'next' : 'prev');
                      setCurrentPage(Number(e.target.value));
                    }}
                    className="appearance-none bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-[#1a3a6b] font-black text-xs sm:text-sm py-1.5 pl-2.5 pr-6 sm:pl-3 sm:pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
                    aria-label="Select Catalogue Page"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <option key={p} value={p}>
                        पृष्ठ {p} / {totalPages}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 sm:px-2 text-slate-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Next Page Button */}
              <Button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="h-10 sm:h-11 px-3 sm:px-6 font-bold text-xs sm:text-sm shrink-0 bg-[#1a3a6b] hover:bg-[#12284c] text-white shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="sm:hidden text-xs">अगला</span>
                <span className="hidden sm:inline">अगला पृष्ठ (Next)</span>
                <ChevronRight className="h-4 w-4 sm:ml-1 shrink-0" />
              </Button>
            </div>

            {/* Subtitle helper under reader */}
            <p className="text-center text-[11px] sm:text-xs text-slate-500 mt-2 font-medium px-2">
              <span className="hidden sm:inline">तीर (arrows), </span>स्वाइप (swipe) या नीचे बटनों से पन्ने पलटें · Realistic paper sound enabled
            </p>
          </>
        )}

        {/* ========================================================= */}
        {/* BOTTOM ACTION BAR: Share & WhatsApp Bulk Message          */}
        {/* ========================================================= */}
        <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Share Action */}
          <div className="relative w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShareOpen(!shareOpen)}
              className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-5 border-slate-300 text-slate-700 hover:text-[#1a3a6b] font-semibold text-xs sm:text-sm"
            >
              <Share2 className="mr-2 h-4 w-4 text-blue-600" /> Share Catalogue
            </Button>

            {/* Share Popover */}
            {shareOpen && (
              <div className="absolute left-0 bottom-14 w-60 rounded-xl bg-white border border-slate-200 shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1">
                  Share Options
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="h-3.5 w-3.5 text-slate-500" /> Copy Catalogue Link
                  </span>
                  {copied ? (
                    <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
                      <Check className="h-3 w-3" /> Copied!
                    </span>
                  ) : null}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Check out Vinayak Enterprises Product Catalogue: ${currentUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-green-50 text-green-700 font-medium cursor-pointer"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-green-600" /> Share on WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Right: Download PDF & WhatsApp Inquiry */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
            {fileUrl && (
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-5 border-[#1a3a6b] text-[#1a3a6b] hover:bg-blue-50 font-bold text-xs sm:text-sm cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4 text-[#1a3a6b]" /> Download PDF
              </Button>
            )}

            <Button
              asChild
              className="w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md shadow-green-600/20"
            >
              <a
                href={whatsappChatUrl(site.whatsapp, bulkWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> WhatsApp Bulk Rates / Order
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
