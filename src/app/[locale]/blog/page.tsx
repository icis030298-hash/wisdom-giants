import { buildSEOAlternates, isLocaleIndexed, isBlogLocaleIndexed } from "@/config/locale-status";
import { Metadata } from 'next'
import { BlogListClient } from '@/components/blog-list-client'
import { setRequestLocale } from 'next-intl/server'
import { Navigation } from '@/components/navigation'
import { ConditionalAdSense } from '@/components/conditional-adsense'
import { buildHreflang } from '@/lib/locales'
import { getTranslations } from 'next-intl/server'
import fs from 'fs'
import path from 'path'
import { blogPosts } from '@/data/blog-posts'
import { giants } from '@/lib/giants-data'
import { getReadTime } from '@/utils/blog'
import type { BlogCardData } from '@/types/blog-card'

export const revalidate = 604800; // 7 days: cache static blog index

interface Props {
  params: Promise<{ locale: string }>
}

const BASE_URL = 'https://www.giantswisdom.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  
  const titleMap: Record<string, string> = {
    ko: "거인들의 지혜 블로그",
    en: "Wisdom Blog",
    de: "Weisheits-Blog",
    ja: "偉人たちの知恵ブログ",
    es: "Blog de Sabiduría",
    fr: "Blog de la Sagesse",
    it: "Blog della Saggezza",
    pt: "Blog da Sabedoria",
  }

  const descMap: Record<string, string> = {
    ko: "역사 속 위인들의 철학과 지혜를 현대적 관점에서 풀어쓴 블로그입니다.",
    en: "Explore the philosophy and wisdom of historical giants in modern context.",
    de: "Erkunden Sie die Philosophie und Weisheit historischer Giganten im modernen Kontext.",
    ja: "歴史上の偉人たちの哲学と知恵を現代的な視点から紐解くブログです。",
    es: "Explore la filosofía y la sabiduría de los gigantes históricos en el contexto moderno.",
    fr: "Explorez la philosophie et la sagesse des géants historiques dans un contexte moderne.",
    it: "Esplora la filosofia e la saggezza dei giganti storici nel contesto moderno.",
    pt: "Explore a filosofia e a sabedoria dos gigantes históricos no contexto moderno.",
  }

  const title = titleMap[locale] ?? titleMap['en']
  const description = descMap[locale] ?? descMap['en']

  const hreflangLanguages = buildHreflang(BASE_URL, '/blog')

  return {
    robots: { index: isBlogLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    title,
    description,
    alternates: buildSEOAlternates('/blog', locale),
  };
}


// Portraits that exist on disk but whose giant is not in the roster — a few
// posts still point at slugs that were removed. Resolved once per process.
const portraitDir = path.join(process.cwd(), 'public/images/giants')
let portraitFiles: Set<string> = new Set()
try {
  portraitFiles = new Set(fs.readdirSync(portraitDir))
} catch {
  portraitFiles = new Set()
}

function resolvePortrait(slug: string | undefined): string | null {
  if (!slug) return null
  const giant = giants.find((g) => g.slug === slug)
  if (giant?.imageUrl) return giant.imageUrl
  for (const ext of ['jpg', 'png', 'webp']) {
    if (portraitFiles.has(`${slug}.${ext}`)) return `/images/giants/${slug}.${ext}`
  }
  return null
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  // Build the card list here so the client never sees the article bodies.
  const tGiants = await getTranslations({ locale, namespace: 'Giants' })
  const giantName = (slug: string | undefined, fallback: string) => {
    if (!slug) return fallback
    try {
      const raw = tGiants.raw(slug) as any
      return raw && typeof raw === 'object' && 'name' in raw ? raw.name : fallback
    } catch {
      return fallback
    }
  }

  const dateFormatter = (() => {
    try {
      // Pinned to UTC so the printed day always matches the stored timestamp,
      // the sitemap's lastmod and the JSON-LD datePublished. Without it a
      // 20:00Z post reads as the next day on any server east of UTC.
      return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    } catch {
      return null
    }
  })()

  const posts: BlogCardData[] = blogPosts.map((post: any) => {
    const translation = post.translations[locale] || post.translations['en']
    const slug = post.giantSlug || (post.giantSlugs && post.giantSlugs[0])
    const parsed = new Date(post.publishedAt)
    const valid = !Number.isNaN(parsed.getTime())

    return {
      slug: post.slug,
      category: post.category,
      publishedAt: valid && dateFormatter ? dateFormatter.format(parsed) : String(post.publishedAt ?? ''),
      publishedAtTime: valid ? parsed.getTime() : 0,
      title: (translation?.title ?? '').replace(/\*\*/g, ''),
      description: translation?.description ?? '',
      readTime: getReadTime(translation?.content ?? '', locale),
      giantName: giantName(slug, giants.find((g) => g.slug === slug)?.name || slug || ''),
      giantImage: resolvePortrait(slug),
    }
  })

  const titleMap: Record<string, string> = {
    ko: "거인들의 지혜 블로그",
    en: "Wisdom Blog",
    de: "Weisheits-Blog",
    ja: "偉人たちの知恵ブログ",
    es: "Blog de Sabiduría",
    fr: "Blog de la Sagesse",
    it: "Blog della Saggezza",
    pt: "Blog da Sabedoria",
  }

  const descMap: Record<string, string> = {
    ko: "역사 속 위인들의 철학과 지혜를 현대적 관점에서 풀어쓴 블로그입니다.",
    en: "Explore the philosophy and wisdom of historical giants in modern context.",
    de: "Erkunden Sie die Philosophie und Weisheit historischer Giganten im modernen Kontext.",
    ja: "歴史上の偉人たちの哲学と知恵を現代的な視点から紐解くブログです。",
    es: "Explore la filosofía y la sabiduría de los gigantes históricos en el contexto moderno.",
    fr: "Explorez la philosophie et la sagesse des géants historiques dans un contexte moderne.",
    it: "Esplora la filosofia e la saggezza dei giganti storici nel contesto moderno.",
    pt: "Explore a filosofia e a sabedoria dos gigantes históricos no contexto moderno.",
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: titleMap[locale] ?? titleMap['en'],
    description: descMap[locale] ?? descMap['en'],
    url: `${BASE_URL}/${locale}/blog`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <ConditionalAdSense />
      <Navigation />
      <BlogListClient posts={posts} />
    </>
  )
}
