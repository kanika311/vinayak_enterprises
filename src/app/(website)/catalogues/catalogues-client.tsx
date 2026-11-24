'use client';

import { useState, useRef } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet, apiPost } from '@/lib/api';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';

interface Catalogue {
  _id: string;
  title: string;
  slug: string;
  file: { url: string; filename?: string; publicId?: string };
  pageCount?: number;
  downloadCount: number;
  isActive: boolean;
}

// Realistic synthesized paper turning sound (zero external audio file dependencies)
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

// Built-in fallback pages when no PDF is uploaded
const DEFAULT_CATALOGUE_PAGES = [
  {
    page: 1,
    title: 'Vinayak Enterprises Product Catalogue 2026',
    subtitle: 'Manufacturer · Bulk Supplier · Distributor — Ambala, Haryana',
    cover: true,
  },
  {
    page: 2,
    category: 'OPTICAL & LABORATORY INSTRUMENTS',
    title: 'Microscopes & Optical Apparatus',
    items: [
      { name: 'Binocular Research Microscope (Model DM-400)', spec: 'Achromatic 4x, 10x, 40x, 100x Oil immersion, LED cold light' },
      { name: 'Monocular Student Microscope (VE-MIC-01)', spec: 'Triple revolving nosepiece, coarse & fine focusing, sturdy horse-shoe base' },
      { name: 'Digital HDMI & USB Microscope 5MP', spec: 'Live digital projection for smartboards, image & video capture capability' },
      { name: 'Microscope Glass Slides & Cover Slips', spec: 'Optically clear 75x25mm frosted slides, lint-free packaging (Pack of 50)' },
    ],
  },
  {
    page: 3,
    category: 'MEDICAL COLLEGE & BIOLOGICAL MODELS',
    title: 'Human Anatomy & Skeleton Models',
    items: [
      { name: 'Life-Size Articulated Human Skeleton (170cm)', spec: 'Medical PVC, flexible joint articulation, 5-roller heavy-duty cast base' },
      { name: 'Anatomical Human Skull with Detachable Calvaria', spec: 'Magnetic detachable skull cap, mandible with spring, 32 visible teeth' },
      { name: 'Dual-Sex Human Torso Model (85cm, 27 Parts)', spec: 'Removable visceral organs: heart, lungs, stomach, intestine, reproductive organs' },
      { name: 'Enlarged Human Eye in Orbit (6x Life Size)', spec: 'Detachable retina, cornea, lens and vitreous humor for ophthalmology training' },
    ],
  },
  {
    page: 4,
    category: 'TRAINING & CLINICAL SIMULATION',
    title: 'CPR Manikins & Lab Equipment',
    items: [
      { name: 'Full-Body Adult CPR Training Manikin', spec: 'AHA guidelines compliant, compression depth acoustic feedback, airway rise' },
      { name: 'Pediatric / Infant CPR Training Dummy', spec: 'Accurate anatomical infant proportions, realistic chest rise on ventilation' },
      { name: 'Magnetic Stirrer with Ceramic Hot Plate', spec: 'Speed 0-1500 RPM, temperature up to 350°C, chemical-resistant surface' },
      { name: 'Physics & Chemistry Educational Kits', spec: 'Vernier calipers, optical bench, prisms, volumetric glassware & test apparatus' },
    ],
  },
];

// Helper to convert Cloudinary PDF URL into high-resolution page image
function getCloudinaryPageUrl(url: string, page: number): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) {
    return url
      .replace('/image/upload/', `/image/upload/pg_${page},f_auto,q_auto,w_1200/`)
      .replace(/\.pdf($|\?)/i, '.jpg$1');
  }
  return url;
}

