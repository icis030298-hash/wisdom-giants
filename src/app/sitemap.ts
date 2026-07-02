import { MetadataRoute } from 'next'
import { giants } from '@/lib/giants-data'
import { blogPosts } from '@/data/blog-posts'

import { LOCALES, buildHreflang } from '@/lib/locales'

const BASE_URL = 'https://www.giantswisdom.com'

/** Build alternates object for a given path (e.g. '' | '/test' | '/giant/steve-jobs') */
function buildAlternates(path: string) {
  return { languages: buildHreflang(BASE_URL, path) }
}

const GIANTS_PER_CHUNK = 80;

export async function generateSitemaps() {
  const giantChunksCount = Math.ceil(giants.length / GIANTS_PER_CHUNK);
  const giantSitemaps = Array.from({ length: giantChunksCount }).map((_, i) => ({
    id: `giants-${i}`
  }));

  return [
    { id: 'pages' },
    { id: 'blog' },
    ...giantSitemaps
  ];
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  if (id === 'pages') {
    const staticPages = [
      { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
      { path: '/test', changeFrequency: 'weekly' as const, priority: 0.9 },
      { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
      { path: '/chats', changeFrequency: 'weekly' as const, priority: 0.7 },
      { path: '/debate', changeFrequency: 'daily' as const, priority: 0.9 },
      { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.3 },
      { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.3 },
    ];

    const staticEntries = LOCALES.flatMap((locale) =>
      staticPages.map((page) => ({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: buildAlternates(page.path),
      }))
    );

    return staticEntries;
  }

  if (id === 'blog') {
    const blogListEntries = LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: buildAlternates('/blog'),
    }));

    const blogPostEntries = LOCALES.flatMap((locale) =>
      blogPosts.map((post) => ({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: buildAlternates(`/blog/${post.slug}`),
      }))
    );

    return [...blogListEntries, ...blogPostEntries];
  }

  if (id.startsWith('giants-')) {
    const chunkIndex = parseInt(id.replace('giants-', ''), 10);
    const start = chunkIndex * GIANTS_PER_CHUNK;
    const end = start + GIANTS_PER_CHUNK;
    const chunkGiants = giants.slice(start, end);

    const giantEntries = LOCALES.flatMap((locale) =>
      chunkGiants.map((giant) => ({
        url: `${BASE_URL}/${locale}/giant/${giant.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: buildAlternates(`/giant/${giant.slug}`),
      }))
    );

    return giantEntries;
  }

  return [];
}
