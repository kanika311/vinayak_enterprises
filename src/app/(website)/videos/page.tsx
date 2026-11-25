import type { Metadata } from 'next';
import { VideosClientPage } from './videos-client';
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
      <VideosClientPage />
    </>
  );
}
