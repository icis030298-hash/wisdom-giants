import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedGiants } from "@/components/featured-giants"
import { GiantsGrid } from "@/components/giants-grid"
import { ProjectPhilosophy } from "@/components/project-philosophy"
import { giants } from "@/lib/giants-data"
import { Dna, ArrowRight, BookOpen, Clock } from "lucide-react"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { blogPosts } from "@/data/blog-posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    alternates: {
      canonical: locale === 'ko' ? '/' : `/${locale}`,
      languages: {
        'ko': '/',
        'en': '/en',
        'de': '/de',
        'ja': '/ja',
        'es': '/es',
        'fr': '/fr',
        'it': '/it',
        'pt': '/pt',
        'x-default': '/'
      },
    },
  };
}

const blogTranslations: Record<string, Record<string, string>> = {
  ko: {
    sectionTitle: "최신 블로그 포스트",
    sectionSubtitle: "역사 속 위인들의 지혜와 삶을 깊이 있는 이야기로 만나보세요.",
    viewAll: "블로그 전체 보기",
    readTime: "분 분량",
    read: "읽기",
    leadership: "리더십",
    philosophy: "철학",
    creativity: "창의성",
    wisdom: "지혜"
  },
  en: {
    sectionTitle: "Latest from the Blog",
    sectionSubtitle: "Discover profound wisdom and life stories from historical giants.",
    viewAll: "View All Posts",
    readTime: "min read",
    read: "Read",
    leadership: "Leadership",
    philosophy: "Philosophy",
    creativity: "Creativity",
    wisdom: "Wisdom"
  },
  de: {
    sectionTitle: "Neuestes aus dem Blog",
    sectionSubtitle: "Entdecken Sie tiefe Weisheiten und Lebensgeschichten historischer Riesen.",
    viewAll: "Alle Beiträge anzeigen",
    readTime: "Min. Lesung",
    read: "Lesen",
    leadership: "Führung",
    philosophy: "Philosophie",
    creativity: "Kreativität",
    wisdom: "Weisheit"
  },
  ja: {
    sectionTitle: "最新のブログ記事",
    sectionSubtitle: "歴史上の偉人たちの深い知恵と人生の物語を発見してください。",
    viewAll: "すべての記事を表示",
    readTime: "分 読了",
    read: "読む",
    leadership: "リーダーシップ",
    philosophy: "哲学",
    creativity: "創造性",
    wisdom: "知恵"
  },
  es: {
    sectionTitle: "Últimas del Blog",
    sectionSubtitle: "Descubra la profunda sabiduría e historias de vida de gigantes históricos.",
    viewAll: "Ver todo el blog",
    readTime: "min de lectura",
    read: "Leer",
    leadership: "Liderazgo",
    philosophy: "Filosofía",
    creativity: "Creatividad",
    wisdom: "Sabiduría"
  },
  fr: {
    sectionTitle: "Derniers articles du Blog",
    sectionSubtitle: "Découvrez la sagesse profonde et les récits de vie des géants de l'histoire.",
    viewAll: "Voir tous les articles",
    readTime: "min de lecture",
    read: "Lire",
    leadership: "Leadership",
    philosophy: "Philosophie",
    creativity: "Créativité",
    wisdom: "Sagesse"
  },
  it: {
    sectionTitle: "Ultimi articoli dal Blog",
    sectionSubtitle: "Scopri la profonda saggezza e le storie di vita dei giganti storici.",
    viewAll: "Vedi tutto il blog",
    readTime: "min di lettura",
    read: "Leggi",
    leadership: "Leadership",
    philosophy: "Filosofia",
    creativity: "Creatività",
    wisdom: "Saggezza"
  },
  pt: {
    sectionTitle: "Últimos do Blog",
    sectionSubtitle: "Descubra a profunda sabedoria e as histórias de vida dos gigantes históricos.",
    viewAll: "Ver todos os posts",
    readTime: "min de leitura",
    read: "Ler",
    leadership: "Liderança",
    philosophy: "Filosofia",
    creativity: "Criatividade",
    wisdom: "Sabedoria"
  }
};

