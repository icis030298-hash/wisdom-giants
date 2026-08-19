"use client"


import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { trackCTAEvent } from "@/lib/analytics"
import { MessageSquare, Dna } from "lucide-react"

export function BlogCTA({ giantSlug, locale, giantName, chatHref }: { giantSlug: string, locale: string, giantName: string, chatHref: string }) {
  const t = useTranslations("BlogCTA")

  return (
    <div className="max-w-3xl mx-auto mt-16 mb-24 px-4 sm:px-6">
      {/* Was a .glass-card with an amber gradient wash and a blur orb. On cream
          all three were doing the same job badly — the card only needs to be a
          surface with a hairline, like every other block on the page. */}
      <div
        className="p-8 rd-surface"
        style={{ borderRadius: "var(--rd-card-radius)" }}
      >
        <div className="flex flex-col items-center text-center gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold rd-text-ink">
              {t('needMoreWisdomFrom', { giantName: giantName })}
            </h3>
            <p className="rd-text-body">
              {t('chatDirectlyWithThe')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
            <Link
              href={chatHref}
              onClick={() => trackCTAEvent('blog_post', 'chat', locale, giantSlug)}
              className="flex items-center justify-center gap-2 px-6 py-3 rd-bg-accent border font-bold hover:opacity-90 transition-opacity group w-full sm:w-auto"
              style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)", transitionDuration: "120ms" }}
            >
              <MessageSquare className="w-5 h-5" />
              {t('chatNow')}
            </Link>

            <Link
              href="/?mode=match"
              onClick={() => trackCTAEvent('blog_post', 'dna', locale, giantSlug)}
              className="flex items-center justify-center gap-2 px-6 py-3 border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 transition-opacity group w-full sm:w-auto font-medium"
              style={{ borderRadius: "var(--rd-card-radius)", transitionDuration: "120ms" }}
            >
              {/* The cyan icon was the only cool colour left on the page. */}
              <Dna className="w-5 h-5 rd-accent" />
              {t('dnaTest')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
