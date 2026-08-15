import { useTranslations } from "next-intl"

interface AuthorBoxProps {
  publishedDate: string
  updatedDate: string
}

export function AuthorBox({ publishedDate, updatedDate }: AuthorBoxProps) {
  const t = useTranslations('BlogAuthorBox')

  return (
    <div
      className="rd-surface p-6 my-8 flex gap-5 items-start"
      style={{ borderRadius: "var(--rd-card-radius)" }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 flex items-center justify-center text-xl flex-shrink-0 border rd-hairline"
        style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}
      >
        ✍️
      </div>

      {/* Information */}
      <div className="flex-1 space-y-1">
        {/* No uppercase and no wide tracking: the label reads in 24 languages,
            and neither does anything for Hangul, Kana, Arabic or Devanagari. */}
        <p className="rd-accent font-semibold text-xs">
          {t('authorLabel')}
        </p>
        <h4 className="rd-text-ink font-bold text-base">
          {t('authorName')}
        </h4>
        <p className="rd-text-body text-sm leading-relaxed">
          {t('authorDescription')}
        </p>

        {/* Published / Updated dates */}
        <div className="flex flex-wrap gap-4 rd-caption pt-2">
          <span className="flex items-center gap-1">
            📅 {t('publishedLabel')}: {publishedDate}
          </span>
          <span className="flex items-center gap-1">
            🔄 {t('updatedLabel')}: {updatedDate}
          </span>
        </div>
      </div>
    </div>
  )
}
