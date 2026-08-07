import type { Metadata } from 'next'
import { AboutPageClient } from './about-client'
import { Navigation } from '@/components/navigation'

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
  const pageTitle = titleMap[locale] || 'About'
  
  const descMap: Record<string, string> = {
    ko: 'Giants Wisdom 프로젝트 소개. 역사를 바꾼 493명 위인들의 지혜와 통찰을 AI 대화를 통해 현대인들에게 전파하는 글로벌 인문학 플랫폼입니다.',
    de: 'Über das Giants Wisdom Projekt. Eine globale Plattform, die die Weisheit von 493 historischen Persönlichkeiten per KI vermittelt.',
    ja: 'Giants Wisdomプロジェクトについて。歴史を変えた493人の偉人たちの知恵と洞察をAI対話を通じて現代に届ける人文学プラットフォームです。',
    es: 'Acerca del proyecto Giants Wisdom. Una plataforma global que difunde la sabiduría de 493 gigantes históricos a través de IA.',
    fr: 'À propos du projet Giants Wisdom. Une plateforme mondiale diffusant la sagesse de 493 géants historiques via l\'IA.',
    it: 'Informazioni sul progetto Giants Wisdom. Una piattaforma globale che diffonde la saggezza di 493 giganti storici tramite l\'IA.',
    pt: 'Sobre o projeto Giants Wisdom. Uma plataforma global que compartilha a sabedoria de 493 gigantes históricos por IA.',
    en: 'About Giants Wisdom project. A global humanities platform sharing the timeless wisdom of 493 historical giants through AI conversations.',
  }
  const description = descMap[locale] || descMap['en']

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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Giants Wisdom",
    "url": `https://www.giantswisdom.com/${locale}/about`,
    "description": "A global humanities platform sharing the timeless wisdom of 493 historical giants through AI conversations."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <AboutPageClient />
    </>
  )
}
