import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import removedGiants from '@/config/removed-giants.json'

const LOCALES = ['ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'] as const;
const DEFAULT_LOCALE = 'ko';

// Giants removed in 2026-08 (no fact layer, no dedicated illustration).
// The route would otherwise render its not-found page with HTTP 200, i.e. a soft
// 404 across 24 locales. 410 tells crawlers the removal is deliberate.
const removedGiantsSet = new Set<string>(removedGiants);
const GIANT_PATH = /^\/([a-z]{2})\/giant\/([a-z0-9-]+)\/?$/;

function detectLocale(acceptLanguage: string): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  // Parse accept-language header (e.g. "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7")
  const preferred = acceptLanguage.split(',').map(part => {
    const [lang] = part.trim().split(';');
    return lang.trim().toLowerCase().slice(0, 2);
  });
  for (const lang of preferred) {
    if ((LOCALES as readonly string[]).includes(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect bare domain to www
  if (request.nextUrl.hostname === 'giantswisdom.com') {
    const newUrl = request.nextUrl.clone();
    newUrl.hostname = 'www.giantswisdom.com';
    return NextResponse.redirect(newUrl, 301);
  }

  // Skip static files, API routes, etc.
  const isStaticOrApi =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/monitoring') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/icon' ||
    pathname === '/apple-icon' ||
    pathname === '/manifest.webmanifest';

  if (isStaticOrApi) {
    return NextResponse.next();
  }

  // Permanently removed giants: answer 410 Gone instead of a soft 404.
  const giantMatch = pathname.match(GIANT_PATH);
  if (giantMatch && removedGiantsSet.has(giantMatch[2])) {
    return new NextResponse(null, {
      status: 410,
      headers: { 'x-robots-tag': 'noindex' },
    });
  }

  // Check if pathname already has a valid locale prefix
  const firstSegment = pathname.split('/')[1];
  const hasLocale = (LOCALES as readonly string[]).includes(firstSegment);

  if (!hasLocale) {
    // Detect locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const locale = detectLocale(acceptLanguage);
    const redirectUrl = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url);
    // Use 308 permanent redirect for SEO weight consolidation
    return NextResponse.redirect(redirectUrl, 308);
  }

  // Bot/crawler: skip Supabase session check to avoid 500 errors
  const userAgent = request.headers.get('user-agent') || '';
  const isRobot = /bot|crawler|spider|google|naver|daum|bing|yahoo|lighthouse|yandex|applebot/i.test(userAgent);

  if (isRobot) {
    return NextResponse.next();
  }

  // Update Supabase session
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|icon|apple-icon|manifest.webmanifest|.*\\..*).*)']
};
