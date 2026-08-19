import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { giantsData } from "@/data/giants";
import type { Metadata } from 'next'
import { buildHreflang } from '@/lib/locales'

export const revalidate = 604800; // 7 days: cache static about layout


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const BASE_URL = 'https://www.giantswisdom.com';

  const titleMap: Record<string, string> = {
    ko: '시대를 초월한 거인들의 전당',
    de: 'Halle der Riesen',
    ja: '偉大な先人たちの殿堂',
    es: 'Salón de los Gigantes',
    fr: 'Le Panthéon des Géants',
    en: 'Hall of Giants',
  };

  const descMap: Record<string, string> = {
    ko: `역사를 움직인 ${giantsData.length}인의 위인이 남긴 인생의 나침반. 세종대왕부터 아인슈타인까지, 당신의 고민에 답하는 거인들의 지혜를 만나보세요.`,
    de: `Der Lebenskompass von ${giantsData.length} Riesen, die die Geschichte bewegt haben. Von König Sejong bis Einstein – entdecken Sie die Weisheit der Riesen.`,
    ja: `歴史を動かした${giantsData.length}人の先人が残した人生の羅針盤。世宗大王からアインシュタインまで、あなたの悩みに答える先人たちの知恵に出会いましょう。`,
    es: `El mapa de vida dejado por ${giantsData.length} gigantes que movieron la historia. De Sejong el Grande a Einstein, descubre la sabiduría de los gigantes.`,
    fr: `La boussole de vie laissée par ${giantsData.length} géants qui ont marqué l’histoire. De Sejong le Grand à Einstein, découvrez la sagesse des géants.`,
    en: `The life compass left by ${giantsData.length} giants who moved history. From King Sejong to Einstein, meet the wisdom of the giants who answer your questions.`,
  };
  const title = titleMap[locale] ?? titleMap['en'];
  const description = descMap[locale] ?? descMap['en'];

  const hreflangLanguages = buildHreflang(BASE_URL, '/about');

  return {
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    title,
    description,
    alternates: buildSEOAlternates('/about', locale),
  };
}


export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
