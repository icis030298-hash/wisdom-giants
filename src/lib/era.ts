// Single source of truth for reading the era strings in giants-summary.json.
//
// Those strings come in two shapes:
//   "19세기의 거인 (1769~1821)"   -> label = "19세기의 거인", lifespan = "1769~1821"
//   "기원전 5세기 (그리스)"        -> label = "기원전 5세기",  lifespan = "기원전 5세기"
//
// The second shape is why this lives in one place. The card used to take the
// parenthetical unconditionally and showed "그리스" for Socrates and "춘추시대"
// for Confucius. Keeping both extractions together means a bug like that can
// only ever be fixed once.
//
// Digits are matched across every numeral system the data actually uses:
// ASCII, Arabic-Indic, Persian, Devanagari, Thai, full-width and CJK.
const HAS_DIGITS = /[0-9٠-٩۰-۹०-९๐-๙０-９一二三四五六七八九十]/

function parts(era?: string | null) {
  if (!era) return { lead: null, paren: null }
  const match = era.match(/\(([^)]+)\)/)
  const lead = era.replace(/\s*\([^)]*\)\s*/g, " ").trim() || null
  return { lead, paren: match ? match[1].trim() || null : null }
}

/** The date range shown on cards: "1769~1821", or the century when there is no range. */
export function lifespan(era?: string | null) {
  const { lead, paren } = parts(era)
  if (paren && HAS_DIGITS.test(paren)) return paren
  return lead ?? paren
}

/** The era phrase shown in the detail sidebar: "19세기의 거인", "기원전 5세기". */
export function eraLabel(era?: string | null) {
  const { lead, paren } = parts(era)
  return lead ?? paren
}

/**
 * Pick a locale's era string out of a giants-summary entry, falling back
 * through English to the untagged field.
 */
export function eraForLocale(
  entry: Record<string, unknown> | undefined | null,
  locale: string
): string | null {
  if (!entry) return null
  const pick = (key: string) => {
    const value = entry[key]
    return typeof value === "string" && value.trim() ? value.trim() : null
  }
  return pick(`era_${locale}`) ?? pick("era_en") ?? pick("era") ?? null
}
