import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"
import { ShieldCheck, Lock, Globe, Database } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Privacy' })
  return {
    title: `${t('title')} | Giants Wisdom`,
    description: t('summaryDesc')
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
            Compliance Center
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-400 font-light italic">
            {t('lastUpdated')}
          </p>
        </header>

        <div className="space-y-16">
          <section className="bg-white/[0.02] p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                {t('summaryTitle')}
              </h2>
              <p className="text-lg leading-relaxed text-slate-300">
                {t('summaryDesc')}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('collectionTitle')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                {t('collectionDesc')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('purposeTitle')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                {t('purposeDesc')}
              </p>
            </div>
          </div>

          <section className="space-y-8 p-8 md:p-12 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                {t('adsenseTitle')}
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {t('adsenseDesc')}
              </p>
            </div>
            
            <div className="h-px bg-white/10" />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                {t('retentionTitle')}
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {t('retentionDesc')}
              </p>
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                {t('rightsTitle')}
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {t('rightsDesc')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

