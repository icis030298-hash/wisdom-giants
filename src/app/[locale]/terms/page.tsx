import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"
import { Scale, Info, Megaphone, UserCheck } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Terms' })
  return {
    title: `${t('title')} | Giants Wisdom`,
    description: t('intro')
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Terms' })

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-slate-200">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <header className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest">
            <Scale className="w-4 h-4" />
            Service Agreement
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-400 font-light italic">
            {t('lastUpdated')}
          </p>
        </header>

        <div className="space-y-12">
          <section className="bg-white/[0.03] p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-4">
              <p className="text-xl text-slate-300 leading-relaxed font-light italic">
                {t('intro')}
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 py-4 border-b border-white/10">
              <Info className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">{t('aiTitle')}</h2>
            </div>
            <div className="bg-amber-500/[0.02] p-8 rounded-3xl border border-amber-500/10">
              <p className="text-slate-300 leading-relaxed">
                {t('aiDesc')}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
              <Scale className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">{t('intellectualTitle')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('intellectualDesc')}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
              <UserCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">{t('userDutyTitle')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('userDutyDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

