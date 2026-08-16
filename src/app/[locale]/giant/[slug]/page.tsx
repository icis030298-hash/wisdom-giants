import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { giants } from "@/lib/giants-data";
import { GiantDetailClient } from "@/components/giant-detail-client";
import { Navigation } from "@/components/navigation";
import { Metadata } from 'next';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import { buildHreflang } from '@/lib/locales';
import { eraForLocale, eraLabel, lifespan } from '@/lib/era';
import { blogPosts } from "@/data/blog-posts";
import incompleteGiants from '@/config/incomplete-giants.json';

import { Link } from "@/i18n/routing";
import { Suspense } from 'react';

// Giant biographies are effectively static: they only change when the data files
// change, and a data change ships with a deploy (which invalidates the ISR cache
// anyway). A 1 hour window meant every one of the ~22,800 locale/giant pages could
// regenerate 24x/day, which is what drove ISR writes to ~13.4M/month.
export const revalidate = 604800; // 1 week

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
        <div className="h-14 w-56 rounded-2xl rd-bg-faint animate-pulse" />
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

// Era comes from giants-summary.json for both the cards and this page.
// messages.Giants.<slug>.era carries a "Giants of History" placeholder for 44
// giants, which was leaking into their meta description; era_* here is
// complete and already verified across all 24 locales.
const summaryPath = path.join(process.cwd(), 'src/data/giants-summary.json');
let giantsSummary: any = {};
if (fs.existsSync(summaryPath)) {
  giantsSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
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
  
  if (!giant) {
    return {
      title: 'Not Found | Giants Wisdom',
      robots: { index: false, follow: false },
    };
  }

  const messages = await getMessages({ locale });
  const tBrand = await getTranslations({ locale, namespace: 'brand' });
  // The localized phrase still earns its place as a keyword; it just no longer
  // rides along in the <title>, which follows the root template in putting the
  // brand — and only the brand — after the page's own name.
  const brandKeyword = tBrand('mainTitle') || 'Giants Wisdom';
  const brandName = 'Giants Wisdom';

  const giantData = (messages.Giants as any)[giant.slug] || {
    name: giant.name,
    headline: giant.headline,
    shortDescription: giant.shortDescription,
    quote: giant.quote
  };

  const BASE_URL = 'https://www.giantswisdom.com';
  const name = giantData.name;

  // Load narrative to get the TRUE quote if available
  let narrative: any = null;
  try {
    const narrativePath = path.join(process.cwd(), 'src/data/narratives', `${slug}.json`);
    if (fs.existsSync(narrativePath)) {
      narrative = JSON.parse(fs.readFileSync(narrativePath, 'utf-8'));
    }
  } catch (error) {}

  // 1. Emoji Mapping
  const emojiMap: Record<string, string> = {
    'leadership': '👑',
    'science': '🔬',
    'philosophy': '🏛️',
    'arts': '🎨',
    'society': '⚖️',
    'business': '⚓',
  };
  const emoji = emojiMap[giant.category] || '💡';

  // 2. Construct Title
  let shortBio = giantData.headline || giantData.shortDescription || '';
  
  // If shortBio is obviously a long narrative or epic intro (starts with a year or is very long), drop it.
  if (shortBio.length > 50 || /^\d{4}년|기원전/.test(shortBio)) {
    shortBio = '';
  }

  let titleStr = shortBio ? `${emoji} ${name} – ${shortBio} | ${brandName}` : `${emoji} ${name} | ${brandName}`;
  
  if (titleStr.length > 60) {
    // If the combined title is still too long for SEO, drop the identity entirely.
    // The user explicitly prefers "🔬 마리 퀴리 | 거인의 어깨" over a truncated sentence.
    titleStr = `${emoji} ${name} | ${brandName}`;
  }

  // 3. Construct Description
  let quote = giantData.quote || giant.quote || '';
  // Override with true quote from narrative if available
  if (narrative && narrative.wisdom && narrative.wisdom[0]) {
    const quoteKey = `quote_${locale}`;
    const enKey = `quote_en`;
    const trueQuote = narrative.wisdom[0][quoteKey] || narrative.wisdom[0][enKey];
    if (trueQuote && trueQuote.trim().length > 10) {
      quote = trueQuote.replace(/^\[(?:RTL\s+)?[a-z]{2,3}\]\s*/i, '').trim();
    }
  }

  const summaryEra = eraForLocale(giantsSummary[giant.slug], locale);
  const eraClean = cleanEraString(lifespan(summaryEra) || giantData.era || giant.era || '');
  const eraDisplay = eraClean ? `(${eraClean})` : '';

  const ctaMap: Record<string, string> = {
    ko: 'AI로 직접 대화해보세요.',
    en: 'Chat directly via AI.',
    ja: 'AIで直接対話してみてください。',
    ar: 'تحدث مباشرة عبر الذكاء الاصطناعي.',
    he: 'שוחח ישירות באמצעות בינה מלאכותית.',
    de: 'Chatten Sie direkt per KI.',
    es: 'Chatea directamente a través de IA.',
    fr: 'Chattez directement via l\'IA.',
    it: 'Chatta direttamente tramite IA.',
    pt: 'Converse diretamente via IA.',
  };
  const cta = ctaMap[locale] || 'Chat directly via AI.';

  
  let descBio = giantData.shortDescription || giantData.headline || '';
  // Drop legacy repetitive strings or epic intros from the description
  if (descBio.includes('일대기와 지혜') || descBio.length > 80) {
    descBio = '';
  }
  if (descBio) {
     descBio = `${descBio} `;
  }

  let quotePart = quote ? `"${quote}" — ` : '';
  let rawDesc = `${quotePart}${name}${eraDisplay}. ${descBio}${cta}`;

  if (rawDesc.length > 155 && descBio) {
    descBio = '';
    rawDesc = `${quotePart}${name}${eraDisplay}. ${cta}`;
  }

  if (rawDesc.length > 155 && quote) {
    const baseLen = rawDesc.length - quote.length;
    const maxQuoteLen = 155 - baseLen - 3;
    if (maxQuoteLen > 10) {
      let truncated = quote.slice(0, maxQuoteLen);
      // Try to break at punctuation first
      const lastPunctuation = truncated.match(/.*[.?!,;]/);
      if (lastPunctuation) {
        truncated = lastPunctuation[0];
      } else {
        // Fallback to last word boundary
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
          truncated = truncated.slice(0, lastSpace);
        }
      }
      // Remove trailing punctuation before appending ellipsis to avoid "...."
      truncated = truncated.replace(/[.?!,;]$/, '');
      quote = truncated + '...';
      quotePart = `"${quote}" — `;
      rawDesc = `${quotePart}${name}${eraDisplay}. ${cta}`;
    } else {
      quotePart = '';
      rawDesc = `${name}${eraDisplay}. ${cta}`;
    }
  }

  if (rawDesc.length > 155) {
     rawDesc = `${name}${eraDisplay}. ${cta}`;
  }
  
  const description = rawDesc;
  const ogDesc = description;

  const absoluteImageUrl = giant.imageUrl.startsWith('http')
    ? giant.imageUrl
    : `${BASE_URL}${giant.imageUrl}`;

  // Check if giant is incomplete statically
  const isIncomplete = incompleteGiantsSet.has(slug);
  const shouldIndex = !isIncomplete && isLocaleIndexed(locale);

  // Build full hreflang alternates for all locales
  const hreflangLanguages = buildHreflang(BASE_URL, `/giant/${slug}`);

  return {
    title: { absolute: titleStr },
    description,
    keywords: [
      name,
      giant.era,
      giant.field,
      locale === 'ko' ? "역사 위인" : locale === 'de' ? "Historische Persönlichkeit" : locale === 'ja' ? "歴史上の偉人" : locale === 'it' ? "Figura Storica" : locale === 'pt' ? "Figura Histórica" : "Historical Figure",
      brandKeyword
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
  const tUI = await getTranslations({ locale, namespace: 'UI' });

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

  const summaryEra = eraForLocale(giantsSummary[giant.slug], locale);

  const translations = {
    giantDetail: messages.GiantDetail,
    giants: giantTranslation,
    giantsGrid: messages.GiantsGrid,
    narrative: formattedNarrative,
    factLayer: factLayer,
    giantBlogLink: messages.GiantBlogLink,
    ui: messages.UI,
    // Era for the sidebar, from the same source the cards use.
    eraLabel: eraLabel(summaryEra) || giantTranslation.era || giant.era || null
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
  const localizedEra = summaryEra || giantTranslation.era || giant.era || '';
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
      { '@type': 'ListItem', position: 1, name: tUI('home'), item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: tUI('hallOfGiants'), item: `${BASE_URL}/${locale}#giants` },
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

      {/* Server-rendered header. The portrait is 112x140 instead of a 55vh
          full-bleed image, so the name and lede sit above the fold. */}
      <header className="pt-20 pb-6" style={{ borderBottom: "1px solid var(--rd-divider-faint)" }}>
        <div className="mx-auto px-4 md:px-6" style={{ maxWidth: "calc(var(--rd-detail-main) + var(--rd-detail-sidebar) + var(--rd-detail-gap))" }}>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol
              className="flex items-center gap-2"
              style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)", letterSpacing: "var(--rd-caption-tracking)" }}
            >
              <li>
                <Link href="/" className="hover:underline">{tUI('home')}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#giants" className="hover:underline">{tUI('hallOfGiants')}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="truncate" aria-current="page" style={{ color: "var(--rd-text-body)" }}>
                {giantTranslation.name || giant.name}
              </li>
            </ol>
          </nav>

          <div className="flex items-start gap-5">
            <Image
              /* Relative, not `${BASE_URL}${...}`. The absolute form pointed the
                 hero at the production domain, which meant a preview deploy drew
                 its portraits from production -- the one element on this page a
                 preview could not actually verify. Every imageUrl in giants.ts
                 is a local path, so there is nothing to make absolute. */
              src={giant.imageUrl}
              alt={`${giantTranslation.name || giant.name} - Giants Wisdom`}
              width={112}
              height={112}
              /* The <img> this replaced was eager, because that is what a plain
                 <img> is. next/image defaults to lazy, so the swap quietly moved
                 the one portrait on the page -- 115px down a 756px viewport,
                 above the fold on every device -- behind a layout pass. priority
                 restores eager and adds the preload the old markup never had. */
              priority
              /* Square, and round. The plates are drawn as discs with 8-10%
                 margin all round, so a 4:5 frame left the corners showing the
                 plate's own background — and that background is not one colour
                 to match against: 43% of the set is pure white, 30% cream, the
                 rest various. Filling the rectangle instead would mean scaling
                 the disc 1.41x and cropping into the face.
                 A 1:1 source in a 1:1 circular frame crops nothing.
                 The hairline matters: an unbordered circle reads as a social
                 avatar, while a rule around it reads as a plate. */
              className="rd-portrait shrink-0 object-cover"
              style={{
                width: "var(--rd-portrait-width)",
                height: "var(--rd-portrait-width)",
                background: "var(--rd-divider-faint)",
                borderRadius: "9999px",
                border: "1px solid var(--rd-border)",
              }}
            />

            <div className="min-w-0">
              {/* Category: the field axis, in the reader's language. No uppercase. */}
              <span
                style={{
                  color: "var(--rd-accent-brown)",
                  fontSize: "var(--rd-category-size)",
                  fontWeight: "var(--rd-category-weight)",
                  letterSpacing: "var(--rd-category-tracking)",
                  lineHeight: "var(--rd-category-leading)",
                }}
              >
                {(messages.GiantsGrid as any)?.categories?.[giant.category] || giant.category}
              </span>

              <h1
                className="font-serif mt-0.5"
                style={{
                  color: "var(--rd-text-ink)",
                  fontSize: "var(--rd-display-size)",
                  fontWeight: "var(--rd-display-weight)",
                  letterSpacing: "var(--rd-display-tracking)",
                  lineHeight: "var(--rd-display-leading)",
                }}
              >
                {giantTranslation.name || giant.name}
              </h1>

              {(lifespan(localizedEra) || eraLabel(localizedEra)) && (
                <p
                  className="mt-1"
                  style={{
                    color: "var(--rd-text-muted)",
                    fontSize: "var(--rd-caption-size)",
                    letterSpacing: "var(--rd-caption-tracking)",
                    lineHeight: "var(--rd-caption-leading)",
                  }}
                >
                  {lifespan(localizedEra)}
                </p>
              )}

              {giantTranslation.quote && (
                <h2
                  className="font-serif mt-2 max-w-3xl break-keep"
                  style={{
                    color: "var(--rd-accent-brown)",
                    fontSize: "var(--rd-lede-size)",
                    fontWeight: "var(--rd-lede-weight)",
                    lineHeight: "var(--rd-lede-leading)",
                  }}
                >
                  &ldquo;{giantTranslation.quote}&rdquo;
                </h2>
              )}
            </div>
          </div>
        </div>
      </header>

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
