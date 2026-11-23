/**
 * Authoritative canonical site URL for Vinayak Enterprises.
 * Strictly guarantees production canonical URL and prevents any localhost leaks.
 */
const rawEnvUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.CLIENT_URL || '').trim();
const isLocal =
  rawEnvUrl.includes('localhost') ||
  rawEnvUrl.includes('127.0.0.1') ||
  rawEnvUrl.includes(':3002') ||
  rawEnvUrl.includes(':3000');

export const SITE_URL = (
  rawEnvUrl && !isLocal ? rawEnvUrl : 'https://www.vinayakenterprisess.agency'
).replace(/\/$/, '');

export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

