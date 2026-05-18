import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedGiants } from "@/components/featured-giants"
import { GiantsGrid } from "@/components/giants-grid"
import { giants } from "@/lib/giants-data"
import { Dna, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

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
      
      {/* Featured Giants - Bento Grid */}
      <FeaturedGiants giants={giants} />
      
      {/* All Giants Grid */}
      <div id="giants">
        <GiantsGrid />
      </div>
    </main>
  )
}
