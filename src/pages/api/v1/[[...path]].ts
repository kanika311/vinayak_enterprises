import type { NextApiRequest, NextApiResponse } from 'next';
import type { Request, Response } from 'express';
import app from '../../../../server/app';
import { connectDatabase } from '../../../../server/config/database';

/**
 * Vercel has no custom Node server — this catch-all mounts the Express API
 * so /api/v1/* works the same as local `npm run dev` (server.ts).
 */
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    res.status(503).json({
      success: false,
      message: 'Database unavailable. Check MONGODB_URI on Vercel.',
    });
    return;
  }

  // Ensure Express sees the full /api/v1/... path
  if (req.url && !req.url.startsWith('/api/v1')) {
    const suffix = Array.isArray(req.query.path)
      ? (req.query.path as string[]).join('/')
      : typeof req.query.path === 'string'
        ? req.query.path
        : '';
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    req.url = `/api/v1${suffix ? `/${suffix}` : ''}${qs}`;
  }

  return app(req as unknown as Request, res as unknown as Response);
}
