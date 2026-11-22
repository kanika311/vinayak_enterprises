/**
 * Authoritative canonical site URL for Vinayak Enterprises.
 * Fallback to https://www.vinayakenterprisess.agency
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.CLIENT_URL ||
  'https://www.vinayakenterprisess.agency'
).replace(/\/$/, '');

export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
