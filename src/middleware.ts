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
    const hasLocale = pathname.startsWith('/ko') || pathname.startsWith('/en') || pathname.startsWith('/de') || pathname.startsWith('/ja') || pathname.startsWith('/es');
    
    if (!hasLocale) {
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isKorean = acceptLanguage.toLowerCase().includes('ko');
      const isJapanese = acceptLanguage.toLowerCase().includes('ja');
      const isGerman = acceptLanguage.toLowerCase().includes('de');
      const isSpanish = acceptLanguage.toLowerCase().includes('es');
      let locale = 'en';
      if (isKorean) locale = 'ko';
      else if (isJapanese) locale = 'ja';
      else if (isGerman) locale = 'de';
      else if (isSpanish) locale = 'es';

      
      // Redirect to the language specific route
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url)
      );
    }
  }

  // First, handle Supabase session update
  const supabaseResponse = await updateSession(request);
  
  // Then, handle i18n
  const intlResponse = intlMiddleware(request);
  
  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
