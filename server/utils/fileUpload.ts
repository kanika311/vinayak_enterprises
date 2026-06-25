import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { isCloudinaryConfigured } from '../config/cloudinary';
import { uploadToCloudinary } from '../services/cloudinaryService';

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export const uploadProductImage = async (
  file: Express.Multer.File
): Promise<{ url: string; publicId?: string }> => {
  if (isCloudinaryConfigured()) {
    try {
      return await uploadToCloudinary(file, 'products');
    } catch (err) {
      console.warn('Cloudinary upload failed, saving locally:', err);
    }
  }

  const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname) || '.jpg';
  const filename = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', 'products');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, filename), file.buffer);
  return { url: `/uploads/products/${filename}` };
};
