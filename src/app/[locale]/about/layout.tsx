import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isKorean = locale === 'ko'
  const isGerman = locale === 'de'
  
  const description = isKorean
    ? '역사를 바꾼 95인의 위인들과 AI로 대화하세요.'
    : isGerman
    ? 'Chatte mit 95+ der größten Köpfe der Geschichte per KI.'
    : "Chat with 95+ of history's greatest minds using AI."

  return {
    title: 'About | Giants Wisdom',
    description,
    openGraph: {
      title: 'About | Giants Wisdom',
      description,
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
