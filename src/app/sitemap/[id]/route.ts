import { NextResponse } from 'next/server';
import { giants } from '@/lib/giants-data';
import { blogPosts } from '@/data/blog-posts';
import { LOCALES, buildHreflang } from '@/lib/locales';

const BASE_URL = 'https://www.giantswisdom.com';
const GIANTS_PER_CHUNK = 80;

function buildAlternates(path: string) {
  return buildHreflang(BASE_URL, path);
}

function generateXml(entries: any[]) {
  const xmlEntries = entries.map(entry => {
    let altXml = '';
    if (entry.alternates) {
      for (const [lang, href] of Object.entries(entry.alternates)) {
        altXml += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
      }
    }
    return `  <url>
    <loc>${entry.url}</loc>${altXml}
  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries}
</urlset>`;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  // Use a fallback to support both Next.js 14 and Next.js 15 params structure
  const rawParams = await context.params;
  const rawId = rawParams?.id || '';
  const id = rawId.replace('.xml', '');

  let entries: any[] = [];

  if (id === 'pages') {
    const staticPages = [
      { path: '' },
      { path: '/test' },
      { path: '/about' },
      { path: '/chats' },
      { path: '/debate' },
      { path: '/privacy' },
      { path: '/terms' },
    ];

    entries = LOCALES.flatMap((locale) =>
      staticPages.map((page) => ({
        url: `${BASE_URL}/${locale}${page.path}`,
        alternates: buildAlternates(page.path),
      }))
    );
  } else if (id === 'blog') {
    const blogListEntries = LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog`,
      alternates: buildAlternates('/blog'),
    }));

    const blogPostEntries = LOCALES.flatMap((locale) =>
      blogPosts.map((post) => ({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        alternates: buildAlternates(`/blog/${post.slug}`),
      }))
    );

    entries = [...blogListEntries, ...blogPostEntries];
  } else if (id.startsWith('giants-')) {
    const chunkIndex = parseInt(id.replace('giants-', ''), 10);
    if (!isNaN(chunkIndex)) {
      const start = chunkIndex * GIANTS_PER_CHUNK;
      const end = start + GIANTS_PER_CHUNK;
      const chunkGiants = giants.slice(start, end);

      entries = LOCALES.flatMap((locale) =>
        chunkGiants.map((giant) => ({
          url: `${BASE_URL}/${locale}/giant/${giant.slug}`,
          alternates: buildAlternates(`/giant/${giant.slug}`),
        }))
      );
    }
  }

  if (entries.length === 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return new NextResponse(generateXml(entries), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
