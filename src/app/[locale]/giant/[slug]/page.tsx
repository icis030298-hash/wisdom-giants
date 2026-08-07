import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { giants } from "@/lib/giants-data";
import { GiantDetailClient } from "@/components/giant-detail-client";
import { Navigation } from "@/components/navigation";
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { buildHreflang } from '@/lib/locales';
import { blogPosts } from "@/data/blog-posts";
import incompleteGiants from '@/config/incomplete-giants.json';
import { getKoreanJosa } from "@/lib/korean-josa";
import { Link } from "@/i18n/routing";
import { Suspense } from 'react';

export const revalidate = 3600;

const incompleteGiantsSet = new Set(incompleteGiants);

// In-flow skeleton for the interactive body below the server-rendered hero.
// GiantDetailClient calls useSearchParams(), which bails its subtree out of
// prerendering; isolating it in Suspense keeps the hero (h1/img) and the
// JSON-LD schemas in the static HTML. Must not cover the viewport.
function GiantBodySkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="max-w-6xl mx-auto px-6 md:px-16 py-16 space-y-8"
    >
      <div className="flex justify-end">
        <div className="h-14 w-56 rounded-2xl bg-amber-500/10 animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-muted/40 animate-pulse" />
        <div className="h-4 w-11/12 rounded bg-muted/40 animate-pulse" />
        <div className="h-4 w-9/12 rounded bg-muted/40 animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-40 rounded-3xl bg-muted/30 animate-pulse" />
        <div className="h-40 rounded-3xl bg-muted/30 animate-pulse" />
      </div>
    </div>
  );
}

function cleanEraString(era: string): string {
  if (!era) return '';
  // Remove outer and inner parentheses to prevent double nested parens like ((18세기 ~ 19세기))
  return era.replace(/[()]/g, '').trim();
}

// Load large JSON files dynamically to prevent Next.js from bundling them into JS modules

