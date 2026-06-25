import './server/env';

process.env.NEXT_TELEMETRY_DISABLED = '1';

import { createServer } from 'http';
import { parse } from 'url';
import { existsSync, rmSync } from 'fs';
import net from 'net';
import next from 'next';
import { connectDatabase } from './server/config/database';
import apiApp from './server/app';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.APP_PORT || '3002', 10);

const nextApp = next({ dev, hostname });
const handle = nextApp.getRequestHandler();

const isApiRequest = (pathname: string | null | undefined) =>
  pathname === '/health' || pathname?.startsWith('/api/');

const isPortAvailable = (p: number) =>
  new Promise<boolean>((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => tester.close(() => resolve(true)))
      .listen(p);
  });

async function main() {
  await connectDatabase();
  console.log('> MongoDB connected');

  const available = await isPortAvailable(port);
  if (!available) {
    console.error(`\nPort ${port} is already in use. Only one dev server can run at a time.`);
    console.error(`  netstat -ano | findstr :${port}`);
    console.error(`  taskkill /PID <pid> /F`);
    console.error(`Or use another port: $env:APP_PORT=3003; npm run dev\n`);
    process.exit(1);
  }

  if (dev && existsSync('.next/trace')) {
    try {
      rmSync('.next/trace', { recursive: true, force: true });
    } catch {
      console.warn('Warning: could not clear .next/trace — close other Next.js terminals');
    }
  }

  console.log(`> Preparing Next.js on port ${port} (first start may take 1–2 minutes)...`);
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
      console.error(`Or run on another port: $env:APP_PORT=3003; npm run dev`);
      process.exit(1);
    }
    throw err;
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
