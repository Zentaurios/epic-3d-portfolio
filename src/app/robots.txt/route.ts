import { MetadataRoute } from 'next'

export async function GET(): Promise<Response> {
  const baseUrl = 'https://webb3fitty.dev'
  
  const robotsContent = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /sanity/
Disallow: /brain-demo/
Disallow: /_next/
Disallow: /admin/

# Block AI crawlers while allowing search engines
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Search engine directives
Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl}
`

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
