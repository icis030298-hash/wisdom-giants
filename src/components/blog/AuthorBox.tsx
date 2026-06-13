import { useTranslations } from "next-intl"

interface AuthorBoxProps {
  publishedDate: string
  updatedDate: string
}

export function AuthorBox({ publishedDate, updatedDate }: AuthorBoxProps) {
  const t = useTranslations('BlogAuthorBox')

  return (
    <div className="border border-stone-800 rounded-2xl p-6 my-8 bg-white/[0.02] flex gap-5 items-start backdrop-blur-sm">
      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl flex-shrink-0 border border-amber-500/20">
        ✍️
      </div>

      {/* Information */}
      <div className="flex-1 space-y-1">
        <p className="text-amber-400 font-semibold text-xs uppercase tracking-wider">
          {t('authorLabel')}
        </p>
        <h4 className="text-white font-bold text-base">
          {t('authorName')}
        </h4>
        <p className="text-stone-400 text-sm leading-relaxed">
          {t('authorDescription')}
        </p>

        {/* Published / Updated dates */}
        <div className="flex flex-wrap gap-4 text-xs text-stone-500 pt-2">
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
