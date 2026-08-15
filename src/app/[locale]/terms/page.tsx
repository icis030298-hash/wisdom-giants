import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"

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
    <main className="min-h-screen">
      <Navigation />

      <div className="rd-reading px-4 md:px-6 py-12 md:py-16">
        <header className="pb-6 mb-10 rd-hairline-bottom">
          <h1
            style={{
              color: "var(--rd-text-ink)",
              fontSize: "var(--rd-display-size)",
              fontWeight: "var(--rd-display-weight)",
              letterSpacing: "var(--rd-display-tracking)",
              lineHeight: "var(--rd-display-leading)",
            }}
          >
            {t('title')}
          </h1>
          <p className="rd-caption mt-3">{t('lastUpdated')}</p>
        </header>

        {/* Lede. Not italic — the same reason the blockquote rule in
            globals.css is not: synthesised obliques shear Hangul and Kana and
            break cursive joining in Arabic. */}
        <p className="rd-lede mb-12 ps-4" style={{ borderInlineStart: "2px solid var(--rd-accent-brown)" }}>
          {t('intro')}
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('eligibilityTitle')}</h2>
            <p className="rd-body-lg whitespace-pre-wrap">{t('eligibilityDesc')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('aiTitle')}</h2>
            <p className="rd-body-lg whitespace-pre-wrap">{t('aiDesc')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('intellectualTitle')}</h2>
            <p className="rd-body-lg whitespace-pre-wrap">{t('intellectualDesc')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('userDutyTitle')}</h2>
            <p className="rd-body-lg whitespace-pre-wrap">{t('userDutyDesc')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('disputeTitle')}</h2>
            <p className="rd-body-lg whitespace-pre-wrap">{t('disputeDesc')}</p>
          </section>
        </div>
      </div>
    </main>
  )
}
