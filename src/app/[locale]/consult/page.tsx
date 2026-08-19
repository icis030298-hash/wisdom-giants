import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { ConsultClient } from "@/components/consult-client"
import { Navigation } from "@/components/navigation"
import { getTranslations } from "next-intl/server"
import { eraForLocale } from "@/lib/era"
import fs from "fs"
import path from "path"

// The era phrases come from giants-summary.json, the same source the giant
// detail page, the cards and the blog read. They used to come from
// messages.Giants.<slug>.era, which still holds a "Giants of History"
// placeholder for 44 of the 493. The file is 10.8MB, so it is read here and
// only the resolved strings — roughly 20KB — travel to the client.
const summaryPath = path.join(process.cwd(), "src/data/giants-summary.json")
let giantsSummary: Record<string, any> = {}
if (fs.existsSync(summaryPath)) {
  giantsSummary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"))
}

function buildEraMap(locale: string): Record<string, string> {
  const map: Record<string, string> = {}
  for (const slug of Object.keys(giantsSummary)) {
    const era = eraForLocale(giantsSummary[slug], locale)
    if (era) map[slug] = era.replace(/^\[(?:RTL\s+)?[a-z]{2,3}\]\s*/i, "").trim()
  }
  return map
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    ko: '고민 상담',
    en: 'Get Advice',
    de: 'Beratung',
    ja: '相談する',
    es: 'Consultar',
    fr: 'Consulter',
    it: 'Consulta',
    pt: 'Consultar'
  }
  const descriptionMap: Record<string, string> = {
    ko: '역사상 가장 위대한 사람들도 당신과 같은 고통을 겪었습니다.',
    en: "History's greatest minds faced the same struggles you do today."
  }
  return {
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    title: titles[locale] || titles.en,
    description: descriptionMap[locale] || '',
    alternates: buildSEOAlternates('/consult', locale)
  }
}

export default async function ConsultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Navigation />
      <ConsultClient locale={locale} eraBySlug={buildEraMap(locale)} />
    </>
  );
}
