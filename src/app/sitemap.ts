import { MetadataRoute } from 'next'
import { giants } from '@/lib/giants-data'
import { blogPosts } from '@/data/blog-posts'

const BASE_URL = 'https://www.giantswisdom.com'
const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'] as const
type Locale = typeof LOCALES[number]

// Locale → ISO 639-1 hreflang tag mapping
const HREFLANG: Record<Locale, string> = {
  ko: 'ko',
  en: 'en',
  de: 'de',
  ja: 'ja',
  es: 'es',
  fr: 'fr',
  it: 'it',
  pt: 'pt',
  ar: 'ar',
  hi: 'hi',
  ru: 'ru',
  zh: 'zh',
}

/** Build alternates object for a given path (e.g. '' | '/test' | '/giant/steve-jobs') */
function buildAlternates(path: string) {
  const languages: Record<string, string> = { 'x-default': `${BASE_URL}/ko${path}` }
  for (const locale of LOCALES) {
    languages[HREFLANG[locale]] = `${BASE_URL}/${locale}${path}`
  }
  return { languages }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Static pages — one canonical per locale, each carrying all alternates
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/test', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/chats', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/debate', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  const staticEntries = LOCALES.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: buildAlternates(page.path),
    }))
  )

  // 2. Dynamic giant pages — 99 giants × 8 locales (ko, en, de, ja, es, fr, it, pt) = 792 entries
  const giantEntries = LOCALES.flatMap((locale) =>
    giants.map((giant) => ({
      url: `${BASE_URL}/${locale}/giant/${giant.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: buildAlternates(`/giant/${giant.slug}`),
    }))
  )

  // 3. Dynamic blog pages — 8 locales list + (20 posts × 8 locales) = 168 entries
  const blogListEntries = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: buildAlternates('/blog'),
  }))

  const blogPostEntries = LOCALES.flatMap((locale) =>
    blogPosts.map((post) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: buildAlternates(`/blog/${post.slug}`),
    }))
  )

  return [...staticEntries, ...giantEntries, ...blogListEntries, ...blogPostEntries]
}
