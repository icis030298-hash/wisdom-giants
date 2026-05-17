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
  return {
    title: 'About | Giants Wisdom',
    description: isKorean
      ? '역사를 바꾼 100인의 위인들과 AI로 대화하세요.'
      : "Chat with 100+ of history's greatest minds using AI.",
    openGraph: {
      title: 'About | Giants Wisdom',
      description: isKorean
        ? '역사를 바꾼 100인의 위인들과 AI로 대화하세요.'
        : "Chat with 100+ of history's greatest minds using AI.",
      type: 'website',
    },
  }
}

export default function AboutPage() {
  return <AboutPageClient />
}
