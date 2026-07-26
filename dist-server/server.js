"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./server/env");
process.env.NEXT_TELEMETRY_DISABLED = '1';
const http_1 = require("http");
const url_1 = require("url");
const fs_1 = require("fs");
const net_1 = __importDefault(require("net"));
const next_1 = __importDefault(require("next"));
const database_1 = require("./server/config/database");
const app_1 = __importDefault(require("./server/app"));
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.APP_PORT || '3002', 10);
const nextApp = (0, next_1.default)({ dev, hostname });
const handle = nextApp.getRequestHandler();
const isApiRequest = (pathname) => pathname === '/health' || pathname?.startsWith('/api/');
const isPortAvailable = (p) => new Promise((resolve) => {
    const tester = net_1.default.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => tester.close(() => resolve(true)))
        .listen(p);
});
async function main() {
    await (0, database_1.connectDatabase)();
    console.log('> MongoDB connected');
    const available = await isPortAvailable(port);
    if (!available) {
        console.error(`\nPort ${port} is already in use. Only one dev server can run at a time.`);
        console.error(`  netstat -ano | findstr :${port}`);
        console.error(`  taskkill /PID <pid> /F`);
        console.error(`Or use another port: $env:APP_PORT=3003; npm run dev\n`);
        process.exit(1);
    }
    if (dev && (0, fs_1.existsSync)('.next/trace')) {
        try {
            (0, fs_1.rmSync)('.next/trace', { recursive: true, force: true });
        }
        catch {
            console.warn('Warning: could not clear .next/trace — close other Next.js terminals');
        }
    }
    console.log(`> Preparing Next.js on port ${port} (first start may take 1–2 minutes)...`);
    await nextApp.prepare();
    (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        if (isApiRequest(parsedUrl.pathname)) {
            (0, app_1.default)(req, res);
            return;
        }
        handle(req, res, parsedUrl);
    }).listen(port, () => {
        console.log(`> App ready on http://${hostname}:${port}`);
        console.log(`> API ready on http://${hostname}:${port}/api/v1`);
    }).on('error', (err) => {
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
