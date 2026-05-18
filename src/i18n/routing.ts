import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ko', 'en', 'de', 'ja'],

  // Used when no locale matches
  defaultLocale: 'ko',
  
  // Set to 'as-needed' or 'never' if you don't want the default locale in the URL
  localePrefix: 'always'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
