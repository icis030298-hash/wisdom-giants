import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
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
    const hasLocale = pathname.startsWith('/ko') || pathname.startsWith('/en') || pathname.startsWith('/de');
    
    if (!hasLocale) {
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isKorean = acceptLanguage.toLowerCase().includes('ko');
      const isGerman = acceptLanguage.toLowerCase().includes('de');
      let locale = 'en';
      if (isKorean) locale = 'ko';
      else if (isGerman) locale = 'de';

      
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
