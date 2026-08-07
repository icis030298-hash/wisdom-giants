import { NextResponse } from 'next/server';
import incompleteGiants from '@/config/incomplete-giants.json';

const incompleteGiantsSet = new Set(incompleteGiants);
import { giants } from '@/lib/giants-data';
import { blogPosts } from '@/data/blog-posts';
import { LOCALES } from '@/lib/locales';
import { INDEXED_LOCALES, INDEXED_BLOG_LOCALES } from '@/config/locale-status';
import { isBlogTranslationMissing } from '@/lib/translation-status';

const BASE_URL = 'https://www.giantswisdom.com';
const GIANTS_PER_CHUNK = 80;

function buildAlternates(path: string) {
  const languages: Record<string, string> = { 'x-default': `${BASE_URL}/en${path}` };
  for (const locale of INDEXED_LOCALES) {
    languages[locale] = `${BASE_URL}/${locale}${path}`;
  }
  return languages;
}

function generateXml(entries: any[]) {
  const xmlEntries = entries.map(entry => {
    let altXml = '';
    if (entry.alternates) {
      for (const [lang, href] of Object.entries(entry.alternates)) {
        altXml += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
      }
    }
    const lastmodXml = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    const priorityXml = entry.priority ? `\n    <priority>${entry.priority}</priority>` : '';
    const changefreqXml = entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : '';
    return `  <url>
    <loc>${entry.url}</loc>${lastmodXml}${altXml}${priorityXml}${changefreqXml}
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
      { path: '/about' },
      { path: '/chats' },
      { path: '/debate' },
      { path: '/privacy' },
      { path: '/terms' },
    ];

    entries = INDEXED_LOCALES.flatMap((locale) =>
      staticPages.map((page) => {
        let priority = '0.5';
        let changefreq = 'monthly';
        if (page.path === '') {
          priority = '1.0';
          changefreq = 'daily';
        }
        return {
          url: `${BASE_URL}/${locale}${page.path}`,
          alternates: buildAlternates(page.path),
          lastmod: '2026-08-01',
          priority,
          changefreq,
        };
      })
    );
  } else if (id === 'blog') {
    const blogListEntries = INDEXED_BLOG_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog`,
      alternates: buildAlternates('/blog'),
      priority: '0.8',
      changefreq: 'weekly',
    }));

    // Circuit Breaker Check
    let untranslatedCount = 0;
    let totalEvaluated = 0;
    for (const loc of INDEXED_BLOG_LOCALES) {
      if (loc === 'en') continue;
      for (const p of blogPosts) {
        totalEvaluated++;
        const enTr = p.translations['en'];
        const tr = p.translations[loc];
        if (isBlogTranslationMissing(tr, enTr)) {
          untranslatedCount++;
        }
      }
    }

    const circuitBreakerTripped = totalEvaluated > 0 && (untranslatedCount / totalEvaluated) > 0.6;
    if (circuitBreakerTripped) {
      console.error(`[Sitemap Circuit Breaker Tripped] Untranslated ratio is ${(untranslatedCount / totalEvaluated * 100).toFixed(1)}% (>60%). Data load suspicious!`);
    }

    const blogPostEntries = INDEXED_BLOG_LOCALES.flatMap((locale) =>
      blogPosts
        .filter((post) => {
          if (circuitBreakerTripped) return true; // Keep all if circuit breaker tripped
          if (locale === 'en') return true;
          const tr = post.translations[locale];
          const enTr = post.translations['en'];
          // Exclude missing / empty-shell / placeholder / stub translations.
          if (isBlogTranslationMissing(tr, enTr)) return false;
          return true;
        })
        .map((post) => ({
          url: `${BASE_URL}/${locale}/blog/${post.slug}`,
          alternates: buildAlternates(`/blog/${post.slug}`),
          lastmod: post.publishedAt || undefined,
          priority: '0.7',
          changefreq: 'monthly',
        }))
    );

    entries = [...blogListEntries, ...blogPostEntries];
  } else if (id.startsWith('giants-')) {
    const chunkIndex = parseInt(id.replace('giants-', ''), 10);
    if (!isNaN(chunkIndex)) {
      const validGiants = giants.filter(giant => !incompleteGiantsSet.has(giant.slug));

      const start = chunkIndex * GIANTS_PER_CHUNK;
      const end = start + GIANTS_PER_CHUNK;
      const chunkGiants = validGiants.slice(start, end);

      entries = INDEXED_LOCALES.flatMap((locale) =>
        chunkGiants.map((giant) => ({
          url: `${BASE_URL}/${locale}/giant/${giant.slug}`,
          alternates: buildAlternates(`/giant/${giant.slug}`),
          lastmod: (giant as any).updatedAt || undefined,
          priority: '0.7',
          changefreq: 'weekly',
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
