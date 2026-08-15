"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { AdSlot } from "@/components/ad-slot"
import type { BlogCardData } from "@/types/blog-card"

// The eight per-category colour ramps that used to live here are gone. On a
// cream page a row of eight differently tinted pills is the loudest thing on
// screen, and it encodes nothing the label itself does not already say, so the
// category is now the same quiet brown caption the giant cards use.

// Cards arrive fully resolved from the server. The only state left here is
// which category is selected.
export function BlogListClient({ posts }: { posts: BlogCardData[] }) {
  const t = useTranslations("BlogUI")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", "leadership", "philosophy", "creativity", "wisdom", "science", "arts", "society", "business"]

  const sortedPosts = useMemo(() => {
    const filtered = selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory)
    return [...filtered].sort((a, b) => b.publishedAtTime - a.publishedAtTime)
  }, [posts, selectedCategory])

  return (
    <div
      className="mx-auto px-4 md:px-6 py-12 md:py-16"
      style={{ maxWidth: "var(--rd-container)" }}
    >
      {/* Header. No mesh gradient, no blur orbs, no dark slab — the page
          background is the surface now, so the title only needs a rule under
          it to read as a header. */}
      <header className="pb-8 mb-10 rd-hairline-bottom">
        <h1
          style={{
            color: "var(--rd-text-ink)",
            fontSize: "var(--rd-h1-size)",
            fontWeight: "var(--rd-h1-weight)",
            letterSpacing: "var(--rd-h1-tracking)",
            lineHeight: "var(--rd-h1-leading)",
          }}
        >
          {t('headerTitle')}
        </h1>
        <p className="rd-lede mt-3 max-w-2xl">
          {t('headerSubtitle')}
        </p>
      </header>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 border transition-colors cursor-pointer ${
                isActive ? "rd-bg-accent" : "rd-bg-surface rd-text-body hover:opacity-80"
              }`}
              style={{
                borderColor: isActive ? "var(--rd-accent-brown)" : "var(--rd-border)",
                borderRadius: "var(--rd-card-radius)",
                fontSize: "var(--rd-caption-size)",
                letterSpacing: "var(--rd-caption-tracking)",
                transitionDuration: "120ms",
              }}
              aria-pressed={isActive}
            >
              {t(cat)}
            </button>
          )
        })}
      </div>

      {/* Editor's letter. A single inline-start rule rather than a tinted,
          amber-bordered card — the same treatment the fact-layer blocks on the
          giant detail page use. */}
      <section
        className="mb-12 ps-4"
        style={{ borderInlineStart: "2px solid var(--rd-accent-brown)" }}
      >
        <h2 className="rd-doc-h2">{t('creatorLetterTitle')}</h2>
        <div className="mt-3 space-y-3 max-w-2xl">
          <p className="rd-body-lg">{t('creatorLetterP1')}</p>
          <p className="rd-body-lg">{t('creatorLetterP2')}</p>
          <p className="rd-body-lg">{t('creatorLetterP3')}</p>
        </div>
      </section>

      {/* Grid of Blog Cards */}
      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedPosts.map((post) => {
            const readTime = post.readTime
            const localizedName = post.giantName

            return (
              <article
                key={post.slug}
                className="flex flex-col justify-between transition-colors"
                style={{
                  background: "var(--rd-surface)",
                  border: "1px solid var(--rd-border)",
                  borderRadius: "var(--rd-card-radius)",
                  paddingTop: "var(--rd-card-pad-top)",
                  paddingInline: "var(--rd-card-pad-x)",
                  paddingBottom: "var(--rd-card-pad-bottom)",
                  transitionDuration: "120ms",
                }}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      style={{
                        color: "var(--rd-accent-brown)",
                        fontSize: "var(--rd-category-size)",
                        fontWeight: "var(--rd-category-weight)",
                        letterSpacing: "var(--rd-category-tracking)",
                        lineHeight: "var(--rd-category-leading)",
                      }}
                    >
                      {t(post.category)}
                    </span>
                    <span className="rd-caption shrink-0">
                      {readTime} {t('readTime')}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="block mt-2">
                    <h2
                      className="line-clamp-2 break-keep"
                      style={{
                        color: "var(--rd-text-ink)",
                        fontSize: "var(--rd-card-name-size)",
                        fontWeight: "var(--rd-card-name-weight)",
                        letterSpacing: "var(--rd-card-name-tracking)",
                        lineHeight: "var(--rd-card-name-leading)",
                      }}
                    >
                      {post.title}
                    </h2>
                  </Link>

                  <p
                    className="mt-2 line-clamp-3 break-keep"
                    style={{
                      color: "var(--rd-text-body)",
                      fontSize: "var(--rd-card-intro-size)",
                      lineHeight: "var(--rd-card-intro-leading)",
                    }}
                  >
                    {post.description}
                  </p>
                </div>

                <div
                  className="flex items-center justify-between gap-3 mt-4 pt-3"
                  style={{ borderTop: "1px solid var(--rd-divider-faint)" }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden shrink-0"
                      style={{ background: "var(--rd-divider-faint)", border: "1px solid var(--rd-border)" }}
                    >
                      {post.giantImage && (
                        // No remote fallback: the old one pointed at a Supabase
                        // object that returns nothing (naturalWidth 0). When
                        // there is no portrait the styled circle stands on its
                        // own rather than showing an unrelated face.
                        <img
                          src={post.giantImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="rd-caption truncate" style={{ color: "var(--rd-text-body)" }}>{localizedName}</p>
                      <p className="rd-caption">{post.publishedAt}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="rd-link shrink-0"
                    style={{ fontSize: "var(--rd-caption-size)" }}
                  >
                    {t('read')}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div
          className="py-20 text-center rd-bg-surface"
          style={{ border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}
        >
          <p className="rd-text-muted">{t('noPosts')}</p>
        </div>
      )}

      {/* AdSpace Container with safe margin */}
      <div
        className="mt-16 pt-12 flex justify-center"
        style={{ borderTop: "1px solid var(--rd-border)" }}
      >
        <AdSlot slot="4898120960" format="horizontal" />
      </div>
    </div>
  )
}
