"use client"

// Force fresh build to clear cached static HTML
import { m } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import { Sparkles, Quote, BookOpen, MessageCircle, Dna } from "lucide-react"

export function AboutPageClient() {
  const t = useTranslations("About")
  const tPolicy = useTranslations("AboutEditorialPolicy")
  const locale = useLocale()
  const principles = tPolicy.raw("principles") as Array<{ icon: string; title: string; description: string }>

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-foreground selection:bg-amber-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-radial from-amber-500/10 via-transparent to-transparent -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>{locale === 'ko' ? '소개' : 'ABOUT'}</span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 whitespace-pre-line break-keep"
          >
            {t("intro")}
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl text-muted-foreground font-light tracking-wide"
          >
            {t("subIntro")}
          </m.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <m.div
            {...fadeInUp}
            className="relative glass-card rounded-3xl p-8 md:p-16 border border-white/5 overflow-hidden group"
          >
            <Quote className="absolute -top-4 -left-4 w-32 h-32 text-amber-500/5 rotate-12" />
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <h2 className="text-amber-400 font-serif text-2xl md:text-3xl italic">
                  {t("visionTitle")}
                </h2>
                <div className="w-12 h-1 bg-amber-500/50 rounded-full" />
              </div>
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                  {t("visionDesc")}
                </p>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
        <div className="max-w-6xl mx-auto space-y-16">
          <m.div {...fadeInUp} className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold">{t("pillarsOfWisdom")}</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full" />
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t("epicTitle"), desc: t("epicDesc"), icon: BookOpen },
              { title: t("chatTitle"), desc: t("chatDesc"), icon: MessageCircle },
              { title: t("testTitle"), desc: t("testDesc"), icon: Dna },
            ].map((feature, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all group"
              >
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-amber-500/60 font-serif text-2xl font-bold mb-4">0{i + 1}</div>
                <h4 className="text-xl font-bold mb-4 text-foreground group-hover:text-amber-200 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {feature.desc}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Policy Section */}
      <section className="py-24 px-4 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <m.div {...fadeInUp} className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold">{tPolicy("sectionTitle")}</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto font-light">
              {tPolicy("sectionSubtitle")}
            </p>
            <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4" />
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((p, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all group bg-white/[0.01]"
              >
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 text-2xl group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-white group-hover:text-amber-200 transition-colors">
                  {p.title}
                </h4>
                <p className="text-stone-400 leading-relaxed text-sm">
                  {p.description}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <m.div {...fadeInUp} className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {t("outroTitle")}
            </h3>
            <p className="text-2xl md:text-3xl font-serif font-medium leading-relaxed italic text-muted-foreground px-4">
              &ldquo;{t("outroDesc")}&rdquo;
            </p>
            <div className="pt-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                START JOURNEY
              </a>
            </div>
          </m.div>
        </div>
      </section>
    </div>
  )
}
