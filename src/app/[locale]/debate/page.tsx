import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { setRequestLocale } from 'next-intl/server';
import { Navigation } from "@/components/navigation";
import { DebateRoomClient } from "@/components/debate-room-client";
import { getTranslations } from "next-intl/server";
import { Metadata } from 'next';
import { buildHreflang } from '@/lib/locales';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Debate" });

  const BASE_URL = 'https://www.giantswisdom.com';

  // Multilingual metadata mapping
  const titleMap: Record<string, string> = {
    ko: `${t("title")} | Giants Wisdom`,
    en: `${t("title")} | Giants Wisdom`,
    de: `${t("title")} | Giants Wisdom`,
    ja: `${t("title")} | Giants Wisdom`,
    es: `${t("title")} | Giants Wisdom`,
    fr: `${t("title")} | Giants Wisdom`,
    it: `${t("title")} | Giants Wisdom`,
    pt: `${t("title")} | Giants Wisdom`,
  };

  const descMap: Record<string, string> = {
    ko: t("description"),
    en: t("description"),
    de: t("description"),
    ja: t("description"),
    es: t("description"),
    fr: t("description"),
    it: t("description"),
    pt: t("description"),
  };

  const title = titleMap[locale] ?? titleMap['en'];
  const description = descMap[locale] ?? descMap['en'];

  // Build hreflang alternates for all locales
  const hreflangLanguages = buildHreflang(BASE_URL, '/debate');

  const ogImageUrl = `${BASE_URL}/images/debate-og.png`; // Fallback image or a custom debate OG banner if exists

  return {
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    title,
    description,
    keywords: [
      locale === 'ko' ? "역사의 토론방" : "The Debate Room",
      locale === 'ko' ? "AI 토론" : "AI Debate",
      locale === 'ko' ? "역사 위인 토론" : "Historical Giants Debate",
      locale === 'ko' ? "아리스토텔레스 니체 토론" : "Aristotle vs Nietzsche",
      "Giants Wisdom"
    ],
    alternates: buildSEOAlternates('/debate', locale),
  };
}

export default async function DebatePage({ params }: Props) {
  const { locale } = await params;

  // setRequestLocale ensures next-intl works seamlessly in static generation mode
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      <DebateRoomClient />
    </main>
  );
}
