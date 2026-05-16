import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"
import { Scale, Info, Megaphone, UserCheck, Gavel, ShieldAlert, FileText } from "lucide-react"

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
            <Gavel className="w-4 h-4" />
            Legal Framework
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

          <div className="space-y-16">
            {/* Article 1 & 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
                <div className="flex items-center gap-3 text-amber-500">
                  <ShieldAlert className="w-5 h-5" />
                  <h2 className="text-lg font-bold">{t('eligibilityTitle')}</h2>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {t('eligibilityDesc')}
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
                <div className="flex items-center gap-3 text-blue-400">
                  <Info className="w-5 h-5" />
                  <h2 className="text-lg font-bold">{t('aiTitle')}</h2>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {t('aiDesc')}
                </p>
              </div>
            </div>

            {/* Article 3 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                <Scale className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold">{t('intellectualTitle')}</h2>
              </div>
              <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {t('intellectualDesc')}
                </p>
              </div>
            </section>

            {/* Article 4 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                <UserCheck className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold">{t('userDutyTitle')}</h2>
              </div>
              <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {t('userDutyDesc')}
                </p>
              </div>
            </section>

            {/* Article 5 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">{t('disputeTitle')}</h2>
              </div>
              <div className="bg-blue-500/[0.02] p-8 rounded-3xl border border-blue-500/10 italic">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {t('disputeDesc')}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}


