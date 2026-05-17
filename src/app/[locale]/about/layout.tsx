import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isKorean = locale === 'ko'
  return {
    title: 'About | Giants Wisdom',
    description: isKorean
      ? '역사를 바꾼 100인의 위인들과 AI로 대화하세요. 30가지 상황 질문으로 나의 유산 DNA를 분석하고 영혼의 단짝 위인을 찾아보세요.'
      : "Chat with 100+ of history's greatest minds using AI. Discover your Heritage DNA through 30 situational questions and find your soul-matched historical giant.",
    openGraph: {
      title: 'About | Giants Wisdom',
      description: isKorean
        ? '역사를 바꾼 100인의 위인들과 AI로 대화하세요.'
        : "Chat with 100+ of history's greatest minds using AI.",
    },
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
