import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { ShieldCheck, Lock, Globe, Database } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Privacy' })
  return {
    title: `${t('title')} | Giants Wisdom`,
    description: t('sections.intro')
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Privacy' })

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-slate-200">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <header className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-400 font-light italic">
            {t('lastUpdated')}
          </p>
        </header>

        <div className="space-y-12">
          <section className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-slate-300">
              {t('sections.intro')}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('sections.googleAdSense.title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('sections.googleAdSense.content')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                <Database className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('sections.aiProcessing.title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('sections.aiProcessing.content')}
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-white">
              <Lock className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold">{t('sections.cookies.title')}</h2>
            </div>
            <p className="text-slate-300 leading-relaxed bg-white/[0.03] p-8 rounded-3xl border border-white/5">
              {t('sections.cookies.content')}
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
