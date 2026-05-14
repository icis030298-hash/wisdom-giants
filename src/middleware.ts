import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // First, handle Supabase session update
  const supabaseResponse = await updateSession(request);
  
  // Then, handle i18n
  const intlResponse = intlMiddleware(request);
  
  // Merge headers/cookies if necessary
  // Note: next-intl middleware returns a response. 
  // We should ideally let next-intl handle the response but ensure Supabase cookies are set.
  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
