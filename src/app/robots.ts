import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    '/console/',
    '/console/*',
    '/admin/',
    '/admin/*',
    '/api/',
    '/api/*',
    '/_next/',
    '/private/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/console/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
