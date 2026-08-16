"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { BookOpen, Compass, Cpu, Landmark, ShieldCheck } from "lucide-react"

export function ProjectPhilosophy() {
  const t = useTranslations("Philosophy")
  const tGiants = useTranslations("Giants")

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 relative z-10" style={{ borderTop: "1px solid var(--rd-divider-faint)" }}>
      <div className="space-y-8" style={{ color: "var(--rd-text-body)" }}>
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5" style={{ color: "var(--rd-accent-brown)", fontSize: "var(--rd-category-size)", fontWeight: "var(--rd-category-weight)" }}>
            <Landmark className="w-3.5 h-3.5" />
            {t("badge")}
          </div>
          <h2 className="font-serif" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-h1-size)", fontWeight: "var(--rd-h1-weight)", letterSpacing: "var(--rd-h1-tracking)", lineHeight: "var(--rd-h1-leading)" }}>
            {t("title")}
          </h2>
          <p style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-body-size)", lineHeight: "var(--rd-body-leading)" }}>
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-start pt-4" style={{ gap: "var(--rd-grid-gutter)" }}>
          {/* Mission Section */}
          <div className="p-5 space-y-3" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}>
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--rd-divider-faint)", color: "var(--rd-accent-brown)", borderRadius: "var(--rd-card-radius)" }}>
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-name-size)", fontWeight: "var(--rd-card-name-weight)", letterSpacing: "var(--rd-card-name-tracking)" }}>
              {t("card1.title")}
            </h3>
            <p className="rd-card-intro" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
              {t("card1.p1")}
            </p>
            <p className="rd-card-intro" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
              {t("card1.p2", {
                socrates: tGiants("socrates.name"),
                nietzsche: tGiants("friedrich-nietzsche.name"),
                aristotle: tGiants("aristotle.name"),
                aurelius: tGiants("marcus-aurelius.name"),
              })}
            </p>
          </div>

          {/* Architecture Section */}
          <div className="p-5 space-y-3" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}>
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--rd-divider-faint)", color: "var(--rd-accent-brown)", borderRadius: "var(--rd-card-radius)" }}>
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-serif" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-name-size)", fontWeight: "var(--rd-card-name-weight)", letterSpacing: "var(--rd-card-name-tracking)" }}>
              {t("card2.title")}
            </h3>
            <p className="rd-card-intro" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
              {t("card2.p1")}
            </p>
            <p className="rd-card-intro" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
              {t("card2.p2")}
            </p>
          </div>

          {/* Quality Section */}
          <div className="p-5 space-y-3" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}>
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--rd-divider-faint)", color: "var(--rd-accent-brown)", borderRadius: "var(--rd-card-radius)" }}>
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-name-size)", fontWeight: "var(--rd-card-name-weight)", letterSpacing: "var(--rd-card-name-tracking)" }}>
              {t("card3.title")}
            </h3>
            <p className="rd-card-intro" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
              {t("card3.p1")}
            </p>
            <p className="rd-card-intro" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
              {t("card3.p2")}
            </p>
          </div>

          {/* Compliance Section */}
          <div className="p-5 space-y-3" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}>
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--rd-divider-faint)", color: "var(--rd-accent-brown)", borderRadius: "var(--rd-card-radius)" }}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-name-size)", fontWeight: "var(--rd-card-name-weight)", letterSpacing: "var(--rd-card-name-tracking)" }}>
              {t("card4.title")}
            </h3>
            <p className="rd-card-intro" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
              {t.rich("card4.p1", {
                privacyLink: (chunks) => (
                  <Link href="/privacy" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: "var(--rd-accent-brown)" }}>
                    {chunks}
                  </Link>
                ),
                termsLink: (chunks) => (
                  <Link href="/terms" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: "var(--rd-accent-brown)" }}>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
