import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'] as const;
const DEFAULT_LOCALE = 'ko';

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
    pathname === '/sitemap.xml';

  if (isStaticOrApi) {
    return NextResponse.next();
  }

  // Check if pathname already has a valid locale prefix
  const firstSegment = pathname.split('/')[1];
  const hasLocale = (LOCALES as readonly string[]).includes(firstSegment);

  if (!hasLocale) {
    // Detect locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const locale = detectLocale(acceptLanguage);
    const redirectUrl = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(redirectUrl, 307);
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
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
