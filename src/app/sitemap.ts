import { MetadataRoute } from 'next'
import { giants } from '@/lib/giants-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.giantswisdom.com'
  const locales = ['ko', 'en', 'de']

  // 1. Static Pages (Home, About, Test)
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/test', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )

  // 2. Dynamic Giant Pages
  const giantEntries = locales.flatMap((locale) =>
    giants.map((giant) => ({
      url: `${baseUrl}/${locale}/giant/${giant.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  return [...staticEntries, ...giantEntries]
}
