"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.local' });
dotenv_1.default.config();
process.env.NEXT_TELEMETRY_DISABLED = '1';
const http_1 = require("http");
const url_1 = require("url");
const fs_1 = require("fs");
const next_1 = __importDefault(require("next"));
const database_1 = require("./server/config/database");
const app_1 = __importDefault(require("./server/app"));
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.APP_PORT || '3002', 10);
const nextApp = (0, next_1.default)({ dev, hostname });
const handle = nextApp.getRequestHandler();
const isApiRequest = (pathname) => pathname === '/health' || pathname?.startsWith('/api/');
async function main() {
    await (0, database_1.connectDatabase)();
    if (dev && (0, fs_1.existsSync)('.next/trace')) {
        try {
            (0, fs_1.rmSync)('.next/trace', { recursive: true, force: true });
        }
        catch {
            console.warn('Warning: could not clear .next/trace — close other Next.js terminals');
        }
    }
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
