import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { blogPosts } from '@/data/blog-posts'
import { giants } from '@/lib/giants-data'
import { Navigation } from '@/components/navigation'
import { getReadTime } from '@/utils/blog'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Share2, 
  Link2, 
  Tag, 
  ArrowRight,
  BookOpen
} from 'lucide-react'
import React from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

const BASE_URL = 'https://www.giantswisdom.com'
const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt'] as const

const uiTranslations: Record<string, Record<string, string>> = {
  ko: {
    backToBlog: "거인들의 지혜 블로그",
    readTime: "분 분량",
    chatWith: "와 대화하기",
    chatNow: "대화 시작하기",
    relatedPosts: "관련 포스트",
    ctaTitle: "와 직접 대화해보기",
    ctaDesc: "역사를 바꾼 거인의 두뇌와 실시간 AI 대화를 통해 깊은 인생의 해답과 통찰을 전수받아 보세요.",
    share: "공유하기",
    copylink: "링크 복사"
  },
  en: {
    backToBlog: "Wisdom Blog",
    readTime: "min read",
    chatWith: "Chat with ",
    chatNow: "Start Chat",
    relatedPosts: "Related Posts",
    ctaTitle: "Chat directly with ",
    ctaDesc: "Get direct, real-time life advice and profound wisdom from this historical giant through our advanced AI chat.",
    share: "Share",
    copylink: "Copy Link"
  },
  de: {
    backToBlog: "Weisheits-Blog",
    readTime: "Min. Lesung",
    chatWith: "Chatten mit ",
    chatNow: "Chat starten",
    relatedPosts: "Ähnliche Beiträge",
    ctaTitle: "Direkt chatten mit ",
    ctaDesc: "Erhalten Sie direktes, Echtzeit-Lebensberatung und tiefe Weisheit von diesem historischen Riesen durch unseren fortschrittlichen KI-Chat.",
    share: "Teilen",
    copylink: "Link kopieren"
  },
  ja: {
    backToBlog: "偉人たちの知恵ブログ",
    readTime: "分 読了",
    chatWith: "と対話する",
    chatNow: "対話を開始する",
    relatedPosts: "関連投稿",
    ctaTitle: "と直接対話してみる",
    ctaDesc: "高度なAIチャットを通じて、この歴史的な偉人から直接、リアルタイムの人生のヒントと深い知恵を得ることができます。",
    share: "共有",
    copylink: "リンクをコピー"
  },
  es: {
    backToBlog: "Blog de Sabiduría",
    readTime: "min de lectura",
    chatWith: "Chatear con ",
    chatNow: "Iniciar chat",
    relatedPosts: "Publicaciones relacionadas",
    ctaTitle: "Chatea directamente con ",
    ctaDesc: "Obtenga consejos de vida directos en tiempo real y una sabiduría profunda de este gigante histórico a través de nuestro chat de IA avanzado.",
    share: "Compartir",
    copylink: "Copiar enlace"
  },
  fr: {
    backToBlog: "Blog de la Sagesse",
    readTime: "min de lecture",
    chatWith: "Chatter avec ",
    chatNow: "Démarrer le chat",
    relatedPosts: "Articles connexes",
    ctaTitle: "Discuter directement avec ",
    ctaDesc: "Obtenez des conseils de vie en temps réel et une sagesse profonde de ce géant historique grâce à notre chat IA avancé.",
    share: "Partager",
    copylink: "Copier le lien"
  },
  it: {
    backToBlog: "Blog della Saggezza",
    readTime: "min di lettura",
    chatWith: "Chatta con ",
    chatNow: "Avvia Chat",
    relatedPosts: "Articoli correlati",
    ctaTitle: "Chatta direttamente con ",
    ctaDesc: "Ottieni consigli di vita diretti in tempo reale e una profonda saggezza da questo gigante storico attraverso la nostra chat IA avanzata.",
    share: "Condividi",
    copylink: "Copia Link"
  },
  pt: {
    backToBlog: "Blog da Sabedoria",
    readTime: "min de leitura",
    chatWith: "Conversar com ",
    chatNow: "Iniciar Chat",
    relatedPosts: "Publicações relacionadas",
    ctaTitle: "Converse diretamente com ",
    ctaDesc: "Obtenha conselhos de vida diretos em tempo real e uma sabedoria profunda deste gigante histórico através do nosso chat de IA avançado.",
    share: "Compartilhar",
    copylink: "Copiar Link"
  }
}

const categoryNames: Record<string, Record<string, string>> = {
  ko: { leadership: "리더십", philosophy: "철학", creativity: "창의성", wisdom: "지혜" },
  en: { leadership: "Leadership", philosophy: "Philosophy", creativity: "Creativity", wisdom: "Wisdom" },
  de: { leadership: "Führung", philosophy: "Philosophie", creativity: "Kreativität", wisdom: "Weisheit" },
  ja: { leadership: "リーダーシップ", philosophy: "哲学", creativity: "創造性", wisdom: "知恵" },
  es: { leadership: "Liderazgo", philosophy: "Filosofía", creativity: "Creatividad", wisdom: "Sabiduría" },
  fr: { leadership: "Leadership", philosophy: "Philosophie", creativity: "Créativité", wisdom: "Sagesse" },
  it: { leadership: "Leadership", philosophy: "Filosofia", creativity: "Creatività", wisdom: "Saggezza" },
  pt: { leadership: "Liderança", philosophy: "Filosofia", creativity: "Criatividade", wisdom: "Sabedoria" }
}

