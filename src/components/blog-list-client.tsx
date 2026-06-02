"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { blogPosts, BlogPost } from "@/data/blog-posts"
import { giants } from "@/lib/giants-data"
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react"
import { getReadTime } from "@/utils/blog"

const translations: Record<string, Record<string, string>> = {
  ko: {
    all: "전체",
    leadership: "리더십",
    philosophy: "철학",
    creativity: "창의성",
    wisdom: "지혜",
    readTime: "분 분량",
    read: "읽기",
    headerTitle: "거인들의 지혜 블로그",
    headerSubtitle: "역사 속 위인들의 철학과 지혜를 현대적 관점에서 풀어쓰다",
    noPosts: "해당 카테고리에 포스트가 없습니다."
  },
  en: {
    all: "All",
    leadership: "Leadership",
    philosophy: "Philosophy",
    creativity: "Creativity",
    wisdom: "Wisdom",
    readTime: "min read",
    read: "Read",
    headerTitle: "Wisdom Blog",
    headerSubtitle: "Explore the philosophy and wisdom of historical giants in a modern context",
    noPosts: "No posts found in this category."
  },
  de: {
    all: "Alle",
    leadership: "Führung",
    philosophy: "Philosophie",
    creativity: "Kreativität",
    wisdom: "Weisheit",
    readTime: "Min. Lesung",
    read: "Lesen",
    headerTitle: "Weisheits-Blog",
    headerSubtitle: "Erkunden Sie die Philosophie und Weisheit historischer Giganten im modernen Kontext",
    noPosts: "Keine Beiträge in dieser Kategorie gefunden."
  },
  ja: {
    all: "すべて",
    leadership: "リーダーシップ",
    philosophy: "哲学",
    creativity: "創造性",
    wisdom: "知恵",
    readTime: "分 読了",
    read: "読む",
    headerTitle: "偉人たちの知恵ブログ",
    headerSubtitle: "歴史上の偉人たちの哲学と知恵를現代的な視点から紐解く",
    noPosts: "このカテゴリの投稿はありません。"
  },
  es: {
    all: "Todos",
    leadership: "Liderazgo",
    philosophy: "Filosofía",
    creativity: "Creatividad",
    wisdom: "Sabiduría",
    readTime: "min de lectura",
    read: "Leer",
    headerTitle: "Blog de Sabiduría",
    headerSubtitle: "Explore la filosofía y la sabiduría de los gigantes históricos en el contexto moderno",
    noPosts: "No se encontraron publicaciones en esta categoría."
  },
  fr: {
    all: "Tout",
    leadership: "Leadership",
    philosophy: "Philosophie",
    creativity: "Créativité",
    wisdom: "Sagesse",
    readTime: "min de lecture",
    read: "Lire",
    headerTitle: "Blog de la Sagesse",
    headerSubtitle: "Explorez la philosophie et la sagesse des géants historiques dans un contexte moderne",
    noPosts: "Aucun article trouvé dans cette catégorie."
  },
  it: {
    all: "Tutti",
    leadership: "Leadership",
    philosophy: "Filosofia",
    creativity: "Creatività",
    wisdom: "Saggezza",
    readTime: "min di lettura",
    read: "Leggi",
    headerTitle: "Blog della Saggezza",
    headerSubtitle: "Esplora la filosofia e la saggezza dei giganti storici nel contesto moderno",
    noPosts: "Nessun articolo trovato in questa categoria."
  },
  pt: {
    all: "Tudo",
    leadership: "Liderança",
    philosophy: "Filosofia",
    creativity: "Criatividade",
    wisdom: "Sabedoria",
    readTime: "min de leitura",
    read: "Ler",
    headerTitle: "Blog da Sabedoria",
    headerSubtitle: "Explore a filosofia e a sabedoria dos gigantes históricos no contexto moderno",
    noPosts: "Nenhuma publicação encontrada nesta categoria."
  }
}

const colorMap: Record<string, string> = {
  leadership: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
  philosophy: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30",
  creativity: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30",
  wisdom: "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
}


export function BlogListClient() {
  const locale = useLocale()
  const t = translations[locale] || translations["en"]
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", "leadership", "philosophy", "creativity", "wisdom"]

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory === "all") return true
    return post.category === selectedCategory
  })

  // Sort posts: publishedAt descending
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      {/* Header section with gradient mesh background */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-white/5 p-8 md:p-12 mb-12 text-center shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase border border-amber-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            WISDOM ARCHIVE
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            {t.headerTitle}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            {t.headerSubtitle}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground font-semibold shadow-lg shadow-amber-500/20 scale-[1.03]"
                  : "glass border border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t[cat]}
            </button>
          )
        })}
      </div>

      {/* Grid of Blog Cards */}
      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sortedPosts.map((post) => {
            const translation = post.translations[locale] || post.translations["en"]
            const giant = giants.find((g) => g.slug === post.giantSlug)
            const readTime = getReadTime(translation.content, locale)
            const catColor = colorMap[post.category] || "from-slate-500/20 to-zinc-500/20 text-slate-300 border-slate-500/30"

            const absoluteImageUrl = giant
              ? giant.imageUrl
              : "/images/giants/cleopatra.png" // fallback for Cleopatra or general fallback

            return (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-2xl bg-slate-950 border border-white/5 hover:border-amber-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5"
              >
                <div>
                  {/* Category and Read time info */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${catColor}`}>
                      <Tag className="w-3 h-3" />
                      {t[post.category]}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {readTime} {t.readTime}
                    </div>
                  </div>

                  {/* Title and description */}
                  <Link href={`/blog/${post.slug}`} className="block group/link">
                    <h2 className="text-xl font-serif font-bold text-white mb-3 group-hover/link:text-amber-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {translation.title}
                    </h2>
                  </Link>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[4.5rem]">
                    {translation.description}
                  </p>
                </div>

                {/* Giant Avatar & CTA button */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                      <img
                        src={absoluteImageUrl}
                        alt={giant?.name || "Cleopatra"}
                        className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-500"
                        onError={(e) => {
                          // Standard fallback if image loading fails
                          (e.target as HTMLImageElement).src = "https://yrqageqpxzltprtuvnpl.supabase.co/storage/v1/object/public/giants/napoleon-bonaparte.jpg"
                        }}
                      />
                    </div>
                    <div className="text-xs">
                      <p className="text-slate-400 font-semibold">{giant?.name || (locale === 'ko' ? '클레오파트라' : 'Cleopatra')}</p>
                      <p className="text-slate-600 text-[10px]">{post.publishedAt}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors border border-amber-500/20 hover:border-amber-400/40"
                  >
                    {t.read}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-950 rounded-2xl border border-white/5">
          <p className="text-slate-500 text-lg">{t.noPosts}</p>
        </div>
      )}
    </div>
  )
}
