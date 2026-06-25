import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export const isCloudinaryConfigured = (): boolean => {
  const name = process.env.CLOUDINARY_CLOUD_NAME || '';
  const key = process.env.CLOUDINARY_API_KEY || '';
  const secret = process.env.CLOUDINARY_API_SECRET || '';
  return Boolean(
    name && key && secret &&
    !name.includes('your_cloud') &&
    !key.includes('your_api') &&
    !secret.includes('your_api')
  );
};

export const ensureCloudinaryConfigured = (): boolean => {
  if (!isCloudinaryConfigured()) return false;
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
  return true;
};

export default cloudinary;