const colorMap: Record<string, string> = {
  leadership: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
  philosophy: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30",
  creativity: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30",
  wisdom: "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  if (!post) return {}

  const translation = post.translations[locale] || post.translations['en']
  const title = `${translation.title} | Giants Wisdom`
  const description = translation.description

  const hreflangLanguages: Record<string, string> = {
    'x-default': `${BASE_URL}/ko/blog/${slug}`,
  }
  for (const loc of LOCALES) {
    hreflangLanguages[loc] = `${BASE_URL}/${loc}/blog/${slug}`
  }

  const giant = giants.find(g => g.slug === post.giantSlug)
  const absoluteImageUrl = giant
    ? (giant.imageUrl.startsWith('http') ? giant.imageUrl : `${BASE_URL}${giant.imageUrl}`)
    : `${BASE_URL}/images/giants/cleopatra.png`

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: hreflangLanguages,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [{
        url: absoluteImageUrl,
        width: 800,
        height: 800,
        alt: title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      images: [absoluteImageUrl],
      title,
      description,
    }
  }
}

// Lightweight Markdown-to-JSX Parser
function parseMarkdown(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inBlockquote = false
  let blockquoteLines: string[] = []

  const flushBlockquote = (key: number) => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote key={`bq-${key}`} className="border-l-4 border-amber-500 bg-amber-500/5 px-6 py-5 my-8 rounded-r-2xl text-slate-300 leading-relaxed font-serif italic text-base md:text-lg">
          {blockquoteLines.join(' ')}
        </blockquote>
      )
      blockquoteLines = []
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    if (trimmed.startsWith('>')) {
      inBlockquote = true
      blockquoteLines.push(trimmed.slice(1).trim())
      return
    } else if (inBlockquote && trimmed !== '') {
      blockquoteLines.push(trimmed)
      return
    } else if (inBlockquote && trimmed === '') {
      flushBlockquote(index)
      inBlockquote = false
      return
    }

    if (inBlockquote) {
      flushBlockquote(index)
      inBlockquote = false
    }

    if (trimmed.startsWith('###')) {
      elements.push(
        <h3 key={`h3-${index}`} className="text-xl font-bold font-serif text-white mt-8 mb-4 tracking-tight">
          {trimmed.slice(3).trim()}
        </h3>
      )
    } else if (trimmed.startsWith('##')) {
      elements.push(
        <h2 key={`h2-${index}`} className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 mt-12 mb-6 border-b border-white/5 pb-3">
          {trimmed.slice(2).trim()}
        </h2>
      )
    } else if (trimmed.startsWith('#')) {
      elements.push(
        <h1 key={`h1-${index}`} className="text-3xl md:text-4xl font-serif font-bold text-white mt-12 mb-6">
          {trimmed.slice(1).trim()}
        </h1>
      )
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      elements.push(
        <li key={`li-${index}`} className="text-slate-300 text-base md:text-lg leading-relaxed ml-6 mb-3 list-disc font-light">
          {trimmed.slice(1).trim()}
        </li>
      )
    } else if (trimmed !== '') {
      elements.push(
        <p key={`p-${index}`} className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 font-light">
          {trimmed}
        </p>
      )
    }
  })

  if (inBlockquote) {
    flushBlockquote(lines.length)
  }

  return elements
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = blogPosts.find(p => p.slug === slug)
  if (!post) notFound()

  const translation = post.translations[locale] || post.translations['en']
  const giant = giants.find(g => g.slug === post.giantSlug)
  const readTime = getReadTime(translation.content, locale)
  const ui = uiTranslations[locale] || uiTranslations['en']
  const catNames = categoryNames[locale] || categoryNames['en']
  const catColor = colorMap[post.category] || "from-slate-500/20 to-zinc-500/20 text-slate-300 border-slate-500/30"

  const tg = await getTranslations({ locale, namespace: "Giants" })
  const getTranslation = (key: string, fallback: string) => {
    try {
      if (tg.has && !tg.has(key)) {
        return fallback;
      }
      const translated = tg(key);
      if (translated === `Giants.${key}` || translated.includes(`${key.split('.')[0]}.`)) {
        return fallback;
      }
      return translated;
    } catch (e) {
      return fallback;
    }
  }

  const getKoreanWithParticle = (name: string, suffix: string): string => {
    if (!name) return suffix;
    const lastChar = name.charCodeAt(name.length - 1);
    let particle = '와';
    if (lastChar >= 0xAC00 && lastChar <= 0xD7A3) {
      const hasBatchim = (lastChar - 0xAC00) % 28 > 0;
      particle = hasBatchim ? '과' : '와';
    }
    return `${particle} ${suffix}`;
  };

  const localizedName = post.giantSlug === 'cleopatra'
    ? (locale === 'ko' ? '클레오파트라' :
       locale === 'ja' ? 'クレオパトラ' :
       locale === 'de' ? 'Kleopatra' :
       locale === 'fr' ? 'Cléopâtre' : 'Cleopatra')
    : getTranslation(`${post.giantSlug}.name`, giant?.name || post.giantSlug)

  const absoluteImageUrl = giant
    ? giant.imageUrl
    : "https://yrqageqpxzltprtuvnpl.supabase.co/storage/v1/object/public/giants/napoleon-bonaparte.jpg"

  // Related posts (same category, up to 3 excluding current)
  const related = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)

  const postUrl = `${BASE_URL}/${locale}/blog/${post.slug}`
  const postTitle = translation.title

  // Fallback for cleopatra or giants without direct chat path
  const isCleopatra = post.giantSlug === 'cleopatra'
  const chatHref = isCleopatra ? `/${locale}#giants` : `/giant/${post.giantSlug}`

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navigation />
      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm font-medium transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {ui.backToBlog}
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4 mb-8">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${catColor}`}>
            <Tag className="w-3.5 h-3.5" />
            {catNames[post.category]}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            {translation.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} {ui.readTime}
            </span>
          </div>
        </div>

        {/* Giant Avatar & Quick Chat Direct Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 mb-10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-white/10 shrink-0">
              <img
                src={absoluteImageUrl}
                alt={localizedName}
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <h3 className="text-white font-serif font-bold">{localizedName}</h3>
              <p className="text-xs text-slate-500 font-light">{giant?.era || (locale === 'ko' ? '기원전 1세기' : '1st Century BC')}</p>
            </div>
          </div>
          
          <Link
            href={chatHref}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground font-semibold text-xs shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/25 transition-all scale-[1.01]"
          >
            <MessageSquare className="w-4 h-4" />
            {locale === 'ko' 
              ? `${localizedName}${getKoreanWithParticle(localizedName, "대화하기")}`
              : locale === 'ja' 
              ? `${localizedName}${ui.chatWith}` 
              : `${ui.chatWith}${localizedName}`}
          </Link>
        </div>

        {/* Article Body (Markdown parsed) */}
        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300">
          {parseMarkdown(translation.content)}
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center justify-between border-y border-white/5 py-6 my-12">
          <span className="flex items-center gap-2 text-slate-400 font-bold text-sm">
            <Share2 className="w-4 h-4" />
            {ui.share}
          </span>
          <div className="flex items-center gap-2">
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>
            {/* Copy Link component */}
            <button 
              className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={ui.copylink}
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CTA Card linking to giant's chat page */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 to-amber-600 p-8 md:p-10 shadow-2xl shadow-amber-500/20 text-center sm:text-left mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
              {locale === 'ko'
                ? `${localizedName}${getKoreanWithParticle(localizedName, "직접 대화해보기")}`
                : locale === 'ja'
                ? `${localizedName}${ui.ctaTitle}`
                : `${ui.ctaTitle}${localizedName}`}
              </h2>
              <p className="text-white/85 text-sm md:text-base max-w-xl font-light leading-relaxed">
                {ui.ctaDesc}
              </p>
            </div>
            <Link
              href={chatHref}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white text-amber-900 font-bold hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {ui.chatNow}
              <ArrowRight className="w-4 h-4 text-amber-900" />
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-2xl font-bold text-white">{ui.relatedPosts}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(p => {
                const translation = p.translations[locale] || p.translations['en']
                const rGiant = giants.find(g => g.slug === p.giantSlug)
                const readTime = getReadTime(translation.content, locale)
                const catColor = colorMap[p.category] || "from-slate-500/20 to-zinc-500/20 text-slate-300 border-slate-500/30"

                const rLocalizedName = p.giantSlug === 'cleopatra'
                  ? (locale === 'ko' ? '클레오파트라' :
                     locale === 'ja' ? 'クレオパトラ' :
                     locale === 'de' ? 'Kleopatra' :
                     locale === 'fr' ? 'Cléopâtre' : 'Cleopatra')
                  : getTranslation(`${p.giantSlug}.name`, rGiant?.name || p.giantSlug)

                return (
                  <Link 
                    key={p.slug} 
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col justify-between rounded-xl bg-slate-950 border border-white/5 hover:border-amber-500/30 p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mb-3 ${catColor}`}>
                        {catNames[p.category]}
                      </span>
                      <h3 className="font-serif font-bold text-white group-hover:text-amber-400 transition-colors text-sm md:text-base leading-snug line-clamp-2 mb-2">
                        {translation.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-4 pt-3 border-t border-white/5">
                      <span>{rLocalizedName}</span>
                      <span>{readTime} {ui.readTime}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
