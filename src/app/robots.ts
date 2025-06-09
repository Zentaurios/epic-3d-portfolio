import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://webb3fitty.dev'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes
          '/sanity/',        // Sanity Studio
          '/brain-demo/',    // Demo pages
          '/_next/',         // Next.js internal
          '/admin/',         // Admin routes if any
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
