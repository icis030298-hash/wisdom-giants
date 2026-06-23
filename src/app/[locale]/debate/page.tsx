import { setRequestLocale } from 'next-intl/server';
import { Navigation } from "@/components/navigation";
import { DebateRoomClient } from "@/components/debate-room-client";
import { getTranslations } from "next-intl/server";
import { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Debate" });

  const BASE_URL = 'https://www.giantswisdom.com';
  const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt'] as const;

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
  const hreflangLanguages: Record<string, string> = {
    'x-default': `${BASE_URL}/en/debate`,
  };
  for (const loc of LOCALES) {
    hreflangLanguages[loc] = `${BASE_URL}/${loc}/debate`;
  }

  const ogImageUrl = `${BASE_URL}/images/debate-og.png`; // Fallback image or a custom debate OG banner if exists

  return {
    title,
    description,
    keywords: [
      locale === 'ko' ? "역사의 토론방" : "The Debate Room",
      locale === 'ko' ? "AI 토론" : "AI Debate",
      locale === 'ko' ? "역사 위인 토론" : "Historical Giants Debate",
      locale === 'ko' ? "아리스토텔레스 니체 토론" : "Aristotle vs Nietzsche",
      "Giants Wisdom"
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/debate`,
      languages: hreflangLanguages,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/debate`,
      type: 'website',
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageUrl],
      title,
      description,
    }
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
