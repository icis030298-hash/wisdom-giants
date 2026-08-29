/**
 * Gemini models configuration for Giants Wisdom.
 *
 * Tier 2 (Pay-as-you-go) production models with verified fallbacks:
 * 1. gemini-3.5-flash-lite : primary fast, low-latency, cost-effective model (verified 200 OK)
 * 2. gemini-3.6-flash      : secondary high-capacity flash model fallback (verified 200 OK)
 * 3. gemini-2.5-flash-lite : stable previous generation lite fallback (verified 200 OK)
 * 4. gemini-2.5-flash      : stable previous generation standard fallback (verified 200 OK)
 *
 * Note: gemini-2.0-flash, gemini-2.0-flash-lite, and gemini-1.5-flash are retired/404.
 */

export const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
] as const;

export const DEFAULT_GEMINI_MODEL = GEMINI_MODELS[0];
