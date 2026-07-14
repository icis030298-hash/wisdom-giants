export const LOCALE_STATUS = {
  ko: { index: true },
  en: { index: true },
  de: { index: true },
  es: { index: true },
  ja: { index: false },
  fr: { index: true },
  it: { index: true },
  pt: { index: true },
  ar: { index: false },
  zh: { index: false },
  nl: { index: true },
  ru: { index: false },
  hi: { index: false },
  id: { index: true },
  pl: { index: true },
  sw: { index: true },
  th: { index: false },
  tr: { index: false },
  uk: { index: false },
  vi: { index: false },
  el: { index: false },
  fa: { index: false },
  he: { index: false },
  ha: { index: true },
} as const;

export type Locale = keyof typeof LOCALE_STATUS;

export const INDEXED_LOCALES = (Object.keys(LOCALE_STATUS) as Locale[]).filter(
  (locale) => LOCALE_STATUS[locale].index
);

export const isLocaleIndexed = (locale: string) => {
  return LOCALE_STATUS[locale as Locale]?.index ?? false;
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
