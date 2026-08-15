import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"

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

  // The four rotating icon/colour pairs are gone. They were assigned by index,
  // so a translation that reordered or added a section silently reassigned
  // them, and nothing in the copy ever referred to a colour.
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
            {t('pageTitle')}
          </h1>
          <p className="rd-caption mt-3">{t('lastUpdated')}</p>
        </header>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{section.title}</h2>
              <p className="rd-body-lg whitespace-pre-wrap">{section.content}</p>
            </section>
          ))}

          <p className="rd-body-lg ps-4" style={{ borderInlineStart: "2px solid var(--rd-accent-brown)" }}>
            {t('contact')}
          </p>
        </div>
      </div>
    </main>
  )
}
