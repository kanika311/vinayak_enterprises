import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import Banner from '../models/Banner';
import { AppError } from '../utils/helpers';
import { isCloudinaryConfigured } from '../config/cloudinary';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinaryService';

const EXT_BY_MIME: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const saveLocal = (file: Express.Multer.File, folder: string) => {
  const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname) || '.mp4';
  const filename = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, filename), file.buffer);
  return { url: `/uploads/${folder}/${filename}` };
};

export const uploadBannerVideo = async (
  file: Express.Multer.File
): Promise<{ url: string; publicId?: string }> => {
  if (!file.mimetype.startsWith('video/')) {
    throw new AppError('Only video files (MP4, WebM) are allowed', 400);
  }

  if (isCloudinaryConfigured()) {
    try {
      return await uploadToCloudinary(file, 'banners');
    } catch (err) {
      console.warn('Cloudinary banner upload failed, saving locally:', err);
    }
  }

  return saveLocal(file, 'banners');
};

const optimizeCloudinaryVideo = (url: string) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) return url;
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) return url;
  return url.replace('/video/upload/', '/video/upload/f_auto,q_auto:eco,vc_auto,w_1280/');
};

const makeCloudinaryPoster = (url: string) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) return undefined;
  return url
    .replace('/video/upload/', '/video/upload/so_0,f_auto,q_auto,w_1280/')
    .replace(/\.[a-zA-Z0-9]+$/, '.jpg');
};

export const getBanners = async (query: Record<string, string> = {}) => {
  const filter: Record<string, unknown> = {};
  if (query.active === 'true') filter.isActive = true;
  if (query.placement) filter.placement = query.placement;
  return Banner.find(filter).sort({ order: 1, createdAt: -1 });
};

export const getPublicBanners = async (placement = 'hero') => {
  const docs = await Banner.find({ isActive: true, placement })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return docs.map((b) => ({
    ...b,
    videoUrl: optimizeCloudinaryVideo(b.videoUrl),
    posterUrl: b.posterUrl || makeCloudinaryPoster(b.videoUrl),
  }));
};

export const createBanner = async (data: {
  title: string;
  videoUrl: string;
  videoPublicId?: string;
  posterUrl?: string;
  placement?: string;
  isActive?: boolean;
  order?: number;
}) => {
  if (!data.title?.trim()) throw new AppError('Title is required', 400);
  if (!data.videoUrl) throw new AppError('Video is required', 400);

  const poster = data.posterUrl || makeCloudinaryPoster(data.videoUrl);

  return Banner.create({
    title: data.title.trim(),
    videoUrl: data.videoUrl,
    videoPublicId: data.videoPublicId,
    posterUrl: poster,
    placement: data.placement || 'hero',
    isActive: data.isActive !== false,
    order: data.order ?? 0,
  });
};

export const updateBanner = async (id: string, data: Record<string, unknown>) => {
  const banner = await Banner.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!banner) throw new AppError('Banner not found', 404);
  return banner;
};

export const deleteBanner = async (id: string) => {
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) throw new AppError('Banner not found', 404);
  if (banner.videoPublicId) {
    try {
      await deleteFromCloudinary(banner.videoPublicId, 'video');
    } catch (err) {
      console.warn('Failed to delete banner video from Cloudinary:', err);
    }
  }
  return banner;
};
