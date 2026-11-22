import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  serverExternalPackages: [
    'mongoose',
    'express',
    'multer',
    'bcryptjs',
    'jsonwebtoken',
    'nodemailer',
    'cloudinary',
  ],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'vinayakenterprisess.agency',
          },
        ],
        destination: 'https://www.vinayakenterprisess.agency/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
