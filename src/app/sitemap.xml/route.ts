import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.giantswisdom.com';
  const sitemaps = [
    'pages',
    'blog',
    'giants-0',
    'giants-1',
    'giants-2',
    'giants-3',
    'giants-4',
    'giants-5',
    'giants-6',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(id => `  <sitemap>
    <loc>${baseUrl}/sitemap/${id}.xml</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
