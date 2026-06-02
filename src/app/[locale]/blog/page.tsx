import { Metadata } from 'next'
import { BlogListClient } from '@/components/blog-list-client'
import { setRequestLocale } from 'next-intl/server'
import { Navigation } from '@/components/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Props {
  params: Promise<{ locale: string }>
}

const BASE_URL = 'https://www.giantswisdom.com'
const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  
  const titleMap: Record<string, string> = {
    ko: "거인들의 지혜 블로그 | Giants Wisdom",
    en: "Wisdom Blog | Giants Wisdom",
    de: "Weisheits-Blog | Giants Wisdom",
    ja: "偉人たちの知恵ブログ | Giants Wisdom",
    es: "Blog de Sabiduría | Giants Wisdom",
    fr: "Blog de la Sagesse | Giants Wisdom",
    it: "Blog della Saggezza | Giants Wisdom",
    pt: "Blog da Sabedoria | Giants Wisdom",
  }

  const descMap: Record<string, string> = {
    ko: "역사 속 위인들의 철학과 지혜를 현대적 관점에서 풀어쓴 블로그입니다.",
    en: "Explore the philosophy and wisdom of historical giants in modern context.",
    de: "Erkunden Sie die Philosophie und Weisheit historischer Giganten im modernen Kontext.",
    ja: "歴史上の偉人たちの哲学と知恵를現代的な視点から紐解くブログです。",
    es: "Explore la filosofía y la sabiduría de los gigantes históricos en el contexto moderno.",
    fr: "Explorez la philosophie et la sagesse des géants historiques dans un contexte moderne.",
    it: "Esplora la filosofia e la saggezza dei giganti storici nel contesto moderno.",
    pt: "Explore a filosofia e a sabedoria dos gigantes históricos no contexto moderno.",
  }

  const title = titleMap[locale] ?? titleMap['en']
  const description = descMap[locale] ?? descMap['en']

  const hreflangLanguages: Record<string, string> = {
    'x-default': `${BASE_URL}/ko/blog`,
  }
  for (const loc of LOCALES) {
    hreflangLanguages[loc] = `${BASE_URL}/${loc}/blog`
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: hreflangLanguages,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/blog`,
      type: 'website',
      images: [{
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: title
      }]
    }
  }
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Navigation />
      <BlogListClient />
    </>
  )
}
