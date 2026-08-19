"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { giantsData } from "@/data/giants"
import { Navigation } from "@/components/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"

// Shared by every input on this page. Focus is a border-colour change plus the
// global :focus-visible outline, which is now brown — the amber ring it used
// to draw was the last amber left in the form.
const FIELD_STYLE: React.CSSProperties = {
  background: "var(--rd-surface)",
  border: "1px solid var(--rd-border)",
  borderRadius: "var(--rd-card-radius)",
  color: "var(--rd-text-body)",
  fontSize: "var(--rd-card-intro-size)",
}

const LABEL_STYLE: React.CSSProperties = {
  color: "var(--rd-text-muted)",
  fontSize: "var(--rd-caption-size)",
  letterSpacing: "var(--rd-caption-tracking)",
  fontWeight: 600,
}

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
      title: locale === "ko" ? "이메일" : locale === "ja" ? "メール" : locale === "de" ? "E-Mail" : locale === "fr" ? "E-mail" : locale === "es" ? "Correo" : locale === "it" ? "Email" : locale === "pt" ? "E-mail" : "Email",
      value: "contact@giantswisdom.com",
      href: "mailto:contact@giantswisdom.com",
    },
    {
      title: locale === "ko" ? "응답 시간" : locale === "ja" ? "返信時間" : locale === "de" ? "Antwortzeit" : locale === "fr" ? "Délai de réponse" : locale === "es" ? "Tiempo de respuesta" : locale === "it" ? "Tempo di risposta" : locale === "pt" ? "Tempo de resposta" : "Response Time",
      value: locale === "ko" ? "영업일 기준 1-2일 이내" : locale === "ja" ? "1〜2営業日以内" : locale === "de" ? "Innerhalb 1-2 Werktagen" : locale === "fr" ? "Dans 1 à 2 jours ouvrables" : locale === "es" ? "En 1-2 días hábiles" : locale === "it" ? "Entro 1-2 giorni lavorativi" : locale === "pt" ? "Em 1-2 dias úteis" : "Within 1-2 business days",
      href: undefined,
    },
    {
      title: locale === "ko" ? "운영 본부" : locale === "ja" ? "運営拠点" : locale === "de" ? "Betriebsstandort" : locale === "fr" ? "Siège" : locale === "es" ? "Sede" : locale === "it" ? "Sede" : locale === "pt" ? "Sede" : "Headquarters",
      value: locale === "ko" ? "대한민국 (Republic of Korea)" : "Republic of Korea",
      href: undefined,
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div
        className="mx-auto px-4 md:px-6 py-12 md:py-16"
        style={{ maxWidth: "calc(var(--rd-detail-main) + var(--rd-detail-sidebar) + var(--rd-detail-gap))" }}
      >
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
            {t("title")}
          </h1>
          <p className="rd-lede mt-3 max-w-xl">
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

        {/* Same two-column proportions as the giant detail page: the form is
            the body, the contact facts are the sidebar. */}
        <div
          className="grid gap-y-10 md:grid-cols-[minmax(0,var(--rd-detail-main))_var(--rd-detail-sidebar)]"
          style={{ columnGap: "var(--rd-detail-gap)" }}
        >
          {/* Form */}
          <div className="min-w-0 order-2 md:order-1">
            {status === "success" ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-8 h-8 mx-auto" style={{ color: "var(--rd-accent-brown)" }} />
                <h3 className="rd-doc-h3">{t("success")}</h3>
                <p className="rd-text-body" style={{ fontSize: "var(--rd-card-intro-size)" }}>
                  {locale === "ko" ? "빠른 시일 내에 답변드리겠습니다." : locale === "ja" ? "できるだけ早くご返信いたします。" : "We'll get back to you shortly."}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-5 py-2.5 rd-bg-surface rd-text-body transition-opacity hover:opacity-80 cursor-pointer"
                  style={{ border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-caption-size)" }}
                >
                  {locale === "ko" ? "다시 문의하기" : locale === "ja" ? "再度お問い合わせ" : "Send another message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block" style={LABEL_STYLE}>{t("name")} *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder={t("namePlaceholder")}
                      className="w-full px-3.5 py-2.5 transition-colors focus:outline-none"
                      style={FIELD_STYLE}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block" style={LABEL_STYLE}>{t("email")} *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder={t("emailPlaceholder")}
                      className="w-full px-3.5 py-2.5 transition-colors focus:outline-none"
                      style={FIELD_STYLE}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block" style={LABEL_STYLE}>{t("subject")}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder={t("subjectPlaceholder")}
                    className="w-full px-3.5 py-2.5 transition-colors focus:outline-none"
                    style={FIELD_STYLE}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block" style={LABEL_STYLE}>{t("message")} *</label>
                  <textarea
                    required
                    rows={8}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder={t("messagePlaceholder")}
                    className="w-full px-3.5 py-2.5 transition-colors focus:outline-none resize-none"
                    style={FIELD_STYLE}
                  />
                </div>

                {status === "error" && (
                  <div
                    className="flex items-center gap-2 p-3 rd-text-body"
                    style={{ border: "1px solid var(--rd-accent-brown)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-card-intro-size)" }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "var(--rd-accent-brown)" }} />
                    {t("error")}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full px-6 py-3.5 rd-bg-accent transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  style={{ borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-card-intro-size)", fontWeight: 600 }}
                >
                  {status === "sending" ? t("sending") : t("send")}
                </button>
              </form>
            )}
          </div>

          {/* Contact facts */}
          <aside className="min-w-0 order-1 md:order-2 space-y-6">
            <div className="space-y-4">
              {infoCards.map((card) => (
                <div
                  key={card.title}
                  className="ps-3"
                  style={{ borderInlineStart: "1px solid var(--rd-border)" }}
                >
                  <p style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)", letterSpacing: "var(--rd-caption-tracking)", fontWeight: 600 }}>
                    {card.title}
                  </p>
                  {card.href ? (
                    <a href={card.href} className="rd-link" style={{ fontSize: "var(--rd-card-intro-size)" }}>
                      {card.value}
                    </a>
                  ) : (
                    <p className="rd-text-body" style={{ fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
                      {card.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6" style={{ borderTop: "1px solid var(--rd-divider-faint)" }}>
              {/* Stays an h3: the page outline should not change just because
                  the panel moved into the sidebar. */}
              <h3 className="rd-doc-h3 mb-2">
                {locale === "ko" ? "Giants Wisdom 팀" : locale === "ja" ? "Giants Wisdomチーム" : "Giants Wisdom Team"}
              </h3>
              <p className="rd-text-body break-keep" style={{ fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
                {locale === "ko"
                  ? `저희는 역사 교육과 AI 기술의 융합을 통해 인류의 지혜를 전달하는 것을 사명으로 하는 팀입니다. ${giantsData.length}명 이상의 역사 위인들의 지식을 AI로 복원하여, 현대인들이 시공간을 초월해 위인들의 통찰을 경험할 수 있도록 합니다.`
                  : locale === "ja"
                  ? `私たちは、歴史教育とAI技術の融合を通じて人類の知恵を伝えることを使命とするチームです。${giantsData.length}人以上の歴史的偉人の知識をAIで再現し、現代人が時空を超えて偉人の洞察を体験できるようにします。`
                  : `We are a team dedicated to bridging historical wisdom and modern AI technology. Our mission is to restore and share the insights of ${giantsData.length}+ historical giants, enabling people worldwide to experience timeless wisdom across centuries.`}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
