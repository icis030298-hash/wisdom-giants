/**
 * The language an AI reply must come back in, for every locale the site ships.
 *
 * Every generation route had grown its own `if (locale === 'en') … else` chain
 * covering the same eight locales, and every one of them ended in a Korean
 * else. A Thai user asking Socrates a question got Korean back — not English,
 * Korean — because the fallback was written when the site was Korean-first and
 * never revisited as locales were added. Sixteen of the twenty-four were in
 * that branch.
 *
 * A map instead of a chain, so adding a locale is one line here rather than an
 * extra `else if` in five files. The fallback is English, and it warns: a
 * missing entry should be noisy, since the last silent one shipped.
 *
 * Each value names the language in English and again in its own script.
 * Models follow "Thai (ภาษาไทย)" more reliably than either half alone — the
 * English half is unambiguous, the native half anchors the script.
 */
export const RESPONSE_LANGUAGE: Record<string, string> = {
  ar: 'Arabic (العربية)',
  de: 'German (Deutsch)',
  el: 'Greek (Ελληνικά)',
  en: 'English',
  es: 'Spanish (Español)',
  fa: 'Persian (فارسی)',
  fr: 'French (Français)',
  ha: 'Hausa',
  he: 'Hebrew (עברית)',
  hi: 'Hindi (हिन्दी)',
  id: 'Indonesian (Bahasa Indonesia)',
  it: 'Italian (Italiano)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  nl: 'Dutch (Nederlands)',
  pl: 'Polish (Polski)',
  pt: 'Portuguese (Português)',
  ru: 'Russian (Русский)',
  sw: 'Swahili (Kiswahili)',
  th: 'Thai (ภาษาไทย)',
  tr: 'Turkish (Türkçe)',
  uk: 'Ukrainian (Українська)',
  vi: 'Vietnamese (Tiếng Việt)',
  zh: 'Chinese (中文)',
}

/** The language name to put in a prompt. Unknown locales fall back to English, loudly. */
export function responseLanguage(locale: string | undefined | null): string {
  if (locale && RESPONSE_LANGUAGE[locale]) return RESPONSE_LANGUAGE[locale]
  console.warn(
    `[response-language] no entry for locale ${JSON.stringify(locale)}; falling back to English. ` +
      `Add it to RESPONSE_LANGUAGE in src/lib/response-language.ts.`
  )
  return RESPONSE_LANGUAGE.en
}

/**
 * The sentence that goes in a system prompt.
 *
 * Kept as one string so the instruction is worded identically everywhere; the
 * routes that had their own phrasing drifted, and one of them told the model to
 * use French politeness rules inside the Italian prompt.
 */
export function respondInLanguage(locale: string | undefined | null): string {
  return `Respond ONLY in ${responseLanguage(locale)}. Every sentence of your reply must be in that language.`
}
