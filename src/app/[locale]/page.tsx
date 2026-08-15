import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"

import { GiantsGrid } from "@/components/giants-grid"
import { ProjectPhilosophy } from "@/components/project-philosophy"
import { giants } from "@/lib/giants-data"
import { ArrowRight, Clock } from "lucide-react"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { blogPosts } from "@/data/blog-posts"
import { ConditionalAdSense } from "@/components/conditional-adsense"
import { AdSlot } from "@/components/ad-slot"
import giantsSummary from "@/data/giants-summary.json";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    alternates: buildSEOAlternates('/', locale),
  };
}




const blogTranslations: Record<string, any> = {
  ko: { sectionTitle: '지혜의 서재', sectionSubtitle: '운영자 칼럼 및 최신 소식', viewAll: '모두 보기', readTime: '분 소요', read: '읽기', 'CEO Column': '운영자 칼럼', 'News': '새소식', 'Notice': '공지' },
  en: { sectionTitle: "Wisdom's Library", sectionSubtitle: 'CEO Column & Latest News', viewAll: 'View All', readTime: 'min read', read: 'Read', 'CEO Column': 'CEO Column', 'News': 'News', 'Notice': 'Notice' },
  de: { sectionTitle: "Bibliothek der Weisheit", sectionSubtitle: 'CEO-Kolumne & Neuigkeiten', viewAll: 'Alle ansehen', readTime: 'min lesezeit', read: 'Lesen', 'CEO Column': 'CEO Kolumne', 'News': 'Neuigkeiten', 'Notice': 'Hinweis' },
  ja: { sectionTitle: "知恵の書斎", sectionSubtitle: '運営者コラム＆最新ニュース', viewAll: 'すべて見る', readTime: '分', read: '読む', 'CEO Column': 'コラム', 'News': 'ニュース', 'Notice': 'お知らせ' },
  es: { sectionTitle: "Biblioteca de Sabiduría", sectionSubtitle: 'Columna del CEO y Noticias', viewAll: 'Ver todo', readTime: 'min lectura', read: 'Leer', 'CEO Column': 'Columna', 'News': 'Noticias', 'Notice': 'Aviso' },
  fr: { sectionTitle: "Bibliothèque de Sagesse", sectionSubtitle: 'Chronique du CEO & Actualités', viewAll: 'Voir tout', readTime: 'min', read: 'Lire', 'CEO Column': 'Chronique', 'News': 'Actualités', 'Notice': 'Avis' },
  it: { sectionTitle: "Biblioteca della Saggezza", sectionSubtitle: 'Rubrica del CEO e Notizie', viewAll: 'Vedi tutti', readTime: 'min', read: 'Leggi', 'CEO Column': 'Rubrica', 'News': 'Notizie', 'Notice': 'Avviso' },
  pt: { sectionTitle: "Biblioteca da Sabedoria", sectionSubtitle: 'Coluna do CEO e Notícias', viewAll: 'Ver tudo', readTime: 'min leitura', read: 'Ler', 'CEO Column': 'Coluna', 'News': 'Notícias', 'Notice': 'Aviso' },
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Test" });
  const tg = await getTranslations({ locale, namespace: "Giants" });
  const td = await getTranslations({ locale, namespace: "DebateCTA" });
  const tc = await getTranslations({ locale, namespace: "Consult" });
  const bt = blogTranslations[locale] || blogTranslations['en'];

  // Map translations from giants-summary.json for card rendering
  const dbCardData: Record<string, { shortDescription?: string; era?: string; quote?: string }> = {};
  for (const slug of Object.keys(giantsSummary)) {
    const giantData = (giantsSummary as any)[slug];
    if (!giantData) continue;
    
    // Check if real Hebrew translation is present (has Hebrew characters)
    const isRealHebrew = (text: string | undefined) => {
      if (!text) return false;
      if (locale !== 'he') return true;
      const hebrewCharRegex = /[\u0590-\u05ff]/;
      return hebrewCharRegex.test(text);
    };

    const hasHebrewFactBox = giantData[`fact_box_he`]?.one_line_summary && isRealHebrew(giantData[`fact_box_he`].one_line_summary);
    const hasHebrewEra = giantData[`era_he`] && isRealHebrew(giantData[`era_he`]);

    const factBox = locale === 'ko'
      ? (giantData.fact_box_ko || giantData.fact_box)
      : (locale === 'he' && !hasHebrewFactBox)
        ? (giantData.fact_box_en || giantData.fact_box_ko || giantData.fact_box)
        : (giantData[`fact_box_${locale}`] || giantData.fact_box_en || giantData.fact_box_ko || giantData.fact_box);

    const era = locale === 'ko'
      ? (giantData.era_ko || giantData.era)
      : (locale === 'he' && !hasHebrewEra)
        ? (giantData.era_en || giantData.era)
        : (giantData[`era_${locale}`] || giantData.era_en || giantData.era);

    const wisdom = giantData.wisdom || [];
    let quote = undefined;
    for (const w of wisdom) {
      if (w[`quote_${locale}`] && w[`quote_${locale}`].trim().length > 0) {
        if (locale !== 'he' || isRealHebrew(w[`quote_${locale}`])) {
          quote = w[`quote_${locale}`];
          break;
        }
      }
    }
    if (!quote && wisdom[0]) {
      quote = wisdom[0].quote_en;
    }
    
    const prefixRegex = /^\[(?:RTL\s+)?[a-z]{2,3}\]\s*/i;
    dbCardData[slug] = {
      shortDescription: factBox?.one_line_summary ? factBox.one_line_summary.replace(prefixRegex, '').trim() : undefined,
      era: era ? era.replace(prefixRegex, '').trim() : undefined,
      quote: quote ? quote.replace(prefixRegex, '').trim() : undefined
    };
  }

  const getTranslation = (slug: string, fallback: string) => {
    try {
      const rawData = tg.raw(slug);
      if (rawData && typeof rawData === 'object' && 'name' in rawData) {
        return (rawData as any).name;
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  };

  console.log("==========================================");
  console.log("[Server environment check]: Is Firebase API Key loaded?", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("==========================================");

  // Get 3 latest posts sorted by date
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Giants Wisdom',
    url: `https://www.giantswisdom.com/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://www.giantswisdom.com/${locale}?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <ConditionalAdSense />
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Primary CTAs — one compact row. Routes and links unchanged. */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "var(--rd-grid-gutter)" }}>
          {[
            { href: "/consult", title: tc("title"), desc: tc("desc"), cta: tc("button") },
            { href: "/dna", title: t("banner.title"), desc: t("banner.desc"), cta: t("banner.button") },
            { href: "/debate", title: `${td("titlePre")} ${td("titlePost")}`, desc: td("desc"), cta: td("button") },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href as any}
              className="group flex flex-col p-4 transition-colors active:scale-[0.99]"
              style={{
                background: "var(--rd-surface)",
                border: "1px solid var(--rd-border)",
                borderRadius: "var(--rd-card-radius)",
                transitionDuration: "120ms",
              }}
            >
              <h2
                className="font-serif whitespace-pre-line"
                style={{
                  color: "var(--rd-text-ink)",
                  fontSize: "var(--rd-card-name-size)",
                  fontWeight: "var(--rd-card-name-weight)",
                  letterSpacing: "var(--rd-card-name-tracking)",
                  lineHeight: "var(--rd-card-name-leading)",
                }}
              >
                {card.title}
              </h2>
              <p
                className="mt-1 line-clamp-2 break-keep whitespace-pre-line"
                style={{
                  color: "var(--rd-text-body)",
                  fontSize: "var(--rd-card-intro-size)",
                  lineHeight: "var(--rd-card-intro-leading)",
                }}
              >
                {card.desc}
              </p>
              <span
                className="mt-2 inline-flex items-center gap-1"
                style={{
                  color: "var(--rd-accent-brown)",
                  fontSize: "var(--rd-caption-size)",
                  fontWeight: 600,
                }}
              >
                {card.cta}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* All Giants Grid */}
      <div id="giants">
        <GiantsGrid dbCardData={dbCardData} />
      </div>

      {/* Latest Blog Section */}
      {latestPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12" style={{ borderTop: "1px solid var(--rd-divider-faint)" }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="space-y-4">
              <h2 className="font-serif" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-h1-size)", fontWeight: "var(--rd-h1-weight)", letterSpacing: "var(--rd-h1-tracking)", lineHeight: "var(--rd-h1-leading)" }}>
                {bt.sectionTitle}
              </h2>
              <p className="max-w-xl mt-1" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-body-size)", lineHeight: "var(--rd-body-leading)" }}>
                {bt.sectionSubtitle}
              </p>
            </div>
            
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-1 group shrink-0" style={{ color: "var(--rd-accent-brown)", fontSize: "var(--rd-caption-size)", fontWeight: 600 }}
            >
              {bt.viewAll}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-start" style={{ gap: "var(--rd-grid-gutter)" }}>
            {latestPosts.map((post) => {
              const trans = post.translations[locale] || post.translations['en'];
              const giant = giants.find(g => g.slug === post.giantSlug);
              
              // Calculate reading time
              let readTime = 1;
              if (locale === 'ko' || locale === 'ja') {
                readTime = Math.max(1, Math.ceil(trans.content.length / 500));
              } else {
                const words = trans.content.trim().split(/\s+/).length;
                readTime = Math.max(1, Math.ceil(words / 200));
              }
              

              const localizedName = post.giantSlug === 'cleopatra'
                ? (locale === 'ko' ? '클레오파트라' :
                   locale === 'ja' ? 'クレオパトラ' :
                   locale === 'de' ? 'Kleopatra' :
                   locale === 'fr' ? 'Cléopâtre' : 'Cleopatra')
                : getTranslation(post.giantSlug || "", giant?.name || post.giantSlug || "")

              return (
                <Link 
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between p-4 transition-colors active:scale-[0.99]" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}
                >
                  <div>
                    {/* Badge and read time */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span style={{ color: "var(--rd-accent-brown)", fontSize: "var(--rd-category-size)", fontWeight: "var(--rd-category-weight)" }}>
                        {bt[post.category]}
                      </span>
                      <span className="flex items-center gap-1" style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}>
                        <Clock className="w-3.5 h-3.5" />
                        {readTime} {bt.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif line-clamp-2 mb-1" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-name-size)", fontWeight: "var(--rd-card-name-weight)", letterSpacing: "var(--rd-card-name-tracking)", lineHeight: "var(--rd-card-name-leading)" }}>
                      {trans.title}
                    </h3>
                    
                    <p className="line-clamp-3 break-keep" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
                      {trans.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--rd-divider-faint)", color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}>
                    <span>{localizedName}</span>
                    <span className="inline-flex items-center gap-1" style={{ color: "var(--rd-accent-brown)", fontWeight: 600 }}>
                      {bt.read} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* AdSpace Container with safe margin */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex justify-center" style={{ borderTop: "1px solid var(--rd-divider-faint)" }}>
        <AdSlot slot="4898120960" format="horizontal" />
      </div>

      {/* High-density Project Philosophy for SEO and AdSense Compliance */}
      <ProjectPhilosophy />
    </main>
  )
}
