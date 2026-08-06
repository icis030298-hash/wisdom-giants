// Shared logic for detecting untranslated / stub blog translations.
//
// Used by the blog post page metadata (robots index flag) and the sitemap
// route so that empty-shell translations — e.g. { title: "", description: "",
// content: "" } produced by a broken batch script — are consistently treated
// as "not translated" and kept out of the index / sitemap.
//
// IMPORTANT: we intentionally do NOT use a cross-language content-length ratio
// (e.g. "content < 35% of the English length"). Dense languages such as Korean,
// Japanese and Chinese legitimately express the same article in ~25–35% of the
// English character count, so a ratio rule would falsely deindex real ko/ja/zh
// posts. Instead we rely on empty-field detection plus a conservative absolute
// floor that only ever catches broken stubs.

interface BlogTranslationLike {
  title?: string;
  description?: string;
  content?: string;
}

// Minimum content length (characters) below which a translation is considered a
// broken stub rather than a real article. Every genuine translation in the
// dataset — including compact CJK locales — runs to well over a thousand
// characters; empty shells are 0. 500 sits safely between the two.
export const MIN_CONTENT_CHARS = 500;

// Minimum title length (trimmed characters). A batch-inject bug split the model
// response on the code-fence backtick, leaving 16 pt posts with garbage titles
// like "`, `" or ",". Real article titles across all 24 locales are >= 10 chars;
// an audit found no legitimate title below this floor.
export const MIN_TITLE_CHARS = 10;

/**
 * Returns true when the given translation should be treated as missing /
 * untranslated for indexing purposes.
 *
 * @param current The translation for the target locale (may be undefined).
 * @param en      The English translation, used as the reference title.
 */
export function isBlogTranslationMissing(
  current: BlogTranslationLike | undefined,
  en: BlogTranslationLike | undefined
): boolean {
  if (!current) return true;

  const title = (current.title ?? '').trim();
  const description = (current.description ?? '').trim();
  const content = (current.content ?? '').trim();

  // Any empty / whitespace-only field => stub, never a publishable article.
  if (!title || !description || !content) return true;

  // A backtick anywhere in the title means a code-fence fragment leaked in
  // (e.g. the "`, `" pt garbage). No real headline in the dataset contains one.
  if ((current.title ?? '').includes('`')) return true;

  // Absurdly short title => broken split artifact (e.g. ",").
  if (title.length < MIN_TITLE_CHARS) return true;

  // Title identical to English => placeholder that was never translated.
  if (en && typeof en.title === 'string' && current.title === en.title) return true;

  // Absurdly short body => broken stub.
  if (content.length < MIN_CONTENT_CHARS) return true;

  return false;
}
