export const LOCALE_STATUS = {
  ko: { index: true },
  en: { index: true },
  de: { index: true },
  es: { index: true },
  ja: { index: true },
  fr: { index: true },
  it: { index: true },
  pt: { index: true },
  ar: { index: true },
  zh: { index: true },
  nl: { index: true },
  ru: { index: true },
  hi: { index: true },
  id: { index: true },
  pl: { index: true },
  sw: { index: true },
  th: { index: true },
  tr: { index: true },
  uk: { index: false },
  vi: { index: true },
  el: { index: true },
  fa: { index: true },
  he: { index: true },
  ha: { index: true },
} as const;

export type Locale = keyof typeof LOCALE_STATUS;

export const INDEXED_LOCALES = (Object.keys(LOCALE_STATUS) as Locale[]).filter(
  (locale) => LOCALE_STATUS[locale].index
);

export const isLocaleIndexed = (locale: string) => {
  return LOCALE_STATUS[locale as Locale]?.index ?? false;
};

export const INDEXED_BLOG_LOCALES = ['ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ru'];

export const isBlogLocaleIndexed = (locale: string) => {
  return INDEXED_BLOG_LOCALES.includes(locale) && isLocaleIndexed(locale);
};

export const buildSEOAlternates = (path: string, currentLocale: string) => {
  const languages: Record<string, string> = {
    'x-default': path
  };
  
  // Only add indexed locales to hreflang
  INDEXED_LOCALES.forEach(loc => {
    // Basic mapping for major region codes if needed, or just use locale as is
    // Assuming standard Next.js i18n matches locale strings
    const regionMap: Record<string, string> = {
      'ko': 'ko-KR', 'en': 'en-US', 'de': 'de-DE', 'es': 'es-ES',
      'ja': 'ja-JP', 'fr': 'fr-FR', 'it': 'it-IT', 'pt': 'pt-BR',
      'ar': 'ar-SA', 'hi': 'hi-IN', 'ru': 'ru-RU', 'zh': 'zh-CN'
    };
    const langKey = regionMap[loc] || loc;
    languages[langKey] = loc === 'ko' ? path : `/${loc}${path === '/' ? '' : path}`;
  });

  return {
    canonical: currentLocale === 'ko' ? path : `/${currentLocale}${path === '/' ? '' : path}`,
    languages
  };
};
