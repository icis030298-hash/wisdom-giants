"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Navigation } from "@/components/navigation"
import { Mail, Send, CheckCircle, AlertCircle, MessageSquare, Clock, MapPin } from "lucide-react"

export default function ContactPage() {
  const t = useTranslations("Contact")
  const locale = useLocale()

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ name: "", email: "", subject: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const infoCards = [
    {
      icon: Mail,
      title: locale === "ko" ? "이메일" : locale === "ja" ? "メール" : locale === "de" ? "E-Mail" : locale === "fr" ? "E-mail" : locale === "es" ? "Correo" : locale === "it" ? "Email" : locale === "pt" ? "E-mail" : "Email",
      value: "contact@giantswisdom.com",
      href: "mailto:contact@giantswisdom.com",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: Clock,
      title: locale === "ko" ? "응답 시간" : locale === "ja" ? "返信時間" : locale === "de" ? "Antwortzeit" : locale === "fr" ? "Délai de réponse" : locale === "es" ? "Tiempo de respuesta" : locale === "it" ? "Tempo di risposta" : locale === "pt" ? "Tempo de resposta" : "Response Time",
      value: locale === "ko" ? "영업일 기준 1-2일 이내" : locale === "ja" ? "1〜2営業日以内" : locale === "de" ? "Innerhalb 1-2 Werktagen" : locale === "fr" ? "Dans 1 à 2 jours ouvrables" : locale === "es" ? "En 1-2 días hábiles" : locale === "it" ? "Entro 1-2 giorni lavorativi" : locale === "pt" ? "Em 1-2 dias úteis" : "Within 1-2 business days",
      href: undefined,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: MapPin,
      title: locale === "ko" ? "운영 본부" : locale === "ja" ? "運営拠点" : locale === "de" ? "Betriebsstandort" : locale === "fr" ? "Siège" : locale === "es" ? "Sede" : locale === "it" ? "Sede" : locale === "pt" ? "Sede" : "Headquarters",
      value: locale === "ko" ? "대한민국 (Republic of Korea)" : "Republic of Korea",
      href: undefined,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  ]

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-slate-200">
      <Navigation />

      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <header className="mb-16 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest">
            <MessageSquare className="w-4 h-4" />
            {locale === "ko" ? "문의하기" : locale === "ja" ? "お問い合わせ" : locale === "de" ? "Kontakt" : locale === "fr" ? "Contact" : locale === "es" ? "Contacto" : locale === "it" ? "Contattaci" : locale === "pt" ? "Contato" : "Get in Touch"}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
            {locale === "ko"
              ? "서비스 이용 문의, 광고 관련 사항, 또는 협업 제안은 아래 양식으로 연락해 주세요."
              : locale === "ja"
              ? "サービスに関するご質問、広告に関するお問い合わせ、またはコラボレーションの提案は、以下のフォームからご連絡ください。"
              : locale === "de"
              ? "Für Service-Anfragen, Werbeanliegen oder Kooperationsvorschläge, nutzen Sie bitte das folgende Formular."
              : locale === "fr"
              ? "Pour toute question sur le service, demandes publicitaires ou propositions de collaboration, contactez-nous via le formulaire ci-dessous."
              : locale === "es"
              ? "Para consultas de servicio, asuntos publicitarios o propuestas de colaboración, contáctenos a través del formulario a continuación."
              : locale === "it"
              ? "Per domande sul servizio, questioni pubblicitarie o proposte di collaborazione, contattateci tramite il modulo sottostante."
              : locale === "pt"
              ? "Para dúvidas sobre o serviço, assuntos publicitários ou propostas de colaboração, entre em contato através do formulário abaixo."
              : "For service inquiries, advertising matters, or collaboration proposals, please reach out via the form below."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Info Cards */}
          <div className="lg:col-span-2 space-y-5">
            {infoCards.map((card) => (
              <div key={card.title} className={`p-6 rounded-2xl border ${card.bg} flex items-start gap-4`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{card.title}</p>
                  {card.href ? (
                    <a href={card.href} className={`${card.color} font-medium hover:underline text-sm`}>
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-slate-200 font-medium text-sm">{card.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* About the team */}
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <h3 className="text-white font-serif font-bold mb-3">
                {locale === "ko" ? "Giants Wisdom 팀" : locale === "ja" ? "Giants Wisdomチーム" : "Giants Wisdom Team"}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {locale === "ko"
                  ? "저희는 역사 교육과 AI 기술의 융합을 통해 인류의 지혜를 전달하는 것을 사명으로 하는 팀입니다. 500명 이상의 역사 위인들의 지식을 AI로 복원하여, 현대인들이 시공간을 초월해 위인들의 통찰을 경험할 수 있도록 합니다."
                  : locale === "ja"
                  ? "私たちは、歴史教育とAI技術の融合を通じて人類の知恵を伝えることを使命とするチームです。500人以上の歴史的偉人の知識をAIで再現し、現代人が時空を超えて偉人の洞察を体験できるようにします。"
                  : "We are a team dedicated to bridging historical wisdom and modern AI technology. Our mission is to restore and share the insights of 500+ historical giants, enabling people worldwide to experience timeless wisdom across centuries."}
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/[0.03] border border-white/8 rounded-[2rem] p-8 md:p-10">
              {status === "success" ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">{t("success")}</h3>
                  <p className="text-slate-400 text-sm">
                    {locale === "ko" ? "빠른 시일 내에 답변드리겠습니다." : locale === "ja" ? "できるだけ早くご返信いたします。" : "We'll get back to you shortly."}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    {locale === "ko" ? "다시 문의하기" : locale === "ja" ? "再度お問い合わせ" : "Send another message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("name")} *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder={t("namePlaceholder")}
                        className="w-full bg-slate-950/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("email")} *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder={t("emailPlaceholder")}
                        className="w-full bg-slate-950/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("subject")}</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      placeholder={t("subjectPlaceholder")}
                      className="w-full bg-slate-950/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("message")} *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder={t("messagePlaceholder")}
                      className="w-full bg-slate-950/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {t("error")}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    {status === "sending" ? t("sending") : t("send")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
