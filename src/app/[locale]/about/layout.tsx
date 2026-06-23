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

  const titleMap: Record<string, string> = {
    ko: '시대를 초월한 거인들의 전당 | 거인의 어깨',
    de: 'Halle der Riesen | Giants Wisdom',
    ja: '偉大な先人たちの殿堂 | Giants Wisdom',
    es: 'Salón de los Gigantes | Giants Wisdom',
    fr: 'Le Panthéon des Géants | Giants Wisdom',
    en: 'Hall of Giants | Giants Wisdom',
  };

  const descMap: Record<string, string> = {
    ko: '역사를 움직인 300인의 위인이 남긴 인생의 나침반. 세종대왕부터 아인슈타인까지, 당신의 고민에 답하는 거인들의 지혜를 만나보세요.',
    de: 'Der Lebenskompass von 300 Riesen, die die Geschichte bewegt haben. Von König Sejong bis Einstein – entdecken Sie die Weisheit der Riesen.',
    ja: '歴史を動かした300人の先人が残した人生の羅針盤。世宗大王からアインシュタインまで、あなたの悩みに答える先人たちの知恵に出会いましょう。',
    es: 'El mapa de vida dejado por 300 gigantes que movieron la historia. De Sejong el Grande a Einstein, descubre la sabiduría de los gigantes.',
    fr: 'La boussole de vie laissée par 300 géants qui ont marqué l’histoire. De Sejong le Grand à Einstein, découvrez la sagesse des géants.',
    en: 'The life compass left by 300 giants who moved history. From King Sejong to Einstein, meet the wisdom of the giants who answer your questions.',
  };
  const title = titleMap[locale] ?? titleMap['en'];
  const description = descMap[locale] ?? descMap['en'];

  const hreflangLanguages: Record<string, string> = { 'x-default': `${BASE_URL}/en/about` };
  for (const loc of LOCALES) {
    hreflangLanguages[loc] = `${BASE_URL}/${loc}/about`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: hreflangLanguages,
    },
    openGraph: {
      title,
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
