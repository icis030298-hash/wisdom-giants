import type { Metadata } from 'next'
import { AboutPageClient } from './about-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isKorean = locale === 'ko'
  const isGerman = locale === 'de'

  const titleMap: Record<string, string> = {
    ko: '소개',
    de: 'Über uns',
    ja: 'サービス紹介',
    es: 'Acerca de',
    fr: 'À Propos',
    it: 'Chi Siamo',
    pt: 'Sobre',
    en: 'About'
  }
  const pageTitle = `${titleMap[locale] || 'About'} | Giants Wisdom`
  
  const description = isKorean
    ? '역사를 바꾼 140여 명의 위인들과 AI로 대화하세요.'
    : isGerman
    ? 'Chatte mit 140+ der größten Köpfe der Geschichte per KI.'
    : "Chat with 140+ of history's greatest minds using AI."

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      type: 'website',
    },
  }
}

export default function AboutPage() {
  return <AboutPageClient />
}
