import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.CLIENT_URL || 'https://vinayakenterprisess.agency';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/console/',
          '/console/*',
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'GPTBot',
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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
