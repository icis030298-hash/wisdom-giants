/**
 * Everything one blog card renders — and nothing else.
 *
 * The list page used to import @/data/blog-posts into a client component,
 * which shipped 196 posts x 24 locales of full article text (62MB source) to
 * the browser to display a title, a summary and a few pieces of metadata.
 * The only reason the body was needed at all was getReadTime(); that is a
 * division over the character or word count, so it runs on the server and
 * only the number travels.
 */
export interface BlogCardData {
  slug: string
  category: string
  /** Already formatted for display in the reader's locale. */
  publishedAt: string
  /** Sort key in milliseconds, not rendered. 0 when the date is unparseable,
   *  so undated posts settle at the end instead of jumping to the top. */
  publishedAtTime: number
  title: string
  description: string
  readTime: number
  giantName: string
  /** null when no portrait exists, so the card shows a plain avatar slot
   *  rather than someone else's face or a broken image. */
  giantImage: string | null
}
