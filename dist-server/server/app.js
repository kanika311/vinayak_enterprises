"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const clientOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'https://vinayakenterprisess.agency',
    'https://www.vinayakenterprisess.agency',
    ...(process.env.CLIENT_URL || '').split(',').map((o) => o.trim()).filter(Boolean),
    ...(process.env.CLIENT_URLS || '').split(',').map((o) => o.trim()).filter(Boolean),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
];
const isAllowedOrigin = (origin) => {
    if (!origin)
        return true;
    if (clientOrigins.includes(origin))
        return true;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
        return true;
    try {
        const host = new URL(origin).hostname;
        if (host.endsWith('.vercel.app'))
            return true;
        if (host === 'vinayakenterprisess.agency' || host.endsWith('.vinayakenterprisess.agency'))
            return true;
    }
    catch {
        return true;
    }
    return true;
};
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.options('*', (0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', rateLimiter_1.apiLimiter);
app.use('/api/v1', routes_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
