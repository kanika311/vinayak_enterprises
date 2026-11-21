import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import Catalogue from '../models/Catalogue';
import Download from '../models/Download';
import { AppError, generateSlug, getPagination } from '../utils/helpers';
import { isCloudinaryConfigured } from '../config/cloudinary';
import { uploadToCloudinary } from './cloudinaryService';

export const getCatalogues = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const [catalogues, total] = await Promise.all([
    Catalogue.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Catalogue.countDocuments(),
  ]);
  return { catalogues, total, page, limit, pages: Math.ceil(total / limit) };
};

export const createCatalogue = async (data: Record<string, unknown>) => {
  if (!data.slug) data.slug = generateSlug(data.title as string);
  return Catalogue.create(data);
};

export const uploadCatalogue = async (file: Express.Multer.File, title?: string) => {
  let fileUrl = '';
  let publicId: string | undefined;

  if (isCloudinaryConfigured()) {
    try {
      const res = await uploadToCloudinary(file, 'catalogues');
      fileUrl = res.url;
      publicId = res.publicId;
    } catch (e) {
      console.warn('Cloudinary upload failed, saving locally:', e);
    }
  }

  if (!fileUrl) {
    const ext = path.extname(file.originalname) || '.pdf';
    const filename = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads', 'catalogues');
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, filename), file.buffer);
    fileUrl = `/uploads/catalogues/${filename}`;
  }

  const name = title || file.originalname.replace(/\.pdf$/i, '') || 'Vinayak Enterprises Catalogue';
  const slug = generateSlug(name) + '-' + Date.now().toString(36);

  // Set previous catalogues to inactive
  await Catalogue.updateMany({}, { isActive: false });

  return Catalogue.create({
    title: name,
    slug,
    file: {
      url: fileUrl,
      publicId,
      filename: file.originalname,
    },
    category: 'All Products',
    isActive: true,
  });
};

export const trackDownload = async (catalogueId: string, visitorData: Record<string, unknown>) => {
  const catalogue = await Catalogue.findById(catalogueId);
  if (!catalogue) throw new AppError('Catalogue not found', 404);

  catalogue.downloadCount += 1;
  await catalogue.save();

  await Download.create({ catalogue: catalogueId, ...visitorData });
  return catalogue;
};

export const deleteCatalogue = async (id: string) => {
  const catalogue = await Catalogue.findByIdAndDelete(id);
  if (!catalogue) throw new AppError('Catalogue not found', 404);
  return catalogue;
};
