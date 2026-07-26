import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  serverExternalPackages: ['mongoose', 'express', 'multer', 'bcryptjs', 'jsonwebtoken', 'nodemailer', 'cloudinary'],
};

export default nextConfig;
