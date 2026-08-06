export const VALID_LOCALES = [
  'ar', 'de', 'el', 'en', 'es', 'fa', 'fr', 'ha', 'he', 'hi',
  'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sw', 'th',
  'tr', 'uk', 'vi', 'zh',
] as const;

export type ValidLocale = (typeof VALID_LOCALES)[number];

export interface TranslationItemInput {
  slug: string;
  locale: string;
  title: string;
  description?: string;
  content: string;
  enTitle?: string;
}

export interface GateResult {
  valid: boolean;
  reasons: string[];
}

export function validateTranslationItem(
  item: TranslationItemInput,
  existingSameLocaleTitlesMap?: Map<string, string> // slug -> title within the same locale
): GateResult {
  const reasons: string[] = [];

  // (a) Locale validity check
  if (!VALID_LOCALES.includes(item.locale as ValidLocale)) {
    reasons.push(`Invalid locale '${item.locale}' (not in 24 valid locales)`);
  }

  // (b) Empty or whitespace-only field check
  if (!item.title || item.title.trim().length === 0) {
    reasons.push("Title is empty or whitespace-only");
  }
  if (item.description === undefined || item.description === null || item.description.trim().length === 0) {
    reasons.push("Description is empty or whitespace-only");
  }
  if (!item.content || item.content.trim().length === 0) {
    reasons.push("Content is empty or whitespace-only");
  }

  // (c) Title syntax corruption (backticks or code fences in title ONLY)
  if (item.title) {
    if (item.title.includes("`")) {
      reasons.push("Title contains backtick (`)");
    }
    if (item.title.includes("```")) {
      reasons.push("Title contains code fence (```)");
    }

    // (d) Minimum title length check (< 10 chars)
    if (item.title.trim().length < 10) {
      reasons.push(`Title length (${item.title.trim().length}) is less than 10 characters`);
    }

    // (e) Untranslated title check (title === enTitle)
    if (item.locale !== "en" && item.enTitle && item.title.trim() === item.enTitle.trim()) {
      reasons.push("Title is identical to English title (untranslated)");
    }

    // (f) Duplicate title check within the SAME locale across different slugs (batch index error)
    if (existingSameLocaleTitlesMap) {
      for (const [existingSlug, existingTitle] of existingSameLocaleTitlesMap.entries()) {
        if (existingSlug !== item.slug && existingTitle.trim() === item.title.trim()) {
          reasons.push(`Title matches another slug '${existingSlug}' in same locale '${item.locale}' (duplicate title / batch index error)`);
          break;
        }
      }
    }
  }

  // (g) Prompt scaffolding marker detection in raw content (*Tone:*, *Style:*, *Title:* ONLY)
  if (item.content) {
    const scaffoldingMarkers = ["*Tone:*", "*Style:*", "*Title:*"];
    for (const marker of scaffoldingMarkers) {
      if (item.content.includes(marker)) {
        reasons.push(`Content contains scaffolding marker '${marker}'`);
      }
    }

    // (h) Minimum content length check (< 500 characters)
    if (item.content.length < 500) {
      reasons.push(`Content length (${item.content.length}) is under 500 characters`);
    }
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
