import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '../../../server/config/database';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDatabase();
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    });
  }
}
