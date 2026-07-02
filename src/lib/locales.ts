export const LOCALES = ['ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'] as const;
export type Locale = typeof LOCALES[number];

export function buildHreflang(baseUrl: string, path: string): Record<string, string> {
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/en${path}` };
  for (const locale of LOCALES) {
    languages[locale] = `${baseUrl}/${locale}${path}`;
  }
  return languages;
}
