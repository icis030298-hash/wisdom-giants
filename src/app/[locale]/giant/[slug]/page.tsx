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

  const BASE_URL = 'https://www.giantswisdom.com';
  const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt'] as const;

  const baseDesc = giantData.shortDescription || '';
  const slicedDesc = baseDesc.length > 120 ? baseDesc.slice(0, 120) + '...' : baseDesc;

  // Full multilingual title & description
  const titleMap: Record<string, string> = {
    ko: `${giantData.name} | AI 대화 - Giants Wisdom`,
    de: `${giantData.name} | KI Chat - Giants Wisdom`,
    ja: `${giantData.name} | AIチャット - Giants Wisdom`,
    es: `${giantData.name} | Chat IA - Giants Wisdom`,
    fr: `${giantData.name} | Chat IA - Giants Wisdom`,
    it: `${giantData.name} | Chat IA - Giants Wisdom`,
    pt: `${giantData.name} | Chat IA - Giants Wisdom`,
    en: `${giantData.name} | AI Chat - Giants Wisdom`,
  };
  const descMap: Record<string, string> = {
    ko: `${slicedDesc} ${giantData.name}와 AI로 직접 대화하고 지혜를 얻어보세요.`,
    de: `${slicedDesc} Chatten Sie per KI direkt mit ${giantData.name}, um Weisheit zu erlangen.`,
    ja: `${slicedDesc} AIで${giantData.name}と直接対話し、知恵を得てください。`,
    es: `${slicedDesc} Chatea directamente con ${giantData.name} a través de IA para ganar sabiduría.`,
    fr: `${slicedDesc} Chattez directement avec ${giantData.name} via l'IA pour acquérir de la sagesse.`,
    it: `${slicedDesc} Chatta direttamente con ${giantData.name} tramite IA per acquisire saggezza.`,
    pt: `${slicedDesc} Converse diretamente com ${giantData.name} via IA para obter sabedoria.`,
    en: `${slicedDesc} Chat directly with ${giantData.name} via AI to gain wisdom.`,
  };
  const title = titleMap[locale] ?? titleMap['en'];
  const description = descMap[locale] ?? descMap['en'];

  const absoluteImageUrl = giant.imageUrl.startsWith('http')
    ? giant.imageUrl
    : `${BASE_URL}${giant.imageUrl}`;

  // Build full hreflang alternates for all 6 locales
  const hreflangLanguages: Record<string, string> = {
    'x-default': `${BASE_URL}/ko/giant/${slug}`,
  };
  for (const loc of LOCALES) {
    hreflangLanguages[loc] = `${BASE_URL}/${loc}/giant/${slug}`;
  }

  return {
    title,
    description,
    keywords: [
      giantData.name,
      giant.era,
      giant.field,
      locale === 'ko' ? "AI 대화" : locale === 'de' ? "KI Chat" : locale === 'ja' ? "AIチャット" : locale === 'it' ? "Chat IA" : locale === 'pt' ? "Chat IA" : "AI Chat",
      locale === 'ko' ? "역사 위인" : locale === 'de' ? "Historische Persönlichkeit" : locale === 'ja' ? "歴史上の偉人" : locale === 'it' ? "Figura Storica" : locale === 'pt' ? "Figura Histórica" : "Historical Figure",
      "Giants Wisdom"
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/giant/${slug}`,
      languages: hreflangLanguages,
    },
    openGraph: {
      title: `${giantData.name} - Giants Wisdom`,
      description: giantData.headline || description,
      url: `${BASE_URL}/${locale}/giant/${slug}`,
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
      title,
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
    ptVal?: string,
    itVal?: string
  ) => {
    if (locale === 'ko') return koVal;
    if (locale === 'es' && esVal) return esVal;
    if (locale === 'de' && deVal) return deVal;
    if (locale === 'ja' && jaVal) return jaVal;
    if (locale === 'fr' && frVal) return frVal;
    if (locale === 'pt' && ptVal) return ptVal;
    if (locale === 'it' && itVal) return itVal;
    return enVal;
  };

  // Locales with full narrative translations in final-narratives.json
  const NARRATIVE_LOCALES = ['ko', 'en', 'es', 'de', 'ja', 'fr'];
  const hasNarrativeLocale = NARRATIVE_LOCALES.includes(locale);

  const formattedNarrative = narrative ? {
    epic: getNarrativeText(narrative.epic_en, narrative.epic_ko, narrative.epic_es, narrative.epic_de, narrative.epic_ja, narrative.epic_fr, narrative.epic_pt, narrative.epic_it),
    // For IT/PT without dedicated translations, return undefined so page falls back to messages.json pain/recovery/era
    trials: hasNarrativeLocale ? getNarrativeText(narrative.trials_en, narrative.trials_ko, narrative.trials_es, narrative.trials_de, narrative.trials_ja, narrative.trials_fr, narrative.trials_pt, narrative.trials_it) : undefined,
    overcoming: hasNarrativeLocale ? getNarrativeText(narrative.overcoming_en, narrative.overcoming_ko, narrative.overcoming_es, narrative.overcoming_de, narrative.overcoming_ja, narrative.overcoming_fr, narrative.overcoming_pt, narrative.overcoming_it) : undefined,
    era: hasNarrativeLocale ? getNarrativeText(narrative.era_en, narrative.era_ko, narrative.era_es, narrative.era_de, narrative.era_ja, narrative.era_fr, narrative.era_pt, narrative.era_it) : undefined,
    wisdom: (narrative.wisdom || []).map((w: any) => ({
      quote: getNarrativeText(w.quote_en, w.quote_ko, w.quote_es, w.quote_de, w.quote_ja, w.quote_fr, w.quote_pt, w.quote_it),
      meaning: getNarrativeText(w.meaning_en, w.meaning_ko, w.meaning_es, w.meaning_de, w.meaning_ja, w.meaning_fr, w.meaning_pt, w.meaning_it)
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
    'leadership': ['Leadership', 'Politics', 'Governance', 'Strategy'],
    'science': ['Science', 'Innovation', 'Technology', 'Mathematics'],
    'philosophy': ['Philosophy', 'Wisdom', 'Ethics', 'Spirituality'],
    'arts': ['Arts', 'Literature', 'Music', 'Creativity'],
    'society': ['Society', 'Human Rights', 'Activism', 'Justice'],
    'business': ['Business', 'Exploration', 'Entrepreneurship', 'Trade'],
  };
  const localizedEra = giantTranslation.era || giant.era || '';
  const eraYearMatch = localizedEra.match(/\((\d{1,4})(?:[^~\-–]*)?[~\-–]\s*(\d{1,4})/);
  const isBC = localizedEra.toLowerCase().includes('a.c.') || localizedEra.toLowerCase().includes('bc');
  
  let birthDate = eraYearMatch?.[1];
  let deathDate = eraYearMatch?.[2];
  
  if (isBC && birthDate) birthDate = `-${birthDate.padStart(4, '0')}`;
  if (isBC && deathDate) deathDate = `-${deathDate.padStart(4, '0')}`;

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
      { '@type': 'ListItem', position: 1, name: locale === 'ko' ? '홈' : locale === 'it' ? 'Home' : locale === 'pt' ? 'Início' : 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'ko' ? '거인들의 전당' : locale === 'it' ? 'Sala delle Grandi Menti' : locale === 'pt' ? 'Salão das Grandes Mentes' : 'Hall of Giants', item: `${BASE_URL}/${locale}#giants` },
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
