import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { ConsultClient } from "@/components/consult-client"
import { Navigation } from "@/components/navigation"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    ko: '고민 상담 | Giants Wisdom',
    en: 'Get Advice | Giants Wisdom',
    de: 'Beratung | Giants Wisdom',
    ja: '相談する | Giants Wisdom',
    es: 'Consultar | Giants Wisdom',
    fr: 'Consulter | Giants Wisdom',
    it: 'Consulta | Giants Wisdom',
    pt: 'Consultar | Giants Wisdom'
  }
  const descriptionMap: Record<string, string> = {
    ko: '역사상 가장 위대한 사람들도 당신과 같은 고통을 겪었습니다.',
    en: "History's greatest minds faced the same struggles you do today."
  }
  return {
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    title: titles[locale] || titles.en,
    description: descriptionMap[locale] || '',
    alternates: buildSEOAlternates('/consult', locale)/consult`
    }
  }
}

export default async function ConsultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Navigation />
      <ConsultClient locale={locale} />
    </>
  );
}
