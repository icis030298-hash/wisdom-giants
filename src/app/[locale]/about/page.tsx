import { useTranslations } from "next-intl"

export default function AboutUs() {
  const t = useTranslations("About")
  
  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-serif font-bold mb-8 text-foreground">{t("title")}</h1>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-serif font-bold text-amber-400 mb-4">{t("mission.title")}</h2>
            <p className="text-lg leading-relaxed">{t("mission.content")}</p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-foreground mb-2">{t("values.vision.title")}</h3>
              <p>{t("values.vision.content")}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-foreground mb-2">{t("values.wisdom.title")}</h3>
              <p>{t("values.wisdom.content")}</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-serif font-bold text-amber-400 mb-4">{t("contact.title")}</h2>
            <p>{t("contact.content")}</p>
          </section>
        </div>
      </div>
    </main>
  )
}
