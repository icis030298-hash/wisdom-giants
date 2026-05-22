import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedGiants } from "@/components/featured-giants"
import { GiantsGrid } from "@/components/giants-grid"
import { ProjectPhilosophy } from "@/components/project-philosophy"
import { giants } from "@/lib/giants-data"
import { Dna, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Test" });

  console.log("==========================================");
  console.log("[Server environment check]: Is Firebase API Key loaded?", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("==========================================");

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
                  <span className="text-sm">🔥</span> LIVE DEBATE
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight whitespace-pre-wrap">
                  세기의 명저들이 맞붙는<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300">
                    &apos;거인들의 끝장 토론방&apos;
                  </span>
                </h2>
                <p className="text-slate-300 text-lg max-w-xl">
                  “돈으로 행복을 살 수 있을까?” 아리스토텔레스와 니체가 벌이는 격렬한 사상 논쟁을 실시간으로 직관하고 참여해보세요.
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold group-hover:gap-4 transition-all bg-amber-500/10 px-6 py-4 rounded-full border border-amber-500/30 group-hover:bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  토론 관전 및 참여하기 <ArrowRight className="w-5 h-5 animate-pulse" />
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

      {/* High-density Project Philosophy for SEO and AdSense Compliance */}
      <ProjectPhilosophy />
    </main>
  )
}
