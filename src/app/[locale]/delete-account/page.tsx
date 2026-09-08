import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Navigation } from "@/components/navigation"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DeleteAccount' })
  return {
    title: `${t('title')} | Giants Wisdom`,
    description: t('summary'),
    robots: { index: false, follow: false },
  }
}

/**
 * Store-required public page explaining how to delete a Giants Wisdom app
 * account. Same single-column reading layout as /privacy and /terms.
 */
export default async function DeleteAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'DeleteAccount' })

  const steps = [t('step1'), t('step2'), t('step3'), t('step4')]

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
            <p className="rd-body-lg">{t('summary')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('stepsTitle')}</h2>
            <ol className="rd-body-lg list-decimal pl-6 space-y-2">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('dataTitle')}</h2>
            <p className="rd-body-lg whitespace-pre-wrap">{t('dataDesc')}</p>
          </section>

          <section>
            <h2 className="rd-doc-h2 pb-2 mb-4 rd-hairline-bottom">{t('helpTitle')}</h2>
            <p className="rd-body-lg">
              {t('helpDesc')}{' '}
              <a href="mailto:contact@giantswisdom.com" className="underline">contact@giantswisdom.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
