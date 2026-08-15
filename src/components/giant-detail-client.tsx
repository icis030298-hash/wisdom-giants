"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { m, AnimatePresence } from "framer-motion"
import { ChatInterface } from "@/components/chat-interface"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname, Link } from "@/i18n/routing"
import { 
  MessageCircle,
  Sparkles,
  History,
  HeartPulse,
  Lightbulb,
  Quote,
  CheckCircle2,
  X,
  Dna,
  Download,
  Link2,
  Share2,
  BookOpen,
  ArrowRight,
  MessageCircleHeart,
  Swords
} from "lucide-react"
import { archetypes } from "@/data/heritage-test"
import { giants } from "@/lib/giants-data"
import { ConditionalAdSense } from "@/components/conditional-adsense"
import { AdSlot } from "@/components/ad-slot"
import GiantAvatar from "@/components/GiantAvatar"
import { trackCTAEvent } from "@/lib/analytics"

// Sidebar block heading: 13px / 600 / brown, no , no wide tracking.
const SIDEBAR_LABEL = {
  color: "var(--rd-accent-brown)",
  fontSize: "var(--rd-sidebar-label-size)",
  fontWeight: "var(--rd-sidebar-label-weight)",
  letterSpacing: "var(--rd-sidebar-label-tracking)",
  lineHeight: "var(--rd-sidebar-label-leading)",
} as const

interface GiantDetailClientProps {
  giant: any;
  translations: {
    giantDetail: any;
    giants: any;
    giantsGrid: any;
    ui?: any;
    giantBlogLink?: any;
    narrative?: any;
    factLayer?: any;
  };
  relatedBlogPosts: any[];
  wikipediaUrl: string | null;
}

