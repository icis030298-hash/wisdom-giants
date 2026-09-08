export const LOCALE_STATUS = {
  ko: { index: true },  en: { index: true },
  ja: { index: true },  zh: { index: true },
  de: { index: true },  fr: { index: true },
  // 아래 18개: 사용자에게는 보이되 검색 색인 제외.
  // 사유: 구글 스팸 정책 "scaled content abuse" — 자동 번역 대량 페이지.
  // 품질 검증 후 하나씩 다시 열 것. (2026-09-08 애드센스 재심사 대비)
  es: { index: false }, it: { index: false }, pt: { index: false },
  ar: { index: false }, nl: { index: false }, ru: { index: false },
  hi: { index: false }, id: { index: false }, pl: { index: false },
  sw: { index: false }, th: { index: false }, tr: { index: false },
  uk: { index: false }, vi: { index: false }, el: { index: false },
  fa: { index: false }, he: { index: false }, ha: { index: false },
} as const;

export type Locale = keyof typeof LOCALE_STATUS;

export const INDEXED_LOCALES = (Object.keys(LOCALE_STATUS) as Locale[]).filter(
  (locale) => LOCALE_STATUS[locale].index
);

export const isLocaleIndexed = (locale: string) => {
  return LOCALE_STATUS[locale as Locale]?.index ?? false;
};

export const INDEXED_BLOG_LOCALES = [
  'ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ru',
  'he', 'el', 'ha', 'sw', 'uk', 'pl', 'id',
  'ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh',
];

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
    canonical: `/${currentLocale}${path === '/' ? '' : path}`,
    languages
  };
};
