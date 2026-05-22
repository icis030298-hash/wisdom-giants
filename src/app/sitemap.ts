import { MetadataRoute } from 'next'
import { giants } from '@/lib/giants-data'

const BASE_URL = 'https://www.giantswisdom.com'
const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt'] as const
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

  return [...staticEntries, ...giantEntries]
}
