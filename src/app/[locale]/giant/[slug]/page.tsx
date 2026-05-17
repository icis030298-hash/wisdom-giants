import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { giants } from "@/lib/giants-data";
import { GiantDetailClient } from "@/components/giant-detail-client";
import { Metadata } from 'next';
import finalNarratives from "@/data/final-narratives.json";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const giant = giants.find(g => g.slug === slug);
  
  if (!giant) return {};

  const messages = await getMessages({ locale });
  const giantData = (messages.Giants as any)[giant.slug] || {
    name: giant.name,
    headline: giant.headline,
    shortDescription: giant.shortDescription,
    quote: giant.quote
  };

  return {
    title: `${giantData.name} | ${giantData.headline} - Giants Wisdom`,
    description: `${giantData.shortDescription} Explore the wisdom, struggles, and recovery of ${giantData.name}. "${giantData.quote}"`,
    openGraph: {
      title: `${giantData.name} - Giants Wisdom`,
      description: giantData.headline,
      images: [giant.imageUrl],
    },
  };
}

export default async function GiantDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  
  setRequestLocale(locale);
  
  const giant = giants.find(g => g.slug === slug);
  if (!giant) notFound();

  const messages = await getMessages({ locale });
  
  // Find standardized narrative data
  const narrative = (finalNarratives as any)[giant.slug];
  
  const formattedNarrative = narrative ? {
    epic: locale === 'en' ? narrative.epic_en : narrative.epic_ko,
    trials: locale === 'en' ? narrative.trials_en : narrative.trials_ko,
    overcoming: locale === 'en' ? narrative.overcoming_en : narrative.overcoming_ko,
    era: locale === 'en' ? narrative.era_en : narrative.era_ko,
    wisdom: (narrative.wisdom || []).map((w: any) => ({
      quote: locale === 'en' ? w.quote_en : w.quote_ko,
      meaning: locale === 'en' ? w.meaning_en : w.meaning_ko
    }))
  } : null;

  const giantTranslation = (messages.Giants as any)[giant.slug] || {
    name: giant.name,
    headline: giant.headline,
    shortDescription: giant.shortDescription,
    pain: "데이터 준비 중...",
    recovery: "데이터 준비 중...",
    lessons: [],
    quote: giant.quote,
    persona: `당신은 ${giant.name}입니다.`,
    era: "역사의 거인"
  };

  const translations = {
    giantDetail: messages.GiantDetail,
    giants: giantTranslation,
    giantsGrid: messages.GiantsGrid,
    narrative: formattedNarrative
  };

  return <GiantDetailClient giant={giant} translations={translations} />;
}
