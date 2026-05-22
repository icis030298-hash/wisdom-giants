import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (request.nextUrl.hostname === 'giantswisdom.com') {
    const newUrl = request.nextUrl.clone();
    newUrl.hostname = 'www.giantswisdom.com';
    return NextResponse.redirect(newUrl);
  }
  
  // Skip static files, API routes, and vercel speed insights/analytics
  const isStaticOrApi = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/monitoring') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml';

  if (!isStaticOrApi) {
    const hasLocale = pathname.startsWith('/ko') || pathname.startsWith('/en') || pathname.startsWith('/de') || pathname.startsWith('/ja') || pathname.startsWith('/es') || pathname.startsWith('/fr') || pathname.startsWith('/it') || pathname.startsWith('/pt');
    
    if (!hasLocale) {
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isKorean = acceptLanguage.toLowerCase().includes('ko');
      const isJapanese = acceptLanguage.toLowerCase().includes('ja');
      const isGerman = acceptLanguage.toLowerCase().includes('de');
      const isSpanish = acceptLanguage.toLowerCase().includes('es');
      const isFrench = acceptLanguage.toLowerCase().includes('fr');
      const isItalian = acceptLanguage.toLowerCase().includes('it');
      const isPortuguese = acceptLanguage.toLowerCase().includes('pt');
      
      let locale = 'en';
      if (isKorean) locale = 'ko';
      else if (isJapanese) locale = 'ja';
      else if (isGerman) locale = 'de';
      else if (isSpanish) locale = 'es';
      else if (isFrench) locale = 'fr';
      else if (isItalian) locale = 'it';
      else if (isPortuguese) locale = 'pt';

      
      // Redirect to the language specific route
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url)
      );
    }
  }

  const userAgent = request.headers.get('user-agent') || '';
  const isRobot = /bot|crawler|spider|google|naver|daum|bing|yahoo|lighthouse|yandex|applebot/i.test(userAgent);

  if (isRobot) {
    // Skip Supabase session check for crawlers to avoid 500 API errors
    return intlMiddleware(request);
  }

  // First, handle Supabase session update
  const supabaseResponse = await updateSession(request);
  
  // Then, handle i18n
  const intlResponse = intlMiddleware(request);
  
  // Merge Supabase cookies into the i18n response
  supabaseResponse.cookies.getAll().forEach(cookie => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      maxAge: cookie.maxAge,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      expires: cookie.expires,
      httpOnly: cookie.httpOnly,
    });
  });
  
  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
