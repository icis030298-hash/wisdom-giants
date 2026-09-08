import fs from 'fs';
import path from 'path';

const cache = new Map<string, Record<string, { name?: string }> | null>();

/**
 * Localised giant name from messages/<locale>.json → Giants.<slug>.name, the
 * same source the web chat header uses. Falls back to the roster's Korean name.
 */
export function localizedGiantName(slug: string, locale: string, fallback: string): string {
  const safeLocale = /^[a-z]{2}$/.test(locale) ? locale : 'en';
  if (!cache.has(safeLocale)) {
    try {
      const file = path.join(process.cwd(), 'messages', `${safeLocale}.json`);
      const json = JSON.parse(fs.readFileSync(file, 'utf8'));
      cache.set(safeLocale, json?.Giants ?? null);
    } catch {
      cache.set(safeLocale, null);
    }
  }
  return cache.get(safeLocale)?.[slug]?.name || fallback;
}
