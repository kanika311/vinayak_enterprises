/** Public site URL used in password-reset emails and CORS. */
export function getClientUrl(): string {
  const fromEnv = process.env.CLIENT_URL?.trim();
  if (fromEnv && !fromEnv.includes('localhost') && !fromEnv.includes('127.0.0.1')) {
    return fromEnv.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '');
  }

  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, '');
  }

  return (fromEnv || 'http://localhost:3002').replace(/\/$/, '');
}
