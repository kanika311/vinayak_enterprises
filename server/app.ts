import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();

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

const isAllowedOrigin = (origin: string) => {
  if (!origin) return true;
  if (clientOrigins.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith('.vercel.app')) return true;
    if (host === 'vinayakenterprisess.agency' || host.endsWith('.vinayakenterprisess.agency')) return true;
  } catch {
    return true;
  }
  return true;
};

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.options('*', cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', apiLimiter);
app.use('/api/v1', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

export default app;
