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

  const isKorean = locale === 'ko';
  const messages = await getMessages({ locale });
  const giantData = (messages.Giants as any)[giant.slug] || {
    name: giant.name,
    headline: giant.headline,
    shortDescription: giant.shortDescription,
    quote: giant.quote
  };

  const baseDesc = giantData.shortDescription || '';
  const slicedDesc = baseDesc.length > 120 ? baseDesc.slice(0, 120) + '...' : baseDesc;
  const isGerman = locale === 'de';
  const description = isKorean
    ? `${slicedDesc} ${giantData.name}와 AI로 직접 대화하고 지혜를 얻어보세요.`
    : isGerman
    ? `${slicedDesc} Chatten Sie per KI direkt mit ${giantData.name}, um Weisheit zu erlangen.`
    : `${slicedDesc} Chat directly with ${giantData.name} via AI to gain wisdom.`;

  const absoluteImageUrl = giant.imageUrl.startsWith('http')
    ? giant.imageUrl
    : `https://www.giantswisdom.com${giant.imageUrl}`;

  return {
    title: isKorean
      ? `${giantData.name} | AI 대화 - Giants Wisdom`
      : isGerman
      ? `${giantData.name} | KI Chat - Giants Wisdom`
      : `${giantData.name} | AI Chat - Giants Wisdom`,
    description,
    keywords: [
      giantData.name,
      giant.era,
      giant.field,
      isKorean ? "AI 대화" : isGerman ? "KI Chat" : "AI Chat",
      isKorean ? "역사 위인" : isGerman ? "Historische Persönlichkeit" : "Historical Figure",
      "Giants Wisdom"
    ],
    alternates: {
      canonical: `https://www.giantswisdom.com/${locale}/giant/${slug}`,
      languages: {
        'ko': `https://www.giantswisdom.com/ko/giant/${slug}`,
        'en': `https://www.giantswisdom.com/en/giant/${slug}`,
        'de': `https://www.giantswisdom.com/de/giant/${slug}`,
        'x-default': `https://www.giantswisdom.com/ko/giant/${slug}`
      }
    },
    openGraph: {
      title: `${giantData.name} - Giants Wisdom`,
      description: giantData.headline,
      url: `https://www.giantswisdom.com/${locale}/giant/${slug}`,
      type: 'website',
      images: [{
        url: absoluteImageUrl,
        width: 800,
        height: 800,
        alt: `${giantData.name} - Giants Wisdom`
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [absoluteImageUrl],
      title: isKorean
        ? `${giantData.name} | AI 대화 - Giants Wisdom`
        : `${giantData.name} | AI Chat - Giants Wisdom`,
      description,
    }
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
  
  // For locales without a dedicated narrative, fall back to English
  const getNarrativeText = (
    enVal: string, 
    koVal: string, 
    esVal?: string,
    deVal?: string,
    jaVal?: string,
    frVal?: string,
    ptVal?: string
  ) => {
    if (locale === 'ko') return koVal;
    if (locale === 'es' && esVal) return esVal;
    if (locale === 'de' && deVal) return deVal;
    if (locale === 'ja' && jaVal) return jaVal;
    if (locale === 'fr' && frVal) return frVal;
    if (locale === 'pt' && ptVal) return ptVal;
    return enVal;
  };

  const formattedNarrative = narrative ? {
    epic: getNarrativeText(narrative.epic_en, narrative.epic_ko, narrative.epic_es, narrative.epic_de, narrative.epic_ja, narrative.epic_fr, narrative.epic_pt),
    trials: getNarrativeText(narrative.trials_en, narrative.trials_ko, narrative.trials_es, narrative.trials_de, narrative.trials_ja, narrative.trials_fr, narrative.trials_pt),
    overcoming: getNarrativeText(narrative.overcoming_en, narrative.overcoming_ko, narrative.overcoming_es, narrative.overcoming_de, narrative.overcoming_ja, narrative.overcoming_fr, narrative.overcoming_pt),
    era: getNarrativeText(narrative.era_en, narrative.era_ko, narrative.era_es, narrative.era_de, narrative.era_ja, narrative.era_fr, narrative.era_pt),
    wisdom: (narrative.wisdom || []).map((w: any) => ({
      quote: getNarrativeText(w.quote_en, w.quote_ko, w.quote_es, w.quote_de, w.quote_ja, w.quote_fr, w.quote_pt),
      meaning: getNarrativeText(w.meaning_en, w.meaning_ko, w.meaning_es, w.meaning_de, w.meaning_ja, w.meaning_fr, w.meaning_pt)
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

  const BASE_URL = 'https://www.giantswisdom.com';
  const categoryTopics: Record<string, string[]> = {
    'achievement': ['Leadership', 'Achievement', 'Strategy'],
    'adversity': ['Resilience', 'Courage', 'Perseverance'],
    'wisdom': ['Philosophy', 'Wisdom', 'Ethics'],
    'creativity': ['Creativity', 'Art', 'Innovation'],
  };
  const eraYearMatch = (giant.era || '').match(/\((\d{4})[~\-–](\d{4})\)/);
  const birthDate = eraYearMatch?.[1];
  const deathDate = eraYearMatch?.[2];
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: giantTranslation.name || giant.name,
    description: (giantTranslation.shortDescription || giantTranslation.headline || '').slice(0, 150),
    ...(birthDate && { birthDate }),
    ...(deathDate && { deathDate }),
    knowsAbout: categoryTopics[giant.category] || ['History', 'Wisdom'],
    url: `${BASE_URL}/${locale}/giant/${giant.slug}`,
    image: giant.imageUrl.startsWith('http') ? giant.imageUrl : `${BASE_URL}${giant.imageUrl}`,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ko' ? '홈' : 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'ko' ? '거인들의 전당' : 'Hall of Giants', item: `${BASE_URL}/${locale}#giants` },
      { '@type': 'ListItem', position: 3, name: giantTranslation.name || giant.name, item: `${BASE_URL}/${locale}/giant/${giant.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <GiantDetailClient giant={giant} translations={translations} />
    </>
  );
}
