"use client"

import { m } from "framer-motion"
import { useLocale } from "next-intl"

export function AboutPageClient() {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-foreground pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* CEO Column Placeholder (User will fill this in) */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-400">
            {locale === 'ko' ? '운영자 소개' : 'About the Creator'}
          </h1>
          <div className="prose prose-invert prose-amber max-w-none font-light leading-relaxed">
            {/* TODO: User will write their 1st person story here */}
            <p className="text-xl text-muted-foreground italic">
              [The creator's 1st person column will be placed here]
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
