"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import type { Giant } from "@/lib/giants-data"
import { useGiantHistory } from "@/hooks/useGiantHistory"
import { lifespan } from "@/lib/era"

interface GiantCardProps {
  giant: Giant
  index: number
  dbData?: { shortDescription?: string; era?: string; quote?: string }
}

export function GiantCard({ giant, dbData }: GiantCardProps) {
  const t = useTranslations("Giants")
  const gt = useTranslations("GiantsGrid")
  const { hasRead } = useGiantHistory()
  const explored = hasRead(giant.slug)

  // Helper to get translated text with fallback to raw data
  const getTranslation = (key: string, fallback: string) => {
    try {
      const translated = t(key);
      // Detect untranslated: next-intl returns key path like "Giants.albert-einstein.name"
      // We check exact equality with the namespaced key, OR if result starts with Giants.<slug>.
      const namespacedKey = `Giants.${key}`;
      const slugPrefix = `Giants.${giant.id}.`;

      const cleanText = (text: string) => text.replace(/^\[[a-z]{2}\]\s*/i, '').trim();

      if (translated === namespacedKey || translated === key || translated.startsWith(slugPrefix)) {
        return cleanText(fallback);
      }
      return cleanText(translated);
    } catch (e) {
      return fallback.replace(/^\[[a-z]{2}\]\s*/i, '').trim();
    }
  }

  const name = getTranslation(`${giant.id}.name`, giant.name)
  const shortDescription = dbData?.shortDescription || getTranslation(`${giant.id}.shortDescription`, giant.description)
  const years = lifespan(dbData?.era || giant.era)

  return (
    <Link
      href={`/giant/${giant.slug}`}
      className="group relative flex flex-col transition-colors active:scale-[0.99]"
      style={{
        background: "var(--rd-surface)",
        border: "1px solid var(--rd-border)",
        borderRadius: "var(--rd-card-radius)",
        paddingTop: "var(--rd-card-pad-top)",
        paddingInline: "var(--rd-card-pad-x)",
        paddingBottom: "var(--rd-card-pad-bottom)",
        transitionDuration: "120ms",
      }}
    >
      {explored && (
        <span
          className="absolute top-2 end-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: "var(--rd-accent-brown)", color: "var(--rd-surface)", fontSize: 10 }}
          aria-hidden="true"
        >
          ✓
        </span>
      )}

      {/* Category — the field axis only. No uppercase, no wide tracking. */}
      <span
        style={{
          color: "var(--rd-accent-brown)",
          fontSize: "var(--rd-category-size)",
          fontWeight: "var(--rd-category-weight)",
          letterSpacing: "var(--rd-category-tracking)",
          lineHeight: "var(--rd-category-leading)",
        }}
      >
        {gt(`categories.${giant.category}`)}
      </span>

      <h3
        className="mt-1"
        style={{
          color: "var(--rd-text-ink)",
          fontSize: "var(--rd-card-name-size)",
          fontWeight: "var(--rd-card-name-weight)",
          letterSpacing: "var(--rd-card-name-tracking)",
          lineHeight: "var(--rd-card-name-leading)",
        }}
      >
        {name}
      </h3>

      {years && (
        <span
          className="mt-0.5"
          style={{
            color: "var(--rd-text-muted)",
            fontSize: "var(--rd-caption-size)",
            letterSpacing: "var(--rd-caption-tracking)",
            lineHeight: "var(--rd-caption-leading)",
          }}
        >
          {years}
        </span>
      )}

      <p
        className="mt-2 rd-card-intro"
        style={{
          color: "var(--rd-text-body)",
          fontSize: "var(--rd-card-intro-size)",
          lineHeight: "var(--rd-card-intro-leading)",
        }}
      >
        {shortDescription}
      </p>
    </Link>
  )
}
