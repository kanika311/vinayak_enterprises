import type { Metadata } from 'next';
import { VideoShowcaseSection } from '@/components/website/video-showcase-section';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Equipment Demonstration & Laboratory Videos | Vinayak Enterprises',
  description:
    'Watch video demonstrations of microscopes, human anatomical models, CPR training manikins, and laboratory equipment manufactured by Vinayak Enterprises Ambala.',
  keywords: [
    'Scientific Instruments Videos',
    'Laboratory Equipment Demonstrations',
    'Microscope Demo Video',
    'Anatomy Model Video',
    'CPR Training Manikin Video',
    'Vinayak Enterprises Video Showcase',
  ],
  alternates: {
    canonical: `${SITE_URL}/videos`,
    languages: {
      'en-IN': `${SITE_URL}/videos`,
    },
  },
  openGraph: {
    title: 'Equipment Demonstration & Laboratory Videos | Vinayak Enterprises',
    description:
      'Watch video demonstrations of microscopes, human anatomical models, CPR training manikins, and laboratory equipment manufactured by Vinayak Enterprises Ambala.',
    url: `${SITE_URL}/videos`,
    type: 'video.other',
    images: [`${SITE_URL}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Equipment Demonstration & Laboratory Videos | Vinayak Enterprises',
    description:
      'Watch video demonstrations of microscopes, human anatomical models, CPR training manikins, and laboratory equipment manufactured by Vinayak Enterprises Ambala.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Equipment Videos',
      item: `${SITE_URL}/videos`,
    },
  ],
};

export default function VideosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="bg-[#1a3a6b] py-12 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
            VIDEO SHOWCASE
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Equipment Demonstrations &amp; Walkthroughs
          </h1>
          <p className="text-blue-100 text-sm md:text-base mt-2.5 max-w-xl mx-auto">
            Explore live walkthroughs and product videos of our educational scientific instruments, medical training models and laboratory equipment.
          </p>
        </div>
      </div>
      <VideoShowcaseSection />
    </>
  );
}
