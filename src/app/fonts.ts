import localFont from 'next/font/local'

/**
 * The three faces, self-hosted.
 *
 * These used to come from next/font/google, which fetches from
 * fonts.googleapis.com at build time. That put the production build behind a
 * few hundred network round-trips it could not retry its way out of: the logs
 * show bursts of "Retrying 1/3..." and a "socket hang up", and there is a
 * commit in this repository whose entire message is "retry deploy (next/font
 * transient failure)". A build should not be able to fail because someone
 * else's CDN blinked.
 *
 * The subsets are exactly the ones the components asked for before — latin for
 * Playfair Display and Nanum Myeongjo, devanagari for Noto Sans Devanagari —
 * so glyph coverage is unchanged. Nanum Myeongjo is a Korean face that Google
 * splits into about a hundred unicode-range chunks; `subsets: ['latin']`
 * resolved to the latin chunk, and that is the chunk stored here. Korean text
 * fell through to the next family in --font-serif then and still does.
 *
 * All three declarations live in this one module because the two not-found
 * pages and the locale layout each declared Nanum Myeongjo separately, which
 * is three places for the same five lines to drift apart.
 */

export const playfair = localFont({
  src: [
    {
      path: '../../public/fonts/playfair-display-latin-400-900.woff2',
      weight: '400 900',
      style: 'normal',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

export const nanumMyeongjo = localFont({
  src: [
    { path: '../../public/fonts/nanum-myeongjo-latin-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/nanum-myeongjo-latin-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/nanum-myeongjo-latin-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
  fallback: ['Nanum Myeongjo', 'Batang', 'serif'],
})

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
