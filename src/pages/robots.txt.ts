import type { APIRoute } from 'astro'
import type { RobotsProps } from '@/types/robots';

export const GET: APIRoute = ({ site }: RobotsProps) => {
  const sitemapUrl = new URL('sitemap-0.xml', site).href

  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`.trim()

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
