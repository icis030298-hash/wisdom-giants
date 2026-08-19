"use client"

import { useParams } from 'next/navigation'

export default function Loading() {
  const params = useParams()
  const locale = params?.locale as string || 'en'

  let loadingText = 'Summoning Timeless Wisdom...'
  if (locale === 'ja') {
    loadingText = '時を超えた知恵を呼び覚ます...'
  } else if (locale === 'ko') {
    loadingText = '시대를 초월한 지혜를 불러오는 중...'
  } else if (locale === 'de') {
    loadingText = 'Erwecke zeitlose Weisheit...'
  }
  // This screen sits between every cream page and the next, so anything dark
  // here flashes black on each navigation. That flash is what "the loading
  // screen is still the old one" referred to. The two amber blur circles are
  // gone: on cream they read as smudges rather than glow.
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "var(--rd-bg-base)" }}
    >
      <div className="relative w-16 h-16 mb-8">
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "3px solid var(--rd-divider-faint)" }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "3px solid var(--rd-accent-brown)",
            borderTopColor: "transparent",
          }}
        />
      </div>

      <div className="text-center space-y-3">
        <h2
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
        </h2>
        {/* No uppercase, no wide tracking: this string is translated. */}
        <p className="rd-caption">
          {loadingText}
        </p>
      </div>
    </div>
  )
}
