import localFont from 'next/font/local'

/**
 * The one face that has to be self-hosted.
 *
 * This module started with three. They came from next/font/google, which
 * fetches from fonts.googleapis.com at build time and put the production build
 * behind a few hundred network round-trips it could not retry its way out of —
 * the logs show bursts of "Retrying 1/3..." and a "socket hang up", and there
 * is a commit here whose entire message is "retry deploy (next/font transient
 * failure)".
 *
 * Playfair Display and Nanum Myeongjo are gone, because nothing references
 * them any more: --font-serif now resolves to Pretendard, and those two were
 * only ever reachable through it. Nanum Myeongjo is worth a note — it was
 * loaded as `subsets: ['latin']`, a 21KB file whose @font-face nonetheless
 * claimed U+0-10FFFF, so browsers tried to draw Hangul with a font that has no
 * Hangul and fell back per character. Deleting it did not lose a glyph anyone
 * was seeing.
 *
 * Pretendard, which now carries everything, arrives by @import from a CDN at
 * the top of globals.css rather than from here. That is a runtime dependency
 * rather than a build one.
 */

// One file, not two: Noto Sans Devanagari is variable, so Google returns the
// same woff2 whether you ask for 400 or 700. Declaring it as a range means the
// browser interpolates instead of snapping to the nearest of two identical
// files, and Devanagari is the largest face here at 118KB — worth not
// shipping twice.
export const notoSansDevanagari = localFont({
  src: [
    { path: '../../public/fonts/noto-sans-devanagari-100-900.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-devanagari',
  display: 'swap',
  fallback: ['Noto Sans Devanagari', 'Nirmala UI', 'sans-serif'],
})
