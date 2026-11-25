import { Readable } from 'stream';
import cloudinary, { ensureCloudinaryConfigured } from '../config/cloudinary';
import { AppError } from '../utils/helpers';

const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder = 'scientific-instruments'
): Promise<{ url: string; publicId: string }> => {
  if (!ensureCloudinaryConfigured()) {
    return Promise.reject(new Error('Cloudinary is not configured'));
  }

  const isVideo = file.mimetype.startsWith('video/');
  const isImage = file.mimetype.startsWith('image/');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : isImage ? 'image' : 'auto',
        ...(isVideo
          ? {
              eager: [
                { format: 'webm', quality: 'auto:eco', width: 854, crop: 'limit' },
                { format: 'mp4', quality: 'auto:eco', width: 854, crop: 'limit' },
              ],
              eager_async: true,
            }
          : isImage
          ? {
              format: 'webp',
              transformation: [{ quality: 'auto:good', fetch_format: 'webp', width: 1600, crop: 'limit' }],
            }
          : {}),
      },
      (error, result) => {
        if (error || !result) return reject(error);
        let finalUrl = result.secure_url;
        if (isVideo) {
          finalUrl = result.secure_url
            .replace('/video/upload/', '/video/upload/f_webm,q_auto:eco,w_854/')
            .replace(/\.[a-zA-Z0-9]+$/, '.webm');
        } else if (isImage && result.secure_url.includes('/image/upload/')) {
          finalUrl = toWebpUrl(result.secure_url);
        }
        resolve({ url: finalUrl, publicId: result.public_id });
      }
    );
    bufferToStream(file.buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string, resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto') => {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export const getMediaType = (mimetype: string): 'image' | 'video' | 'pdf' | 'document' => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  return 'document';
};

/** Generate signed upload parameters so the browser can upload large videos directly to Cloudinary */
export const getCloudinarySignature = (folder = 'showcase_videos') => {
  if (!ensureCloudinaryConfigured()) {
    throw new AppError(
      'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel Project Settings.',
      400
    );
  }
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  };
};

/** Fetch exact page count of a Cloudinary PDF */
export const getCloudinaryPdfPageCount = async (publicId: string): Promise<number | null> => {
  if (!ensureCloudinaryConfigured()) return null;
  try {
    const res = await cloudinary.api.resource(publicId, { pages: true, image_metadata: true });
    return typeof res.pages === 'number' && res.pages > 0 ? res.pages : null;
  } catch {
    return null;
  }
};

/** Convert any Cloudinary image to WebP with auto quality */
export const toWebpUrl = (url: string): string => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url;
  if (url.includes('/upload/f_webp')) return url;
  return url.replace('/image/upload/', '/image/upload/f_webp,q_auto/');
};
