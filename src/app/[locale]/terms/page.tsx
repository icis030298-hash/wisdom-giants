import { useTranslations } from "next-intl"

export default function TermsOfService() {
  const t = useTranslations("Terms")
  
  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-serif font-bold mb-8 text-foreground">{t("title")}</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">{t("section1.title")}</h2>
            <p>{t("section1.content")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">{t("section2.title")}</h2>
            <p>{t("section2.content")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">{t("section3.title")}</h2>
            <p>{t("section3.content")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">{t("section4.title")}</h2>
            <p>{t("section4.content")}</p>
          </section>
        </div>
      </div>
    </main>
  )
}
