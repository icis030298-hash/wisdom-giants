"use client"

import { useLocale } from "next-intl"
import { aboutTranslations } from "@/data/about-translations"
import { Navigation } from "@/components/navigation"

export function AboutPageClient({ locale: propLocale }: { locale?: string }) {
  const currentLocale = propLocale || useLocale() || 'ko'
  const t = aboutTranslations[currentLocale] || aboutTranslations['en'] || aboutTranslations['ko']

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-foreground">
      <Navigation />
      <div className="pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-400 mb-8">
            {t.title}
          </h1>
          <div className="prose prose-invert prose-amber max-w-none font-light leading-relaxed space-y-6">
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            
            <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">{t.h1}</h2>
            <blockquote className="border-l-2 border-amber-500/50 pl-4 py-2 italic text-amber-200/90 my-4 bg-amber-500/[0.03] rounded-r-lg">
              {t.quote}
            </blockquote>
            
            <p>{t.p3}</p>
            
            <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">{t.h2}</h2>
            <p>{t.p4}</p>
            
            <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">{t.h3}</h2>
            <p>{t.p5}</p>
            
            <p className="pt-4">{t.p6}</p>
            
            <p className="text-right font-serif text-amber-500 mt-10 text-lg">{t.signature}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
