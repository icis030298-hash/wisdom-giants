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
  const BASE_URL = 'https://www.giantswisdom.com';
  const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr'] as const;

  const descMap: Record<string, string> = {
    ko: '역사를 바꾼 95인의 위인들과 AI로 대화하세요.',
    de: 'Chatte mit 95+ der größten Köpfe der Geschichte per KI.',
    ja: 'AIで歴史上の偉大な先人95人以上と対話しましょう。',
    es: 'Conversa con más de 95 grandes figuras de la historia mediante IA.',
    fr: "Conversez avec plus de 95 grandes figures de l'histoire grâce à l'IA.",
    en: "Chat with 95+ of history's greatest minds using AI.",
  };
  const description = descMap[locale] ?? descMap['en'];

  const hreflangLanguages: Record<string, string> = { 'x-default': `${BASE_URL}/ko/about` };
  for (const loc of LOCALES) {
    hreflangLanguages[loc] = `${BASE_URL}/${loc}/about`;
  }

  return {
    title: 'About | Giants Wisdom',
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: hreflangLanguages,
    },
    openGraph: {
      title: 'About | Giants Wisdom',
      description,
      url: `${BASE_URL}/${locale}/about`,
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