const debateCTATranslations: Record<string, { titlePre: string; titlePost: string; desc: string; button: string; badge: string }> = {
  ko: {
    titlePre: "세기의 명저들이 맞붙는",
    titlePost: "'거인들의 끝장 토론방'",
    desc: "“돈으로 행복을 살 수 있을까?” 아리스토텔레스와 니체가 벌이는 격렬한 사상 논쟁을 실시간으로 직관하고 참여해보세요.",
    button: "토론 관전 및 참여하기",
    badge: "실시간 토론"
  },
  en: {
    titlePre: "Clash of the Greatest Minds",
    titlePost: "'Giants' Ultimate Debate Room'",
    desc: "\"Can money buy happiness?\" Spectate and join the intense intellectual debate between Aristotle and Nietzsche in real-time.",
    button: "Spectate & Participate",
    badge: "LIVE DEBATE"
  },
  de: {
    titlePre: "Aufeinandertreffen der größten Köpfe",
    titlePost: "'Die ultimative Debattenkammer der Riesen'",
    desc: "„Kann man mit Geld Glück kaufen?“ Verfolgen Sie und nehmen Sie teil an der intensiven intellektuellen Debatte zwischen Aristoteles und Nietzsche in Echtzeit.",
    button: "Zuschauen & Teilnehmen",
    badge: "LIVE-DEBATTE"
  },
  ja: {
    titlePre: "世紀の名著がぶつかり合う",
    titlePost: "「偉人たちの究極の討論室」",
    desc: "「お金で幸せは買えるか？」アリストテレスとニーチェが繰り広げる白熱した思想論争をリアルタイムで観戦・参加しましょう。",
    button: "討論を観戦・参加する",
    badge: "リアルタイム討論"
  },
  es: {
    titlePre: "El Choque de las Grandes Mentes",
    titlePost: "'La Sala de Debate Definitiva de los Gigantes'",
    desc: "¿Puede el dinero comprar la felicidad? Presencie y únase al intenso debate intelectual entre Aristóteles y Nietzsche en tiempo real.",
    button: "Ver y Participar",
    badge: "DEBATE EN VIVO"
  },
  fr: {
    titlePre: "Le Choc des Plus Grands Esprits",
    titlePost: "'La Salle de Débat Ultime des Géants'",
    desc: "« L'argent peut-il acheter le bonheur ? » Observez et rejoignez le débat intellectuel intense entre Aristote et Nietzsche en temps réel.",
    button: "Observer et Participer",
    badge: "DÉBAT EN DIRECT"
  },
  it: {
    titlePre: "Scontro tra le Grandi Menti",
    titlePost: "'La Stanza di Dibattito Ultimo dei Giganti'",
    desc: "\"I soldi possono comprare la felicità?\" Assisti e partecipa all'intenso dibattito intellettuale tra Aristotele e Nietzsche in tempo reale.",
    button: "Assisti e Partecipa",
    badge: "DIBATTITO IN DIRETTA"
  },
  pt: {
    titlePre: "O Confronto de Grandes Mentes",
    titlePost: "'A Sala de Debate Suprema dos Gigantes'",
    desc: "\"O dinheiro pode comprar felicidade?\" Assista e participe do intenso debate intelectual entre Aristóteles e Nietzsche em tempo real.",
    button: "Assistir e Participar",
    badge: "DEBATE AO VIVO"
  }
};

const colorMap: Record<string, string> = {
  leadership: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
  philosophy: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30",
  creativity: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30",
  wisdom: "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Test" });
  const bt = blogTranslations[locale] || blogTranslations['en'];

  console.log("==========================================");
  console.log("[Server environment check]: Is Firebase API Key loaded?", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("==========================================");

  // Get 3 latest posts sorted by date
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Heritage Test CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link 
          href="/test"
          className="block group"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-amber-600 p-8 md:p-12 shadow-2xl shadow-amber-500/20 transition-transform hover:scale-[1.01] active:scale-[0.99]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest">
                  {t("banner.new")}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight whitespace-pre-wrap">
                  {t("banner.title")}
                </h2>
                <p className="text-white/80 text-lg max-w-md">
                  {t("banner.desc")}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Dna className="w-10 h-10 text-white" />
                </div>
                <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                  {t("banner.button")} <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Debate Room CTA */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Link 
          href="/debate"
          className="block group"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border border-amber-500/30 p-8 md:p-12 shadow-2xl shadow-purple-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] hover:border-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]">
            {/* Elegant light rays and double glow overlays */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:from-amber-400/20 group-hover:to-purple-400/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[70px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                  <span className="text-sm">🔥</span> {(debateCTATranslations[locale] || debateCTATranslations['en']).badge}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight whitespace-pre-wrap">
                  {(debateCTATranslations[locale] || debateCTATranslations['en']).titlePre}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300">
                    {(debateCTATranslations[locale] || debateCTATranslations['en']).titlePost}
                  </span>
                </h2>
                <p className="text-slate-300 text-lg max-w-xl">
                  {(debateCTATranslations[locale] || debateCTATranslations['en']).desc}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold group-hover:gap-4 transition-all bg-amber-500/10 px-6 py-4 rounded-full border border-amber-500/30 group-hover:bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  {(debateCTATranslations[locale] || debateCTATranslations['en']).button} <ArrowRight className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Featured Giants - Bento Grid */}
      <FeaturedGiants giants={giants} />
      
      {/* All Giants Grid */}
      <div id="giants">
        <GiantsGrid />
      </div>

      {/* Latest Blog Section */}
      {latestPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                BLOG FEED
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                {bt.sectionTitle}
              </h2>
              <p className="text-slate-400 text-lg font-light max-w-xl">
                {bt.sectionSubtitle}
              </p>
            </div>
            
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold transition-colors text-sm uppercase tracking-wider group shrink-0"
            >
              {bt.viewAll}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
              
              const catColor = colorMap[post.category] || "from-slate-500/20 to-zinc-500/20 text-slate-300 border-slate-500/30";

              return (
                <Link 
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between rounded-2xl bg-slate-950 border border-white/5 hover:border-amber-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5"
                >
                  <div>
                    {/* Badge and read time */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catColor}`}>
                        {bt[post.category]}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {readTime} {bt.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[3.5rem] mb-3 leading-snug">
                      {trans.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                      {trans.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-6 pt-4 border-t border-white/5">
                    <span>{giant?.name || (locale === 'ko' ? '클레오파트라' : 'Cleopatra')}</span>
                    <span className="inline-flex items-center gap-1 text-amber-400 font-bold group-hover:gap-2 transition-all">
                      {bt.read} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* High-density Project Philosophy for SEO and AdSense Compliance */}
      <ProjectPhilosophy />
    </main>
  )
}
