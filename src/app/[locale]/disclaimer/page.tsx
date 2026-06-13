import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"
import { ShieldAlert, Info, Sparkles, BookOpen, Scale } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Disclaimer' })
  return {
    title: t('meta.title'),
    description: t('meta.description')
  }
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Disclaimer' })
  const sections = t.raw('sections') as Array<{ title: string; content: string }>;
  
  const icons = [
    <Sparkles key="ai" className="w-6 h-6 text-amber-400" />,
    <BookOpen key="edu" className="w-6 h-6 text-emerald-400" />,
    <Scale key="acc" className="w-6 h-6 text-blue-400" />,
    <Info key="cpy" className="w-6 h-6 text-purple-400" />
  ];

  const colors = [
    "bg-amber-500/10 border-amber-500/20",
    "bg-emerald-500/10 border-emerald-500/20",
    "bg-blue-500/10 border-blue-500/20",
    "bg-purple-500/10 border-purple-500/20"
  ];

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-slate-200">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <header className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" />
            Compliance Center
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            {t('pageTitle')}
          </h1>
          <p className="text-slate-400 font-light italic">
            {t('lastUpdated')}
          </p>
        </header>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section key={idx} className="bg-white/[0.02] p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[idx % colors.length]}`}>
                  {icons[idx % icons.length]}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-wrap">
                {section.content}
              </p>
            </section>
          ))}

          <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-8 md:p-12 rounded-[2.5rem] border border-amber-500/20 relative overflow-hidden space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl mx-auto mb-2">
              ✉️
            </div>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
              {t('contact')}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