const wikiLinksPath = path.join(process.cwd(), 'src/data/wikipedia-links.json');
let wikipediaLinks: any = {};
if (fs.existsSync(wikiLinksPath)) {
  wikipediaLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf-8'));
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return [];
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

  const koNameWithJosa = getKoreanJosa(giantData.name, 'wa/gwa');
  const baseBio = (giantData.headline ? `${giantData.headline}. ` : '') + (giantData.shortDescription || '');
  const fullBio = baseBio.length > 90 ? baseBio.slice(0, 87) + '...' : baseBio;
  const eraClean = cleanEraString(giantData.era || giant.era || '');
  const eraDisplay = eraClean ? ` (${eraClean})` : '';

  // Full multilingual title & description
  const titleMap: Record<string, string> = {
    ko: giantData.name,
    de: giantData.name,
    ja: giantData.name,
    es: giantData.name,
    fr: giantData.name,
    it: giantData.name,
    pt: giantData.name,
    en: giantData.name,
  };
  const descMap: Record<string, string> = {
    ko: `${giantData.name}${eraDisplay}의 삶과 지혜. ${fullBio} ${koNameWithJosa} AI로 직접 실시간 대화하며 깊은 인생 통찰을 전수받아 보세요.`,
    de: `${giantData.name}${eraDisplay} - Leben und Weisheit. ${fullBio} Chatten Sie per KI direkt mit ${giantData.name}, um Weisheit zu erlangen.`,
    ja: `${giantData.name}${eraDisplay}の生涯と知恵。${fullBio} AIで${giantData.name}と直接対話し、人生のヒントを得てください。`,
    es: `${giantData.name}${eraDisplay} - Vida y sabiduría. ${fullBio} Chatea directamente con ${giantData.name} a través de IA para ganar sabiduría.`,
    fr: `${giantData.name}${eraDisplay} - Vie et sagesse. ${fullBio} Chattez directement avec ${giantData.name} via l'IA pour acquérir de la sagesse.`,
    it: `${giantData.name}${eraDisplay} - Vita e saggezza. ${fullBio} Chatta direttamente con ${giantData.name} tramite IA per acquisire saggezza.`,
    pt: `${giantData.name}${eraDisplay} - Vida e sabedoria. ${fullBio} Converse diretamente com ${giantData.name} via IA para obter sabedoria.`,
    en: `${giantData.name}${eraDisplay} - Life & wisdom. ${fullBio} Chat directly with ${giantData.name} via AI to gain timeless life wisdom.`,
  };
  const title = titleMap[locale] ?? titleMap['en'];
  const rawDescription = descMap[locale] ?? descMap['en'];
  const description = rawDescription.length > 145 ? rawDescription.slice(0, 142) + '...' : rawDescription;

  const ogRawDesc = giantData.quote || description;
  const ogDesc = ogRawDesc.length > 155 ? ogRawDesc.slice(0, 152) + '...' : ogRawDesc;

  const absoluteImageUrl = giant.imageUrl.startsWith('http')
    ? giant.imageUrl
    : `${BASE_URL}${giant.imageUrl}`;

  // Check if giant is incomplete statically
  const isIncomplete = incompleteGiantsSet.has(slug);
  const shouldIndex = !isIncomplete && isLocaleIndexed(locale);

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
    robots: { index: shouldIndex, follow: true },
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

  const messages = await getMessages({ locale });
  
  // Find standardized narrative data
  let narrative: any = null;
  try {
    const narrativePath = path.join(process.cwd(), 'src/data/narratives', `${slug}.json`);
    if (fs.existsSync(narrativePath)) {
      narrative = JSON.parse(fs.readFileSync(narrativePath, 'utf-8'));
    }
  } catch (error) {
    console.warn(`Could not load narrative for ${slug}`);
  }
  
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
    wisdom: (Array.isArray(narrative.wisdom) ? narrative.wisdom : []).map((w: any) => ({
      quote: getFieldText(w, 'quote'),
      meaning: getFieldText(w, 'meaning')
    })),
    fact_box: narrative[`fact_box_${locale}`] || narrative.fact_box
  } : null;

  const giantTranslation = (messages.Giants as any)[giant.slug] || {
    name: giant.name,
    headline: giant.headline,
    shortDescription: giant.shortDescription,
    pain: "Data being updated.",
    recovery: "Data being updated.",
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

  const quoteText = giantTranslation.quote || giant.quote;
  const quotationSchema = quoteText ? {
    '@context': 'https://schema.org',
    '@type': 'Quotation',
    'text': quoteText,
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

      <Navigation />

      {/* Visual Server-Rendered Hero Section for Instant SSR & Crawlers */}
      <div className="relative w-full h-[55vh] md:h-[60vh] overflow-hidden bg-slate-950">
        <img
          src={giant.imageUrl.startsWith('http') ? giant.imageUrl : `${BASE_URL}${giant.imageUrl}`}
          alt={`${giantTranslation.name || giant.name} - Giants Wisdom`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="breadcrumb" className="mb-4 flex items-center">
            <ol className="flex items-center space-x-2 text-xs md:text-sm text-zinc-400 font-sans">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {locale === 'ko' ? '홈' : 'Home'}
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li>
                <Link href="/#giants" className="hover:text-amber-400 transition-colors">
                  {locale === 'ko' ? '거인들의 전당' : 'Hall of Giants'}
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li className="text-amber-400 font-semibold truncate" aria-current="page">
                {giantTranslation.name || giant.name}
              </li>
            </ol>
          </nav>

          <div className="space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-widest border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              {giant.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-foreground leading-tight">
              {giantTranslation.name || giant.name}
            </h1>
            {giantTranslation.quote && (
              <h2 className="text-lg md:text-2xl text-amber-400/90 font-serif italic max-w-3xl leading-relaxed">
                &ldquo;{giantTranslation.quote}&rdquo;
              </h2>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={<GiantBodySkeleton />}>
        <GiantDetailClient
          giant={giant}
          translations={translations}
          relatedBlogPosts={blogPosts.filter(post => post.relatedGiants?.includes(giant.slug))}
          wikipediaUrl={((wikipediaLinks as any)[giant.slug]?.[locale] || (wikipediaLinks as any)[giant.slug]?.['en'] || null)}
        />
      </Suspense>
    </>
  );
}
