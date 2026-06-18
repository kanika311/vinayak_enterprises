import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

process.env.NEXT_TELEMETRY_DISABLED = '1';

import { createServer } from 'http';
import { parse } from 'url';
import { existsSync, rmSync } from 'fs';
import next from 'next';
import { connectDatabase } from './server/config/database';
import apiApp from './server/app';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.APP_PORT || '3000', 10);

const nextApp = next({ dev, hostname });
const handle = nextApp.getRequestHandler();

const isApiRequest = (pathname: string | null | undefined) =>
  pathname === '/health' || pathname?.startsWith('/api/');

async function main() {
  await connectDatabase();

  if (dev && existsSync('.next/trace')) {
    try {
      rmSync('.next/trace', { recursive: true, force: true });
    } catch {
      console.warn('Warning: could not clear .next/trace — close other Next.js terminals');
    }
  }

  await nextApp.prepare();

  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (isApiRequest(parsedUrl.pathname)) {
      apiApp(req, res);
      return;
    }

    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> App ready on http://${hostname}:${port}`);
    console.log(`> API ready on http://${hostname}:${port}/api/v1`);
  }).on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${port} is already in use. Stop the other server first:`);
      console.error(`  netstat -ano | findstr :${port}`);
      console.error(`  taskkill /PID <pid> /F\n`);
      console.error(`Or run on another port: $env:PORT=3001; npm run dev`);
      process.exit(1);
    }
    throw err;
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