export function CataloguesClient() {
  const { site } = useSiteContact();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [pageLoading, setPageLoading] = useState(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Fetch active catalogue from API
  const { data } = useQuery({
    queryKey: ['catalogues-public'],
    queryFn: () => apiGet<{ catalogues: Catalogue[] }>('/catalogues'),
  });

  const activeCatalogue = data?.catalogues?.find((c) => c.isActive) || data?.catalogues?.[0];
  const fileUrl = activeCatalogue?.file?.url;
  const isCloudinaryPdf = !!fileUrl && fileUrl.includes('res.cloudinary.com') && /\.pdf($|\?)/i.test(fileUrl);

  const totalPages = isCloudinaryPdf
    ? activeCatalogue?.pageCount || 11
    : DEFAULT_CATALOGUE_PAGES.length;

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
        isFullScreen ? 'p-2 sm:p-6 bg-slate-950 flex flex-col justify-center' : 'py-6 px-3 sm:px-6'
      }`}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* ========================================================= */}
        {/* TOP STATUS BAR: Date + Controls                          */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-2">
          <div className="font-medium tracking-wide flex items-center gap-1.5 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Vinayak Enterprises E-Catalogue</span>
            <span className="hidden sm:inline text-slate-400">| Ambala Cantt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs font-medium"
            >
              {isZoomed ? <ZoomOut className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
              <span>{isZoomed ? '100%' : 'Zoom'}</span>
            </button>

            <button
              onClick={toggleFullScreen}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#1a3a6b] text-white hover:bg-[#12284c] shadow-xs font-semibold text-xs"
            >
              {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span>{isFullScreen ? 'Exit Full' : 'फुल स्क्रीन पढ़ें'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER FLIPBOOK VIEWER                                    */}
        {/* ========================================================= */}
        <div className="relative flex items-center justify-center select-none">
          {/* Floating Left Circular Turn Arrow */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
            className={`
              absolute -left-2 sm:-left-6 md:-left-8 z-30
              h-11 w-11 sm:h-13 sm:w-13 rounded-full
              bg-white/95 hover:bg-white text-slate-800
              border border-slate-200 shadow-xl
              flex items-center justify-center
              transition-all duration-200
              hover:scale-110 active:scale-95
              disabled:opacity-20 disabled:pointer-events-none
            `}
          >
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>

          {/* Central Flipbook Card */}
          <div
            className={`w-full max-w-[760px] relative rounded-xl shadow-2xl bg-white border border-slate-300/80 overflow-hidden transition-transform duration-200 ${
              isZoomed ? 'scale-110 sm:scale-125 z-40' : ''
            }`}
            style={{ perspective: '1200px' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{
                  rotateY: flipDirection === 'next' ? -20 : 20,
                  opacity: 0.85,
                  transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{
                  rotateY: flipDirection === 'next' ? 20 : -20,
                  opacity: 0.85,
                  transformOrigin: flipDirection === 'next' ? 'right center' : 'left center',
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full"
              >
                {/* 1. Uploaded PDF Page View (Real PDF from Cloudinary) */}
                {isCloudinaryPdf ? (
                  <div className="relative min-h-[540px] sm:min-h-[700px] flex items-center justify-center bg-white overflow-hidden">
                    {pageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                        <div className="h-8 w-8 border-3 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <img
                      src={getCloudinaryPageUrl(fileUrl, currentPage)}
                      alt={`Catalogue Page ${currentPage}`}
                      className="w-full h-auto max-h-[820px] object-contain mx-auto select-none"
                      onLoad={() => setPageLoading(false)}
                      onError={() => setPageLoading(false)}
                    />
                  </div>
                ) : (
                  /* 2. Structured Default Flipbook Pages */
                  <div className="min-h-[560px] sm:min-h-[660px] p-6 sm:p-10 flex flex-col justify-between bg-[#fffefc] border-t-4 border-[#1a3a6b]">
                    {currentPage === 1 ? (
                      <div className="text-center flex-1 flex flex-col justify-between py-4">
                        <div>
                          <div className="border-b-2 border-black pb-2 mb-2 flex items-center justify-between text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                            <span>ISO CERTIFIED QUALITY</span>
                            <span>PAN-INDIA INSTITUTIONAL SUPPLY</span>
                            <span>AMBALA CANTT</span>
                          </div>
                          <h1
                            className="text-3xl sm:text-5xl font-black text-[#1a3a6b] tracking-tight uppercase"
                            style={{ fontFamily: 'Georgia, serif' }}
                          >
                            VINAYAK ENTERPRISES
                          </h1>
                          <div className="h-1 bg-[#f26b21] w-full my-2" />
                          <p className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
                            Scientific Instruments · Laboratory Equipment · Human Anatomy &amp; CPR Manikins
                          </p>
                        </div>

                        <div className="my-8 p-6 bg-gradient-to-br from-blue-50/80 to-slate-100 rounded-2xl border border-blue-200/80 max-w-md mx-auto">
                          <span className="text-5xl block mb-3">🔬 🦴 🩺</span>
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                            Official Institutional Catalogue
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                            Serving medical colleges, university research labs, schools, and hospitals across India with precision manufacturing from Ambala Cantt.
                          </p>
                          <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-[#1a3a6b]">
                            👉 Click &quot;Next &gt;&quot; or swipe to turn pages
                          </div>
                        </div>

                        <div className="border-t border-slate-200 pt-3 text-xs text-slate-500 font-medium">
                          Ambala, Haryana, India · Phone: +91 94160-29492 · Email: vinayakenterprises52@gmail.com
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="border-b-2 border-slate-900 pb-2 mb-4 flex items-center justify-between text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                            <span className="text-[#1a3a6b]">
                              {DEFAULT_CATALOGUE_PAGES[currentPage - 1]?.category}
                            </span>
                            <span>VINAYAK ENTERPRISES</span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-5 font-serif">
                            {DEFAULT_CATALOGUE_PAGES[currentPage - 1]?.title}
                          </h2>

                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {DEFAULT_CATALOGUE_PAGES[currentPage - 1]?.items?.map((it, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="h-2 w-2 rounded-full bg-[#f26b21]" />
                                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                                      {it.name}
                                    </h3>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed pl-4">
                                    {it.spec}
                                  </p>
                                </div>
                                <div className="mt-3 pl-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-green-700">Bulk supply available</span>
                                  <span className="text-slate-400">Ambala Mfg</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 mt-6 flex items-center justify-between text-xs text-slate-500">
                          <span>Vinayak Enterprises · Bulk Inquiries: +91 94160-29492</span>
                          <span className="font-semibold text-slate-700">Page {currentPage}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom-Left Corner: Page Number Pill */}
            <div className="absolute bottom-3 left-3 z-20">
              <span className="bg-black/85 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs tracking-wider">
                पृष्ठ {currentPage} / {totalPages}
              </span>
            </div>

            {/* Bottom-Right Corner: Fullscreen Button */}
            <div className="absolute bottom-3 right-3 z-20">
              <button
                onClick={toggleFullScreen}
                className="bg-black/85 hover:bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 transition-colors"
              >
                <Maximize2 className="h-3 w-3" />
                <span>फूल स्क्रीन पढ़ें</span>
              </button>
            </div>
          </div>

          {/* Floating Right Circular Turn Arrow */}
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Next Page"
            className={`
              absolute -right-2 sm:-right-6 md:-right-8 z-30
              h-11 w-11 sm:h-13 sm:w-13 rounded-full
              bg-white/95 hover:bg-white text-slate-800
              border border-slate-200 shadow-xl
              flex items-center justify-center
              transition-all duration-200
              hover:scale-110 active:scale-95
              disabled:opacity-20 disabled:pointer-events-none
            `}
          >
            <ChevronRight className="h-6 w-6 text-slate-700" />
          </button>
        </div>

        {/* Subtitle helper under reader */}
        <p className="text-center text-xs text-slate-500 mt-3 font-medium">
          तीर (arrows) पर क्लिक करके पन्ने पलटें · Realistic page turning sound enabled
        </p>

        {/* ========================================================= */}
        {/* BOTTOM ACTION BAR: Share & WhatsApp Bulk Message          */}
        {/* ========================================================= */}
        <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Share Action */}
          <div className="relative w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShareOpen(!shareOpen)}
              className="w-full sm:w-auto h-11 px-5 border-slate-300 text-slate-700 hover:text-[#1a3a6b] font-semibold text-sm"
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
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-green-50 text-green-700 font-medium"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-green-600" /> Share on WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    'Vinayak Enterprises Product Catalogue'
                  )}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <span className="font-bold">𝕏</span> Share on Twitter/X
                </a>
              </div>
            )}
          </div>

          {/* Right: Download PDF & WhatsApp Inquiry */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {fileUrl && (
              <Button
                onClick={handleDownload}
                variant="outline"
                className="h-11 px-5 border-[#1a3a6b] text-[#1a3a6b] hover:bg-blue-50 font-bold text-sm"
              >
                <Download className="mr-2 h-4 w-4 text-[#1a3a6b]" /> Download PDF
              </Button>
            )}

            <Button
              asChild
              className="w-full sm:w-auto h-11 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md shadow-green-600/20"
            >
              <a
                href={whatsappChatUrl(site.whatsapp, bulkWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Bulk Message / Rates
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
