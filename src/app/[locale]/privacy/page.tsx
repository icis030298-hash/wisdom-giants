import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"

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

  // Same single-column reading layout as /terms, /disclaimer and a blog post.
  // The icon tiles, the coloured accent bars and the "Compliance Center" badge
  // are gone: the badge was hard-coded English on all 24 locales, and the four
  // accent colours encoded nothing — every section here is the same kind of
  // section.
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

        <div className="space-y-12">
          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('summaryTitle')}</h2>
            <p className="rd-body-lg">{t('summaryDesc')}</p>
          </section>

          <section className="space-y-8">
            <div>
              <h3 className="rd-doc-h3 mb-2">{t('collectionTitle')}</h3>
              <p className="rd-body-lg whitespace-pre-wrap">{t('collectionDesc')}</p>
            </div>

            <div>
              <h3 className="rd-doc-h3 mb-2">{t('purposeTitle')}</h3>
              <p className="rd-body-lg whitespace-pre-wrap">{t('purposeDesc')}</p>
            </div>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('adsenseTitle')}</h2>
            <p className="rd-body-lg">{t('adsenseDesc')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('retentionTitle')}</h2>
            <p className="rd-body-lg">{t('retentionDesc')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('rightsTitle')}</h2>
            <p className="rd-body-lg">{t('rightsDesc')}</p>
          </section>
        </div>
      </div>
    </main>
  )
}
