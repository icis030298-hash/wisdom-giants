"use client"

import { useLocale } from "next-intl"
import { aboutTranslations } from "@/data/about-translations"
import { Navigation } from "@/components/navigation"

export function AboutPageClient({ locale: propLocale }: { locale?: string }) {
  const currentLocale = propLocale || useLocale() || 'ko'
  const t = aboutTranslations[currentLocale] || aboutTranslations['en'] || aboutTranslations['ko']

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="rd-reading px-4 md:px-6 py-12 md:py-16">
        <h1
          className="pb-6 mb-10 rd-hairline-bottom break-keep"
          style={{
            color: "var(--rd-text-ink)",
            fontSize: "var(--rd-display-size)",
            fontWeight: "var(--rd-display-weight)",
            letterSpacing: "var(--rd-display-tracking)",
            lineHeight: "var(--rd-display-leading)",
          }}
        >
          {t.title}
        </h1>

        <div className="space-y-6">
          <p className="rd-body-lg">{t.p1}</p>
          <p className="rd-body-lg">{t.p2}</p>

          <h2 className="rd-doc-h2 pt-6">{t.h1}</h2>
          <blockquote className="rd-quote rd-body-lg">
            {t.quote}
          </blockquote>

          <p className="rd-body-lg">{t.p3}</p>

          <h2 className="rd-doc-h2 pt-6">{t.h2}</h2>
          <p className="rd-body-lg">{t.p4}</p>

          <h2 className="rd-doc-h2 pt-6">{t.h3}</h2>
          <p className="rd-body-lg">{t.p5}</p>

          <p className="rd-body-lg pt-2">{t.p6}</p>

          {/* text-end rather than text-right so the signature stays on the
              trailing edge in Arabic and Hebrew too. */}
          <p className="rd-text-muted text-end pt-8" style={{ fontSize: "var(--rd-card-intro-size)" }}>
            {t.signature}
          </p>
        </div>
      </div>
    </div>
  )
}
