import { buildSEOAlternates, isLocaleIndexed, isBlogLocaleIndexed } from "@/config/locale-status";
import { Metadata } from 'next'
import { BlogListClient } from '@/components/blog-list-client'
import { setRequestLocale } from 'next-intl/server'
import { Navigation } from '@/components/navigation'
import { ConditionalAdSense } from '@/components/conditional-adsense'
import { buildHreflang } from '@/lib/locales'

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


export default async function BlogListPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

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
      <BlogListClient />
    </>
  )
}
