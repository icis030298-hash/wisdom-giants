import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { giants } from "@/lib/giants-data";
import { GiantDetailClient } from "@/components/giant-detail-client";
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { buildHreflang } from '@/lib/locales';
import { blogPosts } from "@/data/blog-posts";

// Load large JSON files dynamically to prevent Next.js from bundling them into JS modules
const narrativesPath = path.join(process.cwd(), 'src/data/final-narratives.json');
let finalNarratives: any = {};
if (fs.existsSync(narrativesPath)) {
  finalNarratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf-8'));
}

const wikiLinksPath = path.join(process.cwd(), 'src/data/wikipedia-links.json');
let wikipediaLinks: any = {};
if (fs.existsSync(wikiLinksPath)) {
  wikipediaLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf-8'));
}

// Fact layer is now loaded dynamically per locale inside the component

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const giant = giants.find(g => g.slug === slug);
  
  if (!giant) return {
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },};

  const messages = await getMessages({ locale });
  const giantData = (messages.Giants as any)[giant.slug] || {
    name: giant.name,
    headline: giant.headline,
    shortDescription: giant.shortDescription,
    quote: giant.quote
  };

  const BASE_URL = 'https://www.giantswisdom.com';

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
  const rawDescription = descMap[locale] ?? descMap['en'];
  const description = rawDescription.length > 155 ? rawDescription.slice(0, 152) + '...' : rawDescription;

  const ogRawDesc = giantData.quote || description;
  const ogDesc = ogRawDesc.length > 155 ? ogRawDesc.slice(0, 152) + '...' : ogRawDesc;

  const absoluteImageUrl = giant.imageUrl.startsWith('http')
    ? giant.imageUrl
    : `${BASE_URL}${giant.imageUrl}`;

  // Build full hreflang alternates for all locales
  const hreflangLanguages = buildHreflang(BASE_URL, `/giant/${slug}`);

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
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    alternates: buildSEOAlternates(`/giant/${slug}`, locale),
  };
}


export default async function GiantDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  
  setRequestLocale(locale);
  
  const giant = giants.find(g => g.slug === slug);
  if (!giant) notFound();

  // Attach fact layer data if it exists for this giant
  let factLayerAll: any = {};
  try {
    const layerPath = path.join(process.cwd(), 'src/data/fact-layers', `fact-layer-${locale}.json`);
    if (fs.existsSync(layerPath)) {
      factLayerAll = JSON.parse(fs.readFileSync(layerPath, 'utf-8'));
    }
  } catch (error) {
    console.warn(`Could not load fact-layer-${locale}.json`);
  }
  const factLayer = factLayerAll[slug] || null;
  console.log(`[Server Check] Locale: ${locale}, Slug: ${slug}, FactLayer Loaded: ${factLayer ? 'YES' : 'NO'} (Timeline items: ${factLayer?.timeline?.length || 0})`);

  const messages = await getMessages({ locale });
  
  // Find standardized narrative data
  const narrative = (finalNarratives as any)[giant.slug];
  
  // For locales without a dedicated narrative, fall back to English
  const getFieldText = (obj: any, fieldName: string) => {
    if (!obj) return '';
    const key = `${fieldName}_${locale}`;
    let text = '';
    const hasValue = obj[key] && obj[key].trim().length > 0;
    
    // Check if it's dummy reversed English (e.g. under [RTL he] prefix and no real Hebrew characters)
    let isDummyHebrew = false;
    if (locale === 'he' && hasValue) {
      const hebrewCharRegex = /[\u0590-\u05ff]/;
      if (!hebrewCharRegex.test(obj[key])) {
        isDummyHebrew = true;
      }
    }

    if (hasValue && !isDummyHebrew) {
      text = obj[key];
    } else {
      text = obj[`${fieldName}_en`] || '';
    }
    // Strip debug/placeholder language prefixes like "[vi]" or "[RTL he]"
    return text.replace(/^\[(?:RTL\s+)?[a-z]{2,3}\]\s*/i, '').trim();
  };

  // Locales with full narrative translations in final-narratives.json
  const NARRATIVE_LOCALES = [
    'ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'
  ];
  const hasNarrativeLocale = NARRATIVE_LOCALES.includes(locale);

  const formattedNarrative = narrative ? {
    epic: getFieldText(narrative, 'epic'),
    trials: hasNarrativeLocale ? getFieldText(narrative, 'trials') : undefined,
    overcoming: hasNarrativeLocale ? getFieldText(narrative, 'overcoming') : undefined,
    era: hasNarrativeLocale ? getFieldText(narrative, 'era') : undefined,
    wisdom: (narrative.wisdom || []).map((w: any) => ({
      quote: getFieldText(w, 'quote'),
      meaning: getFieldText(w, 'meaning')
    })),
    fact_box: narrative[`fact_box_${locale}`] || narrative.fact_box
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
    narrative: formattedNarrative,
    factLayer: factLayer,
    giantBlogLink: messages.GiantBlogLink,
    ui: messages.UI
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

  const quotationSchema = locale === 'ko' ? {
    '@context': 'https://schema.org',
    '@type': 'Quotation',
    'text': giantTranslation.quote || giant.quote,
    'creator': {
      '@type': 'Person',
      'name': giantTranslation.name || giant.name
    }
  } : null;

  const faqSchema = factLayer && factLayer.faq ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: factLayer.faq.map((q: any) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {quotationSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quotationSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <GiantDetailClient 
        giant={giant} 
        translations={translations} 
        relatedBlogPosts={blogPosts.filter(post => post.relatedGiants?.includes(giant.slug))}
        wikipediaUrl={((wikipediaLinks as any)[giant.slug]?.[locale] || (wikipediaLinks as any)[giant.slug]?.['en'] || null)}
      />
    </>
  );
}
