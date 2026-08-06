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

  // (i) Script Leak & Script Ratio Check
  if (item.title || item.content) {
    const fullText = (item.title || "") + " " + (item.content || "");
    const totalChars = fullText.replace(/\s+/g, "").length;

    // Zero tolerance: Korean in Japanese
    if (item.locale === "ja") {
      if (/[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/.test(fullText)) {
        reasons.push("Japanese translation contains Korean Hangul characters");
      }
    }

    // Zero tolerance: Kana in Korean
    if (item.locale === "ko") {
      if (/[\u3040-\u30FF]/.test(fullText)) {
        reasons.push("Korean translation contains Japanese Kana characters");
      }
    }

    // Zero tolerance: Title must contain target script characters for non-Latin locales
    if (item.title && item.locale !== "en") {
      const nonLatinScriptMap: Record<string, RegExp> = {
        ja: /[\u3040-\u30FF\u4E00-\u9FFF]/,
        ko: /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/,
        uk: /[\u0400-\u04FF]/,
        ru: /[\u0400-\u04FF]/,
        el: /[\u0370-\u03FF]/,
        he: /[\u0590-\u05FF]/,
        ar: /[\u0600-\u06FF]/,
        fa: /[\u0600-\u06FF]/,
        th: /[\u0E00-\u0E7F]/,
        zh: /[\u4E00-\u9FFF]/,
      };

      const scriptRegex = nonLatinScriptMap[item.locale];
      if (scriptRegex && !scriptRegex.test(item.title)) {
        reasons.push(`Title contains 0 target script characters for non-Latin locale '${item.locale}' (untranslated/English title)`);
      }
    }

    // Majority script checks for non-Latin locales
    if (totalChars > 0) {
      if (item.locale === "uk" || item.locale === "ru") {
        const cyrillicMatch = fullText.match(/[\u0400-\u04FF]/g);
        const cyrillicCount = cyrillicMatch ? cyrillicMatch.length : 0;
        if (cyrillicCount / totalChars < 0.3) {
          reasons.push(`Cyrillic character ratio (${(cyrillicCount / totalChars).toFixed(2)}) is below 0.3 for ${item.locale}`);
        }
      } else if (item.locale === "el") {
        const greekMatch = fullText.match(/[\u0370-\u03FF]/g);
        const greekCount = greekMatch ? greekMatch.length : 0;
        if (greekCount / totalChars < 0.3) {
          reasons.push(`Greek character ratio (${(greekCount / totalChars).toFixed(2)}) is below 0.3`);
        }
      } else if (item.locale === "he") {
        const hebrewMatch = fullText.match(/[\u0590-\u05FF]/g);
        const hebrewCount = hebrewMatch ? hebrewMatch.length : 0;
        if (hebrewCount / totalChars < 0.3) {
          reasons.push(`Hebrew character ratio (${(hebrewCount / totalChars).toFixed(2)}) is below 0.3`);
        }
      } else if (item.locale === "ar" || item.locale === "fa") {
        const arabicMatch = fullText.match(/[\u0600-\u06FF]/g);
        const arabicCount = arabicMatch ? arabicMatch.length : 0;
        if (arabicCount / totalChars < 0.3) {
          reasons.push(`Arabic character ratio (${(arabicCount / totalChars).toFixed(2)}) is below 0.3 for ${item.locale}`);
        }
      } else if (item.locale === "th") {
        const thaiMatch = fullText.match(/[\u0E00-\u0E7F]/g);
        const thaiCount = thaiMatch ? thaiMatch.length : 0;
        if (thaiCount / totalChars < 0.3) {
          reasons.push(`Thai character ratio (${(thaiCount / totalChars).toFixed(2)}) is below 0.3`);
        }
      } else if (item.locale === "zh") {
        const cjkMatch = fullText.match(/[\u4E00-\u9FFF]/g);
        const cjkCount = cjkMatch ? cjkMatch.length : 0;
        if (cjkCount / totalChars < 0.3) {
          reasons.push(`CJK character ratio (${(cjkCount / totalChars).toFixed(2)}) is below 0.3`);
        }
      }
    }
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
