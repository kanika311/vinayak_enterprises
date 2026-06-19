"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const database_1 = require("./server/config/database");
const app_1 = __importDefault(require("./server/app"));
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const nextApp = (0, next_1.default)({ dev, hostname, port });
const handle = nextApp.getRequestHandler();
const isApiRequest = (pathname) => pathname === '/health' || pathname?.startsWith('/api/');
async function main() {
    await (0, database_1.connectDatabase)();
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
    });
}
main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
