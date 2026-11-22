import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import ShowcaseVideo, { IShowcaseVideo } from '../models/ShowcaseVideo';
import { AppError } from '../utils/helpers';
import { isCloudinaryConfigured } from '../config/cloudinary';
import { uploadToCloudinary, deleteFromCloudinary, getCloudinarySignature } from './cloudinaryService';

const EXT_BY_MIME: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

/** Extract YouTube Video ID from any standard or short URL */
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

/** Convert YouTube URL to safe embed URL */
export const getYouTubeEmbedUrl = (url: string): string | null => {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

/** Automatically create a WebP poster URL for Cloudinary or YouTube */
export const makeWebpPoster = (videoUrl: string, customPoster?: string): string => {
  if (customPoster) {
    if (customPoster.includes('res.cloudinary.com') && customPoster.includes('/image/upload/')) {
      if (!customPoster.includes('/upload/f_webp')) {
        return customPoster.replace('/image/upload/', '/image/upload/f_webp,q_auto/');
      }
    }
    return customPoster;
  }

  // If Cloudinary video: extract frame 0 as WebP
  if (videoUrl && videoUrl.includes('res.cloudinary.com') && videoUrl.includes('/video/upload/')) {
    return videoUrl
      .replace('/video/upload/', '/video/upload/so_0,f_webp,q_auto,w_800/')
      .replace(/\.[a-zA-Z0-9]+$/, '.webp');
  }

  // If YouTube: use HQ poster
  const ytId = extractYouTubeId(videoUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }

  return '';
};

/** Optimize Cloudinary video URL for streaming (f_auto, q_auto:eco) */
export const optimizeCloudinaryVideo = (url: string): string => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) return url;
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) return url;
  return url.replace('/video/upload/', '/video/upload/f_auto,q_auto:eco,vc_auto,w_1280/');
};

/** Save video file locally if Cloudinary is not configured */
const saveLocalVideo = (file: Express.Multer.File, folder: string) => {
  const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname) || '.mp4';
  const filename = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, filename), file.buffer);
  return {
    url: `/uploads/${folder}/${filename}`,
    posterUrl: '',
  };
};

/** Generate direct Cloudinary upload signature for client-side uploads (bypasses 4.5MB Vercel limit) */
export const getUploadSignature = (folder = 'showcase_videos') => {
  return getCloudinarySignature(folder);
};

/** Upload a video file via Multer (MP4 or WebM) and generate its WebP poster */
export const uploadShowcaseVideoFile = async (
  file: Express.Multer.File
): Promise<{ url: string; publicId?: string; posterUrl?: string }> => {
  if (!file.mimetype.startsWith('video/')) {
    throw new AppError('Only video files (MP4, WebM) are allowed', 400);
  }

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(file, 'showcase_videos');
      const posterUrl = makeWebpPoster(result.url);
      return {
        url: result.url,
        publicId: result.publicId,
        posterUrl,
      };
    } catch (err) {
      console.warn('Cloudinary showcase video upload failed, saving locally:', err);
    }
  }

  return saveLocalVideo(file, 'showcase_videos');
};

/** Fetch public active videos with optimized streaming URLs and WebP posters */
export const getPublicVideos = async (category?: string) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (category && category !== 'All') {
    filter.category = category;
  }

  const docs = await ShowcaseVideo.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return docs.map((v) => ({
    ...v,
    videoUrl: optimizeCloudinaryVideo(v.videoUrl),
    posterUrl: v.posterUrl || makeWebpPoster(v.videoUrl),
  }));
};

/** Admin: fetch all videos */
export const getVideos = async (query: Record<string, string> = {}) => {
  const filter: Record<string, unknown> = {};
  if (query.active === 'true') filter.isActive = true;
  if (query.category && query.category !== 'All') filter.category = query.category;

  return ShowcaseVideo.find(filter).sort({ order: 1, createdAt: -1 });
};

/** Admin: create a showcase video */
export const createVideo = async (data: {
  title: string;
  description?: string;
  videoUrl: string;
  videoPublicId?: string;
  posterUrl?: string;
  category?: string;
  duration?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  order?: number;
}) => {
  if (!data.title?.trim()) throw new AppError('Title is required', 400);
  if (!data.videoUrl) throw new AppError('Video URL or uploaded file is required', 400);

  const poster = data.posterUrl || makeWebpPoster(data.videoUrl);

  return ShowcaseVideo.create({
    title: data.title.trim(),
    description: data.description?.trim() || '',
    videoUrl: data.videoUrl.trim(),
    videoPublicId: data.videoPublicId,
    posterUrl: poster,
    category: data.category || 'General',
    duration: data.duration?.trim() || '1:30',
    isFeatured: data.isFeatured !== false,
    isActive: data.isActive !== false,
    order: data.order ?? 0,
    views: 0,
  });
};

/** Admin: update a showcase video */
export const updateVideo = async (id: string, data: Partial<IShowcaseVideo>) => {
  if (data.videoUrl && !data.posterUrl) {
    data.posterUrl = makeWebpPoster(data.videoUrl);
  }

  const doc = await ShowcaseVideo.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new AppError('Video not found', 404);
  return doc;
};

/** Admin: delete a showcase video */
export const deleteVideo = async (id: string) => {
  const doc = await ShowcaseVideo.findById(id);
  if (!doc) throw new AppError('Video not found', 404);

  if (doc.videoPublicId && isCloudinaryConfigured()) {
    try {
      await deleteFromCloudinary(doc.videoPublicId, 'video');
    } catch (e) {
      console.warn('Failed to delete video from Cloudinary:', e);
    }
  }

  await doc.deleteOne();
  return true;
};

/** Public: track video view increment */
export const trackVideoView = async (id: string) => {
  return ShowcaseVideo.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
};
