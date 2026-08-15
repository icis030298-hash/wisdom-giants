"use client"

import { useTranslations, useLocale } from "next-intl"
import { giants } from "@/lib/giants-data"
import { useGiantHistory } from "@/hooks/useGiantHistory"

export function HeroSection() {
  const t = useTranslations("Hero")
  const tBrand = useTranslations("brand")
  const locale = useLocale()
  const { totalChatted } = useGiantHistory()

  // The stats trio already exists in all 24 locales; reusing it as the meta
  // column avoids inventing new copy.
  const meta = [
    { value: `${giants.length}`, label: t("stats.minds") },
    { value: "24", label: t("stats.questions") },
    { value: t("stats.freeValue"), label: t("stats.free") },
  ]

  return (
    <section
      className="pt-20 pb-6"
      style={{ borderBottom: "1px solid var(--rd-divider-faint)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="min-w-0 max-w-2xl">
            <h1
              className={locale === 'hi' ? 'font-[family-name:var(--font-devanagari)]' : 'font-serif'}
              style={{
                color: "var(--rd-text-ink)",
                fontSize: "var(--rd-h1-size)",
                fontWeight: "var(--rd-h1-weight)",
                letterSpacing: "var(--rd-h1-tracking)",
                lineHeight: "var(--rd-h1-leading)",
              }}
            >
              {tBrand("mainTitle")}
            </h1>

            <p
              className="mt-2 break-keep"
              style={{
                color: "var(--rd-text-body)",
                fontSize: "var(--rd-body-size)",
                lineHeight: "var(--rd-body-leading)",
              }}
            >
              {t("quote")}
              <span className="ms-1.5" style={{ color: "var(--rd-text-muted)" }}>
                — {t("quoteAuthor")}
              </span>
            </p>
          </div>

          <dl className="flex items-baseline gap-6 shrink-0">
            {meta.map((m) => (
              <div key={m.label} className="flex items-baseline gap-1.5">
                <dt className="sr-only">{m.label}</dt>
                <dd
                  style={{
                    color: "var(--rd-accent-brown)",
                    fontSize: "var(--rd-card-name-size)",
                    fontWeight: "var(--rd-card-name-weight)",
                  }}
                >
                  {m.value}
                </dd>
                <span
                  style={{
                    color: "var(--rd-text-muted)",
                    fontSize: "var(--rd-caption-size)",
                    letterSpacing: "var(--rd-caption-tracking)",
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </dl>
        </div>

        {totalChatted > 0 && (
          <p
            className="mt-3"
            style={{
              color: "var(--rd-text-muted)",
              fontSize: "var(--rd-caption-size)",
              letterSpacing: "var(--rd-caption-tracking)",
            }}
          >
            <span style={{ color: "var(--rd-accent-brown)", fontWeight: 600 }}>{totalChatted}</span>{" "}
            {t("chatProgress", { total: giants.length })}
          </p>
        )}
      </div>
    </section>
  )
}
