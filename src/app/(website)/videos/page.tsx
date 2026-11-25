import type { Metadata } from 'next';
import { VideosClientPage } from './videos-client';
import { SITE_URL } from '@/lib/site-url';
import { connectDatabase } from '../../../../server/config/database';
import ShowcaseVideoModel from '../../../../server/models/ShowcaseVideo';
import type { ShowcaseVideo } from '@/types';

export const revalidate = 1800; // 30 minutes

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

async function getVideosData(): Promise<ShowcaseVideo[]> {
  try {
    await connectDatabase();
    const videos = await ShowcaseVideoModel.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(50)
      .lean();
    return JSON.parse(JSON.stringify(videos)) as ShowcaseVideo[];
  } catch (error) {
    console.warn('Could not load videos on SSR:', error);
    return [];
  }
}

export default async function VideosPage() {
  const initialVideos = await getVideosData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <VideosClientPage initialVideos={initialVideos} />
    </>
  );
}