function RelatedGiantCard({ related, locale, getRelatedTranslation }: { related: any; locale: string; getRelatedTranslation: any }) {
  const [imgErr, setImgErr] = useState(false);
  const tUI = useTranslations("UI");
  return (
    <Link
      href={`/giant/${related.slug}`}
      className="group relative rounded-3xl p-6 border rd-hairline hover:opacity-90 transition-all duration-500 flex flex-col h-full hover:scale-[1.02] overflow-hidden animate-fade-in-up"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 bg-muted">
        {!imgErr ? (
          <Image
            src={related.imageUrl}
            alt={`${related.name} - Giants Wisdom`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="rd-portrait object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center rd-bg-surface">
            <GiantAvatar slug={related.slug} category={related.category} size={100} />
          </div>
        )}
        <div className="absolute inset-0" />
      </div>
      
      <h3 className="font-serif text-xl font-bold rd-text-ink group-hover:opacity-90 transition-colors mb-1">
        {getRelatedTranslation(related.slug, 'name', related.name)}
      </h3>
      <p className="text-xs rd-accent mb-4 font-medium">
        {getRelatedTranslation(related.slug, 'headline', related.title || related.headline)}
      </p>
      
      <p className="text-sm rd-text-muted line-clamp-3 leading-relaxed mb-6 flex-1">
        {getRelatedTranslation(related.slug, 'shortDescription', related.description)}
      </p>
      
      <div className="mt-auto w-full py-3.5 rounded-xl rd-bg-accent group-hover:opacity-90 rd-accent text-xs font-semibold transition-all border rd-hairline group-hover:opacity-90 text-center flex items-center justify-center gap-1">
        <span>{tUI('readEpic')}</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

export function GiantDetailClient({ giant, translations, relatedBlogPosts, wikipediaUrl }: GiantDetailClientProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showMatchOverlay, setShowMatchOverlay] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const activeLocale = (locale === 'ko' ? 'ko' : locale === 'de' ? 'de' : locale === 'ja' ? 'ja' : 'en') as 'ko' | 'en' | 'de' | 'ja';
  const tt = useTranslations("Test")
  const tUI = useTranslations("UI")
  const tNav = useTranslations("Navigation")
  // Query params are read from the browser instead of useSearchParams() on purpose:
  // useSearchParams() opts this entire subtree out of prerendering, which stripped the
  // narrative, trials, wisdom and fact-layer text out of the server-rendered HTML.
  // All params below only drive modals/overlays that start closed, so resolving them
  // one tick after hydration is harmless.
  const pathname = usePathname()
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams())

  useEffect(() => {
    setQueryParams(new URLSearchParams(window.location.search))
  }, [pathname])

  const chatParam = queryParams.get('chat')
  const chatId = queryParams.get('chatId')
  const mode = queryParams.get('mode')
  const dna = queryParams.get('dna')

  // Related Giants Logic: filter by same category, exclude current giant, show 3 random
  const currentCategory = giant.category;
  const filteredGiants = giants.filter((g: any) => g.category === currentCategory && g.slug !== giant.slug);
  
  // Deterministic stable shuffle based on giant name length to prevent jumping around on render
  const getRelatedGiants = () => {
    if (filteredGiants.length <= 3) return filteredGiants;
    const seed = giant.name.length;
    const shuffled = [...filteredGiants].sort((a, b) => {
      const valA = (a.slug.length * seed) % 10;
      const valB = (b.slug.length * seed) % 10;
      return valA - valB;
    });
    return shuffled.slice(0, 3);
  };
  const relatedGiants = getRelatedGiants();


  const shareCardRef = useRef<HTMLDivElement>(null)
  const storyCardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showToast, setShowToast] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareCardType, setShareCardType] = useState<'story' | 'square'>('story')
  const [cardScale, setCardScale] = useState(0.25)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        setCardScale(containerWidth / 1080)
      }
    }
    const timer = setTimeout(handleResize, 100)
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [shareCardType])

  useEffect(() => {
    if (mode === 'match') {
      setShowMatchOverlay(true)
    }
  }, [mode])

  // Automatically open chat if redirected from chat history or problem consult
  useEffect(() => {
    if (chatParam === 'true' || queryParams.get('problem')) {
      setIsChatOpen(true)
    }
  }, [chatParam, queryParams])

  // Initialize Kakao SDK safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const Kakao = (window as any).Kakao
      if (Kakao && !Kakao.isInitialized()) {
        Kakao.init('b175da0c630ebd18d18862f12fc1cb09')
      }
    }
  }, [])
  
  const { giantDetail: t, giants: tg, giantsGrid: tc, narrative, giantBlogLink } = translations;

  const tGiants = useTranslations("Giants");
  const getRelatedTranslation = (slug: string, key: string, fallback: string) => {
    try {
      const translated = tGiants(`${slug}.${key}`);
      if (translated.includes(`${slug}.`) || translated === `Giants.${slug}.${key}`) {
        return fallback;
      }
      return translated;
    } catch {
      return fallback;
    }
  };

  // Use standardized narrative if available, otherwise fallback to basic translations
  const epicContent = narrative?.epic;
  const trialsContent = narrative?.trials || tg.pain;
  const overcomingContent = narrative?.overcoming || tg.recovery;
  const wisdomList = narrative?.wisdom || (giant.lessons || []).map((l: any) => ({ quote: l.title, meaning: l.content }));
  
  // Sidebar era comes from giants-summary.json via props, the same source the
  // cards use. messages.Giants.<slug>.era holds a placeholder for 44 giants.
  const eraContent = (translations as any).eraLabel || narrative?.era || tg.era || giant.era;

  // Helper to render text (simplified, as we'll use CSS pre-wrap)
  const formatContent = (text: string) => {
    if (!text) return null;
    return text.replace(/\\n/g, '\n');
  };

  const isRTL = ['ar', 'fa', 'he'].includes(locale);
  const alignClass = isRTL 
    ? 'text-right md:text-justify' 
    : (locale === 'ja' || locale === 'zh') 
      ? 'text-left' 
      : 'text-left md:text-justify';

  const parseParagraphs = (content: string | string[] | undefined): string[] => {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    
    const rawParas = content.split(/\n\n|\\n\\n/).map(p => p.trim()).filter(Boolean);
    const merged: string[] = [];
    
    for (let i = 0; i < rawParas.length; i++) {
      let p = rawParas[i];
      const isTitle = (p.length < 80 && !/[.!?。！？]$/.test(p)) || /^(#+\s*|\d+\.\s+)/.test(p);
      
      if (isTitle && i < rawParas.length - 1) {
        p = p.replace(/^(#+\s*|\d+\.\s*)/, '').trim();
        if (p) {
          merged.push(p + ' — ' + rawParas[i+1]);
        } else {
          merged.push(rawParas[i+1]);
        }
        i++;
      } else {
        merged.push(p);
      }
    }
    
    return merged;
  };

  const categoryLabel = tc.categories?.[giant.category] || 
    (typeof giant.category === 'string' ? 
      ({
        'leadership': '정치·리더십',
        'science': '과학·혁신',
        'philosophy': '철학·사상',
        'arts': '문학·예술',
        'society': '인권·사회',
        'business': '탐험·비즈니스'
      } as any)[giant.category.toLowerCase()] : null) || giant.category;

  const handleSaveImage = async () => {
    const isStory = shareCardType === 'story'
    const targetRef = isStory ? storyCardRef : shareCardRef
    if (!targetRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      
      const options = isStory ? {
        backgroundColor: '#020617',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 1080,
        height: 1920,
      } : {
        backgroundColor: '#0B0F1A',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      }

      const canvas = await html2canvas(targetRef.current, options)
      const link = document.createElement('a')
      
      if (isStory) {
        link.download = locale === 'ko' 
          ? `나의유산DNA_스토리_${tg.name || giant.name}.png` 
          : `HeritageDNA_Story_${tg.name || giant.name}.png`
      } else {
        link.download = locale === 'ko' 
          ? `나의유산DNA_${tg.name || giant.name}.png` 
          : `HeritageDNA_${tg.name || giant.name}.png`
      }
      
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Share card capture failed:', err)
    }
  }

  const handleNativeShare = async () => {
    const archetypeName = dna ? (archetypes[dna]?.name[activeLocale] || tg.name) : tg.name
    const shareText = locale === 'ko'
      ? `나와 닮은 역사 속 위인은 ${archetypeName}! 당신은 어떤 위인과 닮았나요?`
      : locale === 'de'
      ? `Mein historischer Zwilling ist '${archetypeName}'! Welchem historischen Riesen ähneln Sie?`
      : locale === 'ja'
      ? `私に最も似ている歴史上の偉人は「${archetypeName}」です！あなたはどの偉人に似ていますか？`
      : locale === 'pt' ? `Minha figura histórica é ${archetypeName}! Com qual personagem histórico você se parece?` : `My historical match is ${archetypeName}! Which historical giant do you resemble?`
    const shareUrl = `${window.location.origin}/${locale}/dna`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Giants Wisdom',
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} 👉 ${shareUrl}`)
      } catch {
        const ta = document.createElement('textarea')
        ta.value = `${shareText} 👉 ${shareUrl}`
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    const dnaType = dna ? (archetypes[dna]?.name[activeLocale] || tg.name) : tg.name;
    const giantName = tg.name;
    const text = locale === 'ko' 
      ? `나와 닮은 역사 속 위인은 ${giantName}! 당신은 어떤 위인과 닮았나요? 👉 https://www.giantswisdom.com/ko/dna`
      : locale === 'de'
      ? `Mein historischer Zwilling ist ${giantName}! Welchem Riesen ähneln Sie? 👉 https://www.giantswisdom.com/de/dna`
      : locale === 'pt' ? `Minha figura histórica é ${giantName}! Com qual personagem histórico você se parece? 👉 https://www.giantswisdom.com/pt/dna` : `My historical match is ${giantName}! Who's your historical match? 👉 https://www.giantswisdom.com/en/dna`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitterShare = () => {
    const dnaType = dna ? (archetypes[dna]?.name[activeLocale] || tg.name) : tg.name;
    const giantName = tg.name;
    const text = locale === 'ko'
      ? `나와 닮은 역사 속 위인은 ${giantName} 🏛️\n당신은 어떤 위인과 닮았나요?\n#GiantsWisdom #역사위인 #위인찾기`
      : locale === 'de'
      ? `Mein historischer Zwilling ist ${giantName} 🏛️\nWelchem Riesen ähneln Sie?\n#GiantsWisdom #HistorischerZwilling`
      : locale === 'pt' ? `Meu DNA histórico é do tipo ${giantName}! 🏛️\nCom qual figura histórica você se parece?\n#GiantsWisdom #História #Sabedoria` : `My historical match is ${giantName} 🏛️\nWho's your historical match?\n#GiantsWisdom #HistoricalMatch`;
    
    const url = locale === 'ko'
      ? 'https://www.giantswisdom.com/ko/dna'
      : locale === 'de'
      ? 'https://www.giantswisdom.com/de/dna'
      : 'https://www.giantswisdom.com/en/dna';
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=450'
    );
  };

  const handleFacebookShare = () => {
    const dnaType = dna ? (archetypes[dna]?.name[activeLocale] || tg.name) : tg.name;
    const giantName = tg.name;
    const url = locale === 'ko'
      ? 'https://www.giantswisdom.com/ko/dna'
      : locale === 'de'
      ? 'https://www.giantswisdom.com/de/dna'
      : 'https://www.giantswisdom.com/en/dna';
    
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(
        locale === 'ko'
          ? `나와 닮은 역사 속 위인은 ${giantName}! 당신은 어떤 위인과 닮았나요?`
          : locale === 'de'
          ? `Mein historischer Zwilling ist ${giantName}! Welchem Riesen ähneln Sie?`
          : locale === 'pt' ? `Minha figura histórica é ${giantName}! Com qual personagem histórico você se parece?` : `My historical match is ${giantName}! Who's your historical match?`
      )}`,
      '_blank',
      'width=550,height=450'
    );
  };

  const shareToKakao = async () => {
    if (typeof window === 'undefined') return

    // Wait up to 3 seconds for Kakao to load
    let attempts = 0
    while (typeof (window as any).Kakao === 'undefined' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    const Kakao = (window as any).Kakao

    if (typeof Kakao === 'undefined') {
      alert(locale === 'ko'
        ? '카카오 공유를 불러올 수 없습니다. 페이지를 새로고침해주세요.'
        : 'Cannot load Kakao Share. Please refresh the page.')
      return
    }

    if (!Kakao.isInitialized()) {
      try {
        Kakao.init('b175da0c630ebd18d18862f12fc1cb09')
      } catch (e) {
        console.error("Kakao init failed:", e)
      }
    }

    const dnaType = dna ? (archetypes[dna]?.name[activeLocale] || tg.name) : tg.name
    const giantName = tg.name
    const giantSlug = giant.slug
    const ext = giant.imageUrl.split('.').pop() || 'jpg'
    const imageUrl = `https://www.giantswisdom.com/images/giants/${giantSlug}.${ext}`

    try {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: locale === 'ko' ? `나와 닮은 위인: ${giantName}` : `My historical match: ${giantName}`,
          description: locale === 'ko' ? `${giantName} 유형 - Giants Wisdom` : `${giantName} Type - Giants Wisdom`,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: locale === 'ko' ? '나도 테스트하기' : 'Try Test Too',
            link: {
              mobileWebUrl: `https://www.giantswisdom.com/${locale}/dna`,
              webUrl: `https://www.giantswisdom.com/${locale}/dna`,
            },
          },
        ],
      })
    } catch (error) {
      console.error("Kakao Share execution error:", error)
      try {
        const shareText = locale === 'ko'
          ? `나와 닮은 역사 속 위인은 ${dnaType}! 당신은 어떤 위인과 닮았나요?`
          : locale === 'pt' ? `Minha figura histórica é ${dnaType}! Com qual personagem histórico você se parece?` : `My historical match is ${dnaType}! Which historical giant do you resemble?`
        navigator.clipboard.writeText(`${shareText} 👉 ${window.location.href}`)
      } catch {
        const shareText = locale === 'ko'
          ? `나와 닮은 역사 속 위인은 ${dnaType}! 당신은 어떤 위인과 닮았나요?`
          : locale === 'pt'
          ? `Meu DNA histórico é do tipo ${dnaType}! 🏛️ Com qual figura histórica você se parece? #GiantsWisdom #História #Sabedoria`
          : locale === 'pt' ? `Minha figura histórica é ${dnaType}! Com qual personagem histórico você se parece?` : `My historical match is ${dnaType}! Which historical giant do you resemble?`
        const ta = document.createElement('textarea')
        ta.value = `${shareText} 👉 ${window.location.href}`
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      alert(locale === 'ko' 
        ? "카카오톡 연결에 실패했습니다. 대신 공유 링크가 복사되었습니다!" 
        : "Failed to connect to KakaoTalk. Share link has been copied to your clipboard instead!")
    }
  }

  return (
    <div className="min-h-screen">
      <ConditionalAdSense />
      
      {/* Interactive Bar */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 pt-6 pb-2 flex justify-end">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 rd-bg-accent transition-colors cursor-pointer active:scale-[0.99]"
        >
          <MessageCircle className="w-6 h-6" />
          <span>
            {locale === 'ko' ? (() => {
              const name = (tg.name || "").split(" ")[0];
              const lastChar = name.charCodeAt(name.length - 1);
              const hasBatchim = lastChar >= 0xAC00 && lastChar <= 0xD7A3 && (lastChar - 0xAC00) % 28 > 0;
              const particle = hasBatchim ? '과' : '와';
              return `${name}${particle} 대화하기`;
            })() : t.chatWith.replace("{name}", (tg.name || "").split(" ")[0])}
          </span>
          <Sparkles className="w-4 h-4 opacity-70" />
        </button>
      </div>

      {/* Content Section */}
      {/* Two columns: body 760 + sidebar 320, gap 56. No table of contents —
          the narrative is continuous prose with no subheadings to point at. */}
      <div
        className="mx-auto px-4 md:px-6 py-10 grid gap-y-10 md:grid-cols-[minmax(0,var(--rd-detail-main))_var(--rd-detail-sidebar)]"
        style={{ maxWidth: "calc(var(--rd-detail-main) + var(--rd-detail-sidebar) + var(--rd-detail-gap))", columnGap: "var(--rd-detail-gap)" }}
      >
        {/* Body */}
        <div className="min-w-0 space-y-12">
          {/* 1. Epic Narrative Section */}
          {epicContent && (() => {
            const paragraphs = parseParagraphs(epicContent).filter(Boolean);

            return (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 rd-accent">
                  <div className="w-10 h-10 rounded-xl rd-bg-accent flex items-center justify-center border rd-hairline">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{t.theLifeStory}</h2>
                </div>
                
                {/* Story Card Wrapper */}
                <div className="p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-[3rem] border rd-hairline relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-64 h-64 rd-bg-accent rounded-full blur-[100px]" />
                  
                  {/* All paragraphs are rendered continuously (no pagination) so that
                      crawlers and non-JS clients receive the full narrative text. */}
                  <div className="relative z-10 max-w-2xl mx-auto w-full space-y-6 md:space-y-8">
                    {paragraphs.map((para: string, idx: number) => {
                      if (idx === 0) {
                        let cleaned = para.trim();
                        cleaned = cleaned.replace(/^[\s*#_~`‘“"'"]+/g, '');
                        cleaned = cleaned.replace(/\*\*/g, '').replace(/\*/g, '');

                        const firstLetter = cleaned.substring(0, 1);
                        const restOfText = cleaned.substring(1);

                        return (
                          <p key={idx} className={`text-base md:text-lg lg:text-xl rd-text-body leading-[2.1] tracking-tight font-normal break-keep break-words ${alignClass}`}>
                            <span className={`text-5xl md:text-6xl font-serif rd-accent font-black leading-none mt-1 md:mt-2 ${
 isRTL ? 'ml-3 md:ml-4 float-right' : 'mr-3 md:mr-4 float-left'
 }`}>
                              {firstLetter}
                            </span>
                            {restOfText}
                          </p>
                        );
                      }

                      // clear-both keeps the first paragraph's drop cap from bleeding into
                      // the next paragraph when the opening paragraph is unusually short.
                      return (
                        <p key={idx} className={`clear-both text-base md:text-lg lg:text-xl rd-text-body leading-[2.1] tracking-tight font-normal break-keep break-words ${alignClass}`}>
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Open Chat CTA */}
                {paragraphs.length > 0 && (
                  <div className="flex justify-center mt-2">
                    <button 
                      onClick={() => setIsChatOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border rd-hairline rd-bg-accent rd-accent text-xs font-semibold hover:opacity-90 hover:opacity-90 hover:scale-105 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>
                        {locale === 'ko' ? (() => {
                          const name = (tg.name || giant.name || "").split(" ")[0];
                          const lastChar = name.charCodeAt(name.length - 1);
                          const hasBatchim = lastChar >= 0xAC00 && lastChar <= 0xD7A3 && (lastChar - 0xAC00) % 28 > 0;
                          const particle = hasBatchim ? '과' : '와';
                          return `${name}${particle} 대화하기`;
                        })() : `Talk with ${(tg.name || giant.name || "").split(" ")[0]}`}
                      </span>
                    </button>
                  </div>
                )}
              </section>
            );
          })()}

          {/* Fact Box Section */}
          {narrative?.fact_box && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 rd-accent">
                <div className="w-8 h-8 rounded-lg rd-bg-surface flex items-center justify-center border rd-hairline">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold">
                  {locale === 'ko' ? '요약 & 주요 업적' : 'Quick Facts & Achievements'}
                </h2>
              </div>
              <div className="p-6 md:p-8 rounded-2xl border rd-hairline space-y-6">
                {/* One Line Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold rd-accent">
                    {locale === 'ko' ? '한 줄 요약' : 'Summary'}
                  </h3>
                  <p className="rd-text-body text-base font-medium leading-relaxed">{narrative.fact_box.one_line_summary}</p>
                </div>
                
                {/* Key Achievements */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold rd-accent">
                    {tUI('keyAchievements')}
                  </h3>
                  <ul className="space-y-3">
                    {narrative.fact_box.key_achievements.map((ach: string, idx: number) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="rd-accent font-bold">✓</span>
                        <span className="rd-text-body text-sm md:text-base leading-relaxed">{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Legacy Statement */}
                {narrative.fact_box.legacy_statement && (
                  <div className="space-y-2 pt-2 border-t rd-hairline">
                    <h3 className="text-xs font-bold rd-accent">
                      {locale === 'ko' ? '영향 및 유산' : 'Impact & Legacy'}
                    </h3>
                    <p className="rd-text-body text-sm md:text-base leading-relaxed">
                      "{narrative.fact_box.legacy_statement}"
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 2. Trials & Overcoming Combined into a sophisticated layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Trials */}
            <section className="space-y-4 md:space-y-6 flex flex-col h-full">
              <div className="flex items-center gap-3 rd-accent">
                <History className="w-5 h-5" />
                <h2 className="text-sm font-bold">{t.thePain}</h2>
              </div>
              <div className="flex-1 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border rd-hairline rd-bg-surface relative group overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-3 md:space-y-4">
                  {parseParagraphs(trialsContent).map((p: string, i: number) => (
                    p ? (
                       <p key={i} className="text-sm md:text-base rd-text-body leading-[1.8] font-normal break-keep break-words">
                        {p}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </section>

            {/* Overcoming */}
            <section className="space-y-4 md:space-y-6 flex flex-col h-full">
              <div className="flex items-center gap-3 rd-accent">
                <HeartPulse className="w-5 h-5" />
                <h2 className="text-sm font-bold">{t.theRecovery}</h2>
              </div>
              <div className="flex-1 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border rd-hairline rd-bg-surface relative group overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-3 md:space-y-4">
                  {parseParagraphs(overcomingContent).map((p: string, i: number) => (
                    p ? (
                       <p key={i} className="text-sm md:text-base rd-text-body leading-[1.8] font-normal break-keep break-words">
                        {p}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* 4. Wisdom (Quotes) Section */}
          <section className="space-y-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full rd-bg-accent flex items-center justify-center border rd-hairline">
                <Lightbulb className="w-8 h-8 rd-accent" />
              </div>
              <h2 className="text-3xl font-serif font-bold rd-text-ink">{t.wisdomLessons}</h2>
              <div className="w-24 h-1" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {wisdomList.length > 0 ? (
                wisdomList.map((item: any, index: number) => (
                  <div key={index} className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] border rd-hairline hover:opacity-90 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 rd-bg-accent rounded-full group-hover:opacity-90 transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-6 mb-6 md:mb-10">
                        <span className="text-4xl md:text-5xl font-black rd-accent select-none">
                          0{index + 1}
                        </span>
                        <div className="h-px flex-1" />
                      </div>
                      
                      <blockquote className="text-lg md:text-2xl lg:text-3xl font-serif rd-accent mb-6 md:mb-10 leading-[1.4] tracking-tight whitespace-pre-wrap">
                        &ldquo;{formatContent(item.quote)}&rdquo;
                      </blockquote>
                      
                      <div className="relative pl-5 md:pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" />
                        <p className="text-sm md:text-base lg:text-lg rd-text-body leading-relaxed font-normal whitespace-pre-wrap">
                          {formatContent(item.meaning)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                (tg.lessons || []).map((lesson: any, index: number) => (
                  <div key={index} className="p-6 md:p-8 rounded-xl md:rounded-2xl border rd-hairline hover:opacity-90 transition-all group">
                    <h3 className="text-lg md:text-xl font-bold rd-text-ink mb-2">{lesson.title}</h3>
                    <p className="text-sm md:text-base rd-text-muted leading-relaxed">
                      {lesson.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>



          {/* AdSpace Container with safe margin */}
          <div className="ad-container my-12 flex justify-center border-t rd-hairline pt-8">
            <AdSlot slot="4898120960" format="horizontal" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="min-w-0">
          <div className="sticky top-20 space-y-6">
            
            {/* Overview */}
            <div className="grid grid-cols-2 gap-4 pb-4" style={{ borderBottom: "1px solid var(--rd-divider-faint)" }}>
              <div className="space-y-1">
                <h4 style={SIDEBAR_LABEL}>{t.era}</h4>
                <p style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)" }}>{eraContent}</p>
              </div>
              <div className="space-y-1">
                <h4 style={SIDEBAR_LABEL}>{t.field}</h4>
                <p style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)" }}>{categoryLabel}</p>
              </div>
            </div>

            {/* Wikipedia E-E-A-T Link */}
            {wikipediaUrl && (
              <a 
                href={wikipediaUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="w-full py-3.5 rounded-xl border rd-hairline hover:opacity-90 rd-text-muted hover:opacity-90 font-medium text-sm transition-all flex items-center justify-center gap-2 group active:scale-95 rd-bg-surface cursor-pointer"
              >
                <span>🌐</span>
                <span>{getRelatedTranslation('detail', 'learnMoreWikipedia', tUI('learnMoreOnWikipedia'))}</span>
              </a>
            )}

            {/* Fact layer: timeline / achievements / FAQ, moved out of the body
                into the sidebar. Blocks are separated by an inline-start rule
                only, and a block with no data is dropped entirely rather than
                left as an empty heading. */}
            {translations.factLayer && (
              <div id="fact-layer" className="space-y-6">
                <h2 style={SIDEBAR_LABEL}>
                  {translations.ui?.timelineAndFacts || 'Timeline & Facts'}
                </h2>

                {translations.factLayer.timeline?.length > 0 && (
                  <div className="ps-3" style={{ borderInlineStart: "1px solid var(--rd-border)" }}>
                    <h3 style={SIDEBAR_LABEL}>{translations.ui?.timeline || 'Timeline'}</h3>
                    <ul className="mt-2 space-y-2">
                      {translations.factLayer.timeline.map((tItem: any, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="shrink-0 tabular-nums" style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}>{tItem.year}</span>
                          <span style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>{tItem.event}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {translations.factLayer.keyAchievements?.length > 0 && (
                  <div className="ps-3" style={{ borderInlineStart: "1px solid var(--rd-border)" }}>
                    <h3 style={SIDEBAR_LABEL}>{translations.ui?.keyAchievements || 'Key Achievements'}</h3>
                    <ul className="mt-2 space-y-1.5 list-disc ps-4">
                      {translations.factLayer.keyAchievements.map((ach: any, idx: number) => (
                        <li key={idx} style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
                          {typeof ach === 'string' ? ach : ach.description || ach.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {translations.factLayer.faq?.length > 0 && (
                  <div className="ps-3" style={{ borderInlineStart: "1px solid var(--rd-border)" }}>
                    <h3 style={SIDEBAR_LABEL}>{translations.ui?.faq || 'FAQ'}</h3>
                    <div className="mt-2 space-y-1">
                      {translations.factLayer.faq.map((q: any, idx: number) => (
                        // details/summary keeps every answer in the DOM even when
                        // collapsed, so crawlers still read them. The first item
                        // is open by default.
                        <details key={idx} open={idx === 0} className="group">
                          <summary className="cursor-pointer list-none">
                            <h4
                              className="flex items-start gap-1.5"
                              style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-intro-size)", fontWeight: 600, lineHeight: "var(--rd-card-intro-leading)" }}
                            >
                              <span aria-hidden="true" style={{ color: "var(--rd-accent-brown)" }} className="shrink-0">▸</span>
                              {q.question}
                            </h4>
                          </summary>
                          <p className="mt-1 ps-4" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)", lineHeight: "var(--rd-card-intro-leading)" }}>
                            {q.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subtle subtext */}
            <p style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)", lineHeight: "var(--rd-caption-leading)" }}>
              {tg.shortDescription}
            </p>
          </div>
        </aside>
      </div>

      {/* Related Blog Posts */}
      {giantBlogLink && relatedBlogPosts && relatedBlogPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-8 pb-16 space-y-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full rd-bg-accent flex items-center justify-center border rd-hairline">
              <BookOpen className="w-6 h-6 rd-accent" />
            </div>
            <h2 className="text-3xl font-serif font-bold rd-text-ink">
              {giantBlogLink.title}
            </h2>
            <div className="w-24 h-1" />
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {relatedBlogPosts.slice(0, 3).map((post: any) => {
              const trans = post.translations[locale] || post.translations['en']
              
              // Calculate reading time
              let readTime = 1;
              if (locale === 'ko' || locale === 'ja') {
                readTime = Math.max(1, Math.ceil(trans.content.length / 500));
              } else {
                const words = trans.content.trim().split(/\s+/).length;
                readTime = Math.max(1, Math.ceil(words / 200));
              }

              return (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="flex items-start gap-4 p-4 rounded-xl rd-bg-surface border rd-hairline hover:opacity-90 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="rd-text-ink text-sm font-medium group-hover:opacity-90 transition-colors">
                      {trans.title}
                    </p>
                    <p className="rd-text-muted text-xs mt-1">
                      {readTime} {giantBlogLink.minuteRead}
                    </p>
                  </div>
                  <span className="rd-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Engagement CTAs */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold rd-text-ink">
            {locale === 'ko' ? '이 거인과 더 깊이' : 'Dive Deeper'}
          </h2>
          <div className="w-16 h-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/debate?giant=${giant.slug}`}
            onClick={() => trackCTAEvent('giant_page', 'debate', locale, giant.slug)}
            className="flex flex-col items-center text-center p-6 rounded-2xl border rd-hairline hover:opacity-90 hover:opacity-90 transition-all group"
          >
            <div className="w-12 h-12 rounded-full rd-bg-surface flex items-center justify-center mb-4 rd-accent group-hover:scale-110 transition-transform">
              <Swords className="w-6 h-6" />
            </div>
            <h3 className="font-bold rd-text-ink mb-2">{tUI('debateRoom')}</h3>
            <p className="text-xs rd-text-muted">{locale === 'ko' ? '거인의 사상과 논쟁해보세요' : 'Argue with the giant'}</p>
          </Link>
          <Link
            href={`/consult?giant=${giant.slug}`}
            onClick={() => trackCTAEvent('giant_page', 'counsel', locale, giant.slug)}
            className="flex flex-col items-center text-center p-6 rounded-2xl border rd-hairline hover:opacity-90 hover:opacity-90 transition-all group"
          >
            <div className="w-12 h-12 rounded-full rd-bg-faint flex items-center justify-center mb-4 rd-accent group-hover:scale-110 transition-transform">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="font-bold rd-text-ink mb-2">{tNav('consult')}</h3>
            <p className="text-xs rd-text-muted">{locale === 'ko' ? '거인에게 해답을 구하세요' : 'Seek answers from the giant'}</p>
          </Link>
          <Link
            href="/?mode=match"
            onClick={() => trackCTAEvent('giant_page', 'dna', locale, giant.slug)}
            className="flex flex-col items-center text-center p-6 rounded-2xl border rd-hairline hover:opacity-90 hover:opacity-90 transition-all group"
          >
            <div className="w-12 h-12 rounded-full rd-bg-faint flex items-center justify-center mb-4 rd-accent group-hover:scale-110 transition-transform">
              <Dna className="w-6 h-6" />
            </div>
            <h3 className="font-bold rd-text-ink mb-2">{tNav('dnaTest')}</h3>
            <p className="text-xs rd-text-muted">{locale === 'ko' ? '나와 닮은 거인은?' : 'Find your giant match'}</p>
          </Link>
        </div>
      </div>

      {/* Related Giants Recommendation */}
      {relatedGiants.length > 0 && (
        <div className="max-w-6xl mx-auto px-8 pb-24 space-y-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full rd-bg-accent flex items-center justify-center border rd-hairline">
              <Sparkles className="w-6 h-6 rd-accent" />
            </div>
            <h2 className="text-3xl font-serif font-bold rd-text-ink">
              {tUI('recommendedGiants')}
            </h2>
            <p className="text-sm rd-text-muted max-w-lg">
              {locale === 'ko' 
                ? '동일한 분야에서 뜻을 품고 역경을 이겨내며 인류에 기여한 거인들을 만나보세요.' 
                : 'Explore the legacy of other giants who walked a similar path in this field.'}
            </p>
            <div className="w-24 h-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedGiants.map((related: any) => {
              return (
                <RelatedGiantCard
                  key={related.slug}
                  related={related}
                  locale={locale}
                  getRelatedTranslation={getRelatedTranslation}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Modal */}

      {isChatOpen && (
        <ChatInterface
          giant={giant}
          era={eraContent}
          onClose={() => {
            setIsChatOpen(false)
            // clean up query parameters to avoid re-opening
            const newParams = new URLSearchParams(queryParams.toString())
            newParams.delete('chat')
            newParams.delete('chatId')
            newParams.delete('mode')
            newParams.delete('problem')
            const qs = newParams.toString()
            router.replace(`/giant/${giant.slug}${qs ? `?${qs}` : ''}`, { scroll: false })
            // pathname is unchanged by this replace, so the sync effect will not re-run:
            // keep local state aligned with the cleaned URL explicitly.
            setQueryParams(newParams)
          }}
          initialChatId={chatId || undefined}
          problemId={queryParams.get('problem') || undefined}
        />
      )}

      {/* Match Found Overlay */}
      <AnimatePresence>
        {showMatchOverlay && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[color:color-mix(in_srgb,var(--rd-text-ink)_45%,transparent)]"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]`} />
            </div>

            <m.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl rounded-[3rem] p-8 md:p-12 border rd-hairline text-center overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowMatchOverlay(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:opacity-90 transition-colors"
              >
                <X className="w-6 h-6 rd-text-muted" />
              </button>

              <div className="space-y-8">
                <m.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-2xl rd-bg-accent flex items-center justify-center border rd-hairline mx-auto"
                >
                  <Dna className="w-10 h-10 rd-accent" />
                </m.div>

                <div className="space-y-2">
                  <h2 className="text-sm font-bold rd-accent">Perfect Match Found</h2>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold rd-text-ink">{tt("result.matchFound")}</h2>
                </div>

                {/* Archetype Card */}
                <div className="p-8 rounded-[2rem] rd-bg-surface border rd-hairline space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] rd-text-muted font-bold">{tt("result.archetype")}</span>
                    <h3 className="text-2xl font-serif font-bold rd-accent">
                      {dna && archetypes[dna]?.name[activeLocale]}
                    </h3>
                  </div>
                  <p className="rd-text-muted leading-relaxed">
                    {dna && archetypes[dna]?.description[activeLocale]}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden" style={{ boxShadow: "0 0 0 4px var(--rd-border)" }}>
                      <Image 
                        src={giant.imageUrl} 
                        alt={tg.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs rd-text-muted">{tt("result.matchedGiant")}</p>
                      <p className="text-xl font-bold rd-text-ink">{tg.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <button
                      onClick={() => setShowMatchOverlay(false)}
                      className="py-4 px-6 rounded-2xl hover:opacity-90 rd-text-ink font-bold transition-all border rd-hairline"
                    >
                      {tt("result.readEpic")}
                    </button>
                    <button
                      onClick={() => {
                        setShowMatchOverlay(false)
                        setIsChatOpen(true)
                      }}
                      className="py-4 px-6 rounded-2xl rd-bg-accent hover:opacity-90 font-bold transition-opacity flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {tt("result.chatNow")}
                    </button>
                  </div>
                </div>
              </div>

              {/* 결과 공유하기 */}
              <div className="border-t rd-hairline pt-6 space-y-4">
                <p className="text-xs rd-text-muted font-bold">{tUI('shareResults')}</p>

                {/* Card Type Toggle */}
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    onClick={() => setShareCardType('story')}
                    className={`flex-1 max-w-[170px] min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
 shareCardType === 'story'
 ? 'rd-bg-accent rd-hairline'
 : 'rd-bg-surface rd-text-muted rd-hairline hover:opacity-90 hover:opacity-90'
 }`}
                  >
                    <span>📱</span>
                    <span>{tUI('storyFormat')}</span>
                  </button>
                  <button
                    onClick={() => setShareCardType('square')}
                    className={`flex-1 max-w-[170px] min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
 shareCardType === 'square'
 ? 'rd-bg-accent rd-hairline'
 : 'rd-bg-surface rd-text-muted rd-hairline hover:opacity-90 hover:opacity-90'
 }`}
                  >
                    <span>⬜</span>
                    <span>{locale === 'ko' ? '정방형 (1:1)' : 'Square (1:1)'}</span>
                  </button>
                </div>

                {/* Share Cards */}
                {shareCardType === 'story' ? (
                  /* Story card container & preview scale wrapper */
                  <div 
                    ref={containerRef} 
                    className="w-full max-w-[340px] aspect-[9/16] relative overflow-hidden mx-auto rounded-3xl border rd-hairline bg-[#020617]"
                    style={{ height: `${340 * 16 / 9}px` }}
                  >
                    <div 
                      ref={storyCardRef}
                      style={{ 
                        transform: `scale(${cardScale})`, 
                        transformOrigin: 'top left', 
                        width: '1080px', 
                        height: '1920px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    >
                      {/* Background Ambient and Stars */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, #020617 0%, #0f172a 100%)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '120px 80px',
                        color: '#ffffff',
                        fontFamily: 'sans-serif',
                      }}>
                        {/* Gradient Ambient Blob */}
                        <div style={{
                          position: 'absolute',
                          top: '30%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '800px',
                          height: '800px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }} />
                        
                        {/* Delicate Particle Stars */}
                        {[
                          { top: '15%', left: '20%', size: '8px', opacity: 0.4 },
                          { top: '25%', left: '80%', size: '10px', opacity: 0.6 },
                          { top: '45%', left: '15%', size: '6px', opacity: 0.3 },
                          { top: '60%', left: '85%', size: '12px', opacity: 0.5 },
                          { top: '75%', left: '25%', size: '8px', opacity: 0.4 },
                          { top: '85%', left: '70%', size: '10px', opacity: 0.5 },
                        ].map((star, idx) => (
                          <div key={idx} style={{
                            position: 'absolute',
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            borderRadius: '50%',
                            backgroundColor: '#f59e0b',
                            boxShadow: '0 0 12px #f59e0b',
                            opacity: star.opacity,
                          }} />
                        ))}

                        {/* Top: Logo & URL */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                          <span style={{ color: '#f59e0b', fontSize: '38px', fontWeight: '900', letterSpacing: '0.15em', fontFamily: 'Georgia, serif' }}>GIANTS WISDOM</span>
                          <span style={{ color: '#475569', fontSize: '24px', letterSpacing: '0.05em' }}>giantswisdom.com</span>
                        </div>

                        {/* Divider 1 */}
                        <div style={{ width: '100%', height: '2px', background: 'linear-gradient(to right, transparent, rgba(245, 158, 11, 0.3), transparent)', zIndex: 10 }} />

                        {/* Middle: Giant's circular image (300px) */}
                        <div style={{ display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                          <div style={{ 
                            width: '300px', 
                            height: '300px', 
                            borderRadius: '50%', 
                            overflow: 'hidden', 
                            border: '6px solid #f59e0b',
                            boxShadow: '0 0 40px rgba(245, 158, 11, 0.25)' 
                          }}>
                            <img src={giant.imageUrl} alt={tg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                          </div>
                        </div>

                        {/* Middle: DNA label & Type */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', zIndex: 10 }}>
                          <span style={{ color: '#f59e0b', fontSize: '22px', letterSpacing: '0.3em', fontWeight: 'bold' }}>
                            {locale === 'ko' ? '나의 유산 DNA' : locale === 'de' ? 'MEINE HERITAGE DNA' : 'MY HERITAGE DNA'}
                          </span>
                          <h2 style={{ color: '#FEF3C7', fontSize: '54px', fontWeight: '800', fontFamily: 'Georgia, serif', lineHeight: '1.2', margin: '10px 0' }}>
                            {dna ? archetypes[dna]?.name[activeLocale] : ''}
                          </h2>
                          <p style={{ color: '#94A3B8', fontSize: '32px', fontWeight: '500' }}>
                            {tg.name}{locale === 'ko' ? ' 유형' : locale === 'de' ? ' Typ' : ' Type'}
                          </p>
                        </div>

                        {/* Divider 2 */}
                        <div style={{ width: '100%', height: '2px', background: 'linear-gradient(to right, transparent, rgba(245, 158, 11, 0.3), transparent)', zIndex: 10 }} />

                        {/* Middle: Italic Quote */}
                        <div style={{ padding: '0 20px', textAlign: 'center', zIndex: 10 }}>
                          <p style={{ 
                            color: '#E2E8F0', 
                            fontSize: '32px', 
                            fontStyle: 'italic', 
                            fontFamily: 'Georgia, serif', 
                            lineHeight: '1.6', 
                            wordBreak: 'keep-all',
                          }}>
                            &ldquo;{tg.quote}&rdquo;
                          </p>
                        </div>

                        {/* Divider 3 */}
                        <div style={{ width: '100%', height: '2px', background: 'linear-gradient(to right, transparent, rgba(245, 158, 11, 0.3), transparent)', zIndex: 10 }} />

                        {/* Bottom: CTA */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center', zIndex: 10 }}>
                          <span style={{ color: '#94A3B8', fontSize: '24px', letterSpacing: '0.1em' }}>
                            {locale === 'ko' ? '나와 닮은 위인은?' : locale === 'de' ? 'Welcher Riese ähnelt dir?' : 'Who is your soul giant?'}
                          </span>
                          <span style={{ color: '#f59e0b', fontSize: '36px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {locale === 'ko' ? '지금 테스트하기' : locale === 'de' ? 'Jetzt testen' : 'Test Now'} <span style={{ fontSize: '30px' }}>→</span>
                          </span>
                          <a href={`/${locale}/dna`} className="rd-accent hover:underline break-all block truncate w-40 sm:w-auto">
                            giantswisdom.com/dna
                          </a>
                        </div>

                      </div>
                    </div>
                  </div>
                ) : (
                  /* Square card — captured by html2canvas */
                  <div
                    ref={shareCardRef}
                    style={{
                      background: 'linear-gradient(135deg, #0B0F1A 0%, #111827 100%)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      borderRadius: '20px',
                      padding: '28px 24px',
                      maxWidth: '360px',
                      margin: '0 auto',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 14px', border: '2px solid rgba(245,158,11,0.5)' }}>
                      <img src={giant.imageUrl} alt={tg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                    </div>
                    <p style={{ color: '#F59E0B', fontSize: '10px', letterSpacing: '0.2em', fontWeight: '700', textTransform: '', marginBottom: '6px' }}>{locale === 'ko' ? '나의 유산 DNA' : locale === 'de' ? 'MEINE HERITAGE DNA' : locale === 'pt' ? 'MEU DNA DE HERANÇA' : 'My Heritage DNA'}</p>
                    <p style={{ color: '#FEF3C7', fontSize: '18px', fontWeight: '700', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>
                      {dna ? archetypes[dna]?.name[activeLocale] : ''}
                    </p>
                    <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '18px' }}>{tg.name}{locale === 'ko' ? ' 유형' : locale === 'de' ? ' Typ' : ' Type'}</p>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 0', marginBottom: '18px' }}>
                      <p style={{ color: '#CBD5E1', fontSize: '12px', fontStyle: 'italic', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                        &ldquo;{(tg.quote || '').slice(0, 70)}{(tg.quote || '').length > 70 ? '...' : ''}&rdquo;
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{ color: '#F59E0B', fontWeight: '700', fontSize: '13px' }}>Giants Wisdom</span>
                      <span style={{ color: '#475569', fontSize: '11px' }}>giantswisdom.com</span>
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="space-y-3 max-w-[360px] mx-auto">
                  {/* Save as Image */}
                  <button
                    onClick={handleSaveImage}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl rd-bg-surface hover:opacity-90 border rd-hairline text-sm font-bold rd-text-ink transition-all active:scale-95 min-h-[48px]"
                  >
                    <Download className="w-4 h-4" />
                    {locale === 'ko' ? '이미지로 저장' : 'Save as Image'}
                  </button>

                  {/* Kakao & Copy Link */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={shareToKakao}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] text-sm font-bold transition-all active:scale-95 min-h-[48px] cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.007-.188.688-.68 2.48-.778 2.875-.158.625.228.618.48.45 1.97-1.312 2.72-1.848 3.823-2.583.4.056.802.088 1.205.088 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
                      </svg>
                      {locale === 'ko' ? '카카오톡' : 'Kakao Share'}
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all active:scale-95 min-h-[48px] border cursor-pointer ${
 copied 
 ? 'rd-bg-surface rd-accent rd-hairline' 
 : 'rd-bg-surface hover:opacity-90 rd-hairline rd-text-ink'
 }`}
                    >
                      <Link2 className="w-4 h-4" />
                      {copied 
                        ? (locale === 'ko' ? '복사됨! ✓' : 'Copied! ✓') 
                        : (locale === 'ko' ? '링크 복사' : 'Copy Link')
                      }
                    </button>
                  </div>

                  {/* X (Twitter) & Facebook */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleTwitterShare}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl rd-bg-surface hover:bg-[#1a1a1a] border border-[#222222] text-sm font-bold rd-text-ink transition-all active:scale-95 min-h-[48px] cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      {locale === 'ko' ? 'X 공유' : 'Share on X'}
                    </button>

                    <button
                      onClick={handleFacebookShare}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 rd-text-ink text-sm font-bold transition-all active:scale-95 min-h-[48px] cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                      {locale === 'ko' ? 'Facebook 공유' : 'Share on Facebook'}
                    </button>
                  </div>

                  {/* Native Share */}
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl rd-bg-accent hover:opacity-90 border rd-hairline text-sm font-bold rd-accent transition-all active:scale-95 min-h-[48px] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    {locale === 'ko' ? '공유하기' : 'Share'}
                  </button>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Copy-link toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full rd-bg-accent font-bold text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          {locale === 'ko' ? '복사 완료!' : 'Copied!'}
        </div>
      )}
    </div>
  )
}
