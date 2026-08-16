"use client"

import { useTranslations, useLocale } from "next-intl"
import { giants } from "@/lib/giants-data"
import { useGiantHistory } from "@/hooks/useGiantHistory"
import { questions } from "@/data/heritage-test"
import { routing } from "@/i18n/routing"

export function HeroSection() {
  const t = useTranslations("Hero")
  const tBrand = useTranslations("brand")
  const locale = useLocale()
  const { totalRead } = useGiantHistory()

  // Every figure is derived, never typed. The header used to claim 24 test
  // questions while the card below it and /dna both said 15 — a number written
  // in three places drifts in two of them.
  const meta = [
    { value: `${giants.length}`, label: t("stats.minds") },
    { value: `${questions.length}`, label: t("stats.questions") },
    { value: `${routing.locales.length}`, label: t("stats.languages") },
  ]

  return (
    <section
      className="pt-20 pb-6"
      style={{ borderBottom: "1px solid var(--rd-divider-faint)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="min-w-0 max-w-2xl">
            {/* H1은 브랜드 표기라 라틴 문자로 고정입니다. 데바나가리 폰트 분기는
                현지어 문구를 받는 아래 <p>로 옮겼습니다. */}
            <h1
              className="font-serif"
              style={{
                color: "var(--rd-text-ink)",
                fontSize: "var(--rd-h1-size)",
                fontWeight: "var(--rd-h1-weight)",
                letterSpacing: "var(--rd-h1-tracking)",
                lineHeight: "var(--rd-h1-leading)",
              }}
            >
              Giants Wisdom
            </h1>

            <p
              className={`mt-1 ${locale === 'hi' ? 'font-[family-name:var(--font-devanagari)]' : 'font-serif'}`}
              style={{
                color: "var(--rd-text-muted)",
                fontSize: "var(--rd-lede-size)",
                lineHeight: "var(--rd-lede-leading)",
              }}
            >
              {tBrand("mainTitle")}
            </p>

            <p
              className="mt-2 rd-card-intro"
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

        {totalRead > 0 && (
          <p
            className="mt-3"
            style={{
              color: "var(--rd-text-muted)",
              fontSize: "var(--rd-caption-size)",
              letterSpacing: "var(--rd-caption-tracking)",
            }}
          >
            <span style={{ color: "var(--rd-accent-brown)", fontWeight: 600 }}>{totalRead}</span>{" "}
            {t("exploreProgress", { total: giants.length })}
          </p>
        )}
      </div>
    </section>
  )
}
