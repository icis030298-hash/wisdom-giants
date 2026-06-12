"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, Link } from "@/i18n/routing"
import { 
  ArrowLeft,
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
  Share2
} from "lucide-react"
import { archetypes } from "@/data/heritage-test"
import { giants } from "@/lib/giants-data"
import { ConditionalAdSense } from "@/components/conditional-adsense"
import { AdSlot } from "@/components/ad-slot"
import GiantAvatar from "@/components/GiantAvatar"

interface GiantDetailClientProps {
  giant: any;
  translations: {
    giantDetail: any;
    giants: any;
    giantsGrid: any;
  }
}

function RelatedGiantCard({ related, locale, getRelatedTranslation }: { related: any; locale: string; getRelatedTranslation: any }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Link
      href={`/giant/${related.slug}`}
      className="group relative glass-card rounded-3xl p-6 border border-white/5 hover:border-amber-500/30 transition-all duration-500 flex flex-col h-full hover:scale-[1.02] bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden animate-fade-in-up"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 bg-muted">
        {!imgErr ? (
          <Image
            src={related.imageUrl}
            alt={`${related.name} - Giants Wisdom`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950">
            <GiantAvatar slug={related.slug} category={related.category} size={100} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      
      <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-amber-300 transition-colors mb-1">
        {getRelatedTranslation(related.slug, 'name', related.name)}
      </h3>
      <p className="text-xs text-amber-400/80 mb-4 font-medium">
        {getRelatedTranslation(related.slug, 'headline', related.title || related.headline)}
      </p>
      
      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
        {getRelatedTranslation(related.slug, 'shortDescription', related.description)}
      </p>
      
      <div className="mt-auto w-full py-3.5 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all border border-amber-500/20 group-hover:border-amber-500/40 text-center flex items-center justify-center gap-1">
        <span>{locale === 'ko' ? '대서사시 읽기' : 'Read Epic'}</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

export function GiantDetailClient({ giant, translations }: GiantDetailClientProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showMatchOverlay, setShowMatchOverlay] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const activeLocale = (locale === 'ko' ? 'ko' : locale === 'de' ? 'de' : locale === 'ja' ? 'ja' : 'en') as 'ko' | 'en' | 'de' | 'ja';
  const tt = useTranslations("Test")
  const searchParams = useSearchParams()
  const chatParam = searchParams.get('chat')
  const chatId = searchParams.get('chatId')
  const mode = searchParams.get('mode')
  const dna = searchParams.get('dna')

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
    if (chatParam === 'true' || searchParams.get('problem')) {
      setIsChatOpen(true)
    }
  }, [chatParam, searchParams])

  // Initialize Kakao SDK safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const Kakao = (window as any).Kakao
      if (Kakao && !Kakao.isInitialized()) {
        Kakao.init('b175da0c630ebd18d18862f12fc1cb09')
      }
    }
  }, [])
  
  const { giantDetail: t, giants: tg, giantsGrid: tc, narrative } = translations;

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
  
  const eraContent = narrative?.era || tg.era || giant.era;

  // Helper to render text (simplified, as we'll use CSS pre-wrap)
  const formatContent = (text: string) => {
    if (!text) return null;
    return text.replace(/\\n/g, '\n');
  };

  const parseParagraphs = (content: string | string[] | undefined): string[] => {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    return content.split(/\n\n|\\n\\n/);
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
    const shareUrl = `${window.location.origin}/${locale}/test`
    
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
      ? `나와 닮은 역사 속 위인은 ${giantName}! 당신은 어떤 위인과 닮았나요? 👉 https://www.giantswisdom.com/ko/test`
      : locale === 'de'
      ? `Mein historischer Zwilling ist ${giantName}! Welchem Riesen ähneln Sie? 👉 https://www.giantswisdom.com/de/test`
      : locale === 'pt' ? `Minha figura histórica é ${giantName}! Com qual personagem histórico você se parece? 👉 https://www.giantswisdom.com/pt/test` : `My historical match is ${giantName}! Who's your historical match? 👉 https://www.giantswisdom.com/en/test`;
    
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
      ? 'https://www.giantswisdom.com/ko/test'
      : locale === 'de'
      ? 'https://www.giantswisdom.com/de/test'
      : 'https://www.giantswisdom.com/en/test';
    
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
      ? 'https://www.giantswisdom.com/ko/test'
      : locale === 'de'
      ? 'https://www.giantswisdom.com/de/test'
      : 'https://www.giantswisdom.com/en/test';
    
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
              mobileWebUrl: `https://www.giantswisdom.com/${locale}/test`,
              webUrl: `https://www.giantswisdom.com/${locale}/test`,
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
    <main className="min-h-screen bg-background">
      <ConditionalAdSense />
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
      {!imageError ? (
        <Image 
          src={giant.imageUrl} 
          alt={tg.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <GiantAvatar slug={giant.slug} category={giant.category} size={250} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="breadcrumb" className="mb-6 flex items-center">
            <ol className="flex items-center space-x-2 text-xs md:text-sm text-zinc-400 font-sans">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {locale === 'ko' ? '홈' : 'Home'}
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li>
                <Link href="/#giants" className="hover:text-amber-400 transition-colors">
                  {locale === 'ko' ? '거인들의 전당' : 'Hall of Giants'}
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li className="text-amber-400 font-semibold truncate max-w-[150px] md:max-w-none" aria-current="page">
                {tg.name}
              </li>
            </ol>
          </nav>

          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-amber-400 mb-6 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.returnToSquare}</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-widest border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {categoryLabel}
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
                {tg.name}
              </h1>
              <p className="text-xl md:text-2xl text-amber-400/90 font-medium">
                {tg.headline}
              </p>
            </div>
            
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1"
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
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Sagas */}
        <div className="lg:col-span-2 space-y-20">
          {/* 1. Epic Narrative Section */}
          {epicContent && (
            <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 text-amber-500/80">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-[0.2em]">{t.theLifeStory}</h2>
              </div>
              
              <div className="glass-card p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-[3rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-[100px]" />
                
                <div className="relative z-10 space-y-6 md:space-y-10">
                  {parseParagraphs(epicContent).map((paragraph: string, idx: number) => {
                    if (!paragraph) return null;
                    
                    if (idx === 0) {
                      // Apply defensive DropCap logic: Trim leading special characters and whitespaces
                      let cleaned = paragraph.trim();
                      cleaned = cleaned.replace(/^[\s*#_~`‘“"'"]+/g, ''); // Strip leading markdown / quotes
                      cleaned = cleaned.replace(/\*\*/g, '').replace(/\*/g, ''); // Clean double/single asterisks
                      
                      const firstLetter = cleaned.substring(0, 1);
                      const restOfText = cleaned.substring(1);
                      
                      return (
                        <p 
                          key={idx} 
                          className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed tracking-tight font-normal text-left md:text-justify"
                        >
                          <span className="text-5xl md:text-6xl font-serif mr-3 md:mr-4 float-left text-amber-400 font-black leading-none mt-1 md:mt-2">
                            {firstLetter}
                          </span>
                          {restOfText}
                        </p>
                      );
                    }
                    
                    return (
                      <p 
                        key={idx} 
                        className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed tracking-tight font-normal text-left md:text-justify"
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* 2. Trials & Overcoming Combined into a sophisticated layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Trials */}
            <section className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 text-red-400/80">
                <History className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-widest">{t.thePain}</h2>
              </div>
              <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-red-500/10 bg-red-500/[0.02] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-3 md:space-y-4">
                  {parseParagraphs(trialsContent).map((p: string, i: number) => (
                    p ? (
                      <p key={i} className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
                        {p}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </section>

            {/* Overcoming */}
            <section className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 text-emerald-400/80">
                <HeartPulse className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-widest">{t.theRecovery}</h2>
              </div>
              <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-emerald-500/10 bg-emerald-500/[0.02] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-3 md:space-y-4">
                  {parseParagraphs(overcomingContent).map((p: string, i: number) => (
                    p ? (
                      <p key={i} className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
                        {p}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* 4. Wisdom (Quotes) Section */}
          <section className="space-y-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <Lightbulb className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-foreground">{t.wisdomLessons}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-10">
              {wisdomList.length > 0 ? (
                wisdomList.map((item: any, index: number) => (
                  <div key={index} className="glass-card p-6 md:p-12 rounded-2xl md:rounded-[3rem] border border-white/[0.05] hover:border-amber-500/30 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/[0.03] rounded-full blur-3xl group-hover:bg-amber-500/[0.07] transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-6 mb-6 md:mb-10">
                        <span className="text-4xl md:text-5xl font-black text-amber-500/10 select-none">
                          0{index + 1}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
                      </div>
                      
                      <blockquote className="text-lg md:text-2xl lg:text-3xl font-serif italic text-amber-400/90 mb-6 md:mb-10 leading-[1.4] tracking-tight whitespace-pre-wrap">
                        &ldquo;{formatContent(item.quote)}&rdquo;
                      </blockquote>
                      
                      <div className="relative pl-5 md:pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/40 to-transparent rounded-full" />
                        <p className="text-sm md:text-base lg:text-lg text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                          {formatContent(item.meaning)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                (tg.lessons || []).map((lesson: any, index: number) => (
                  <div key={index} className="glass-card p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{lesson.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {lesson.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* AdSpace Container with safe margin */}
          <div className="ad-container my-12 flex justify-center border-t border-white/5 pt-8">
            <AdSlot slot="4898120960" format="horizontal" />
          </div>
        </div>

        {/* Right Column: Profile & Quote */}
        <div className="space-y-8">
          <div className="glass-card p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent sticky top-24 space-y-6 md:space-y-10">
            {/* Header with Quote Icon */}
            <div className="relative">
              <Quote className="w-8 h-8 md:w-12 md:h-12 text-amber-500/20 absolute -top-4 -left-4 md:-top-6 md:-left-6" />
              <blockquote className="text-lg md:text-2xl font-serif italic text-foreground leading-tight relative z-10 whitespace-pre-wrap pl-2">
                &ldquo;{formatContent(tg.quote)}&rdquo;
              </blockquote>
            </div>
            
            {/* Metadata with better styling */}
            <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">{t.era}</h4>
                <p className="text-sm font-medium text-foreground/80">{eraContent}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">{t.field}</h4>
                <p className="text-sm font-medium text-foreground/80">{categoryLabel}</p>
              </div>
            </div>

            {/* Action Button: Glowing & Premium */}
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full py-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-lg transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 group active:scale-95"
            >
              <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              {t.askForAdvice}
            </button>

            {/* Subtle subtext */}
            <p className="text-[10px] text-center text-muted-foreground/50 leading-relaxed px-4">
              {tg.headline}
            </p>
          </div>
        </div>
      </div>

      {/* Related Giants Recommendation */}
      {relatedGiants.length > 0 && (
        <div className="max-w-6xl mx-auto px-8 pb-24 space-y-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground">
              {locale === 'ko' ? '관련 거인 추천' : 'Recommended Giants'}
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              {locale === 'ko' 
                ? '동일한 분야에서 뜻을 품고 역경을 이겨내며 인류에 기여한 거인들을 만나보세요.' 
                : 'Explore the legacy of other giants who walked a similar path in this field.'}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
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
          onClose={() => {
            setIsChatOpen(false)
            // clean up query parameters to avoid re-opening
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete('chat')
            newParams.delete('chatId')
            newParams.delete('mode')
            newParams.delete('problem')
            const qs = newParams.toString()
            router.replace(`/giant/${giant.slug}${qs ? `?${qs}` : ''}`, { scroll: false })
          }}
          initialChatId={chatId || undefined}
          problemId={searchParams.get('problem') || undefined}
        />
      )}

      {/* Match Found Overlay */}
      <AnimatePresence>
        {showMatchOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-2xl"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br ${giant.color} opacity-20 blur-[120px]`} />
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card rounded-[3rem] p-8 md:p-12 border border-amber-500/30 text-center shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowMatchOverlay(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>

              <div className="space-y-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/40 mx-auto"
                >
                  <Dna className="w-10 h-10 text-amber-400" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em]">Perfect Match Found</h2>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">{tt("result.matchFound")}</h1>
                </div>

                {/* Archetype Card */}
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{tt("result.archetype")}</span>
                    <h3 className="text-2xl font-serif font-bold text-amber-300">
                      {dna && archetypes[dna]?.name[activeLocale]}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {dna && archetypes[dna]?.description[activeLocale]}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-amber-500/20 shadow-xl">
                      <Image 
                        src={giant.imageUrl} 
                        alt={tg.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">{tt("result.matchedGiant")}</p>
                      <p className="text-xl font-bold text-foreground">{tg.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <button
                      onClick={() => setShowMatchOverlay(false)}
                      className="py-4 px-6 rounded-2xl glass hover:bg-white/5 text-foreground font-bold transition-all border border-white/10"
                    >
                      {tt("result.readEpic")}
                    </button>
                    <button
                      onClick={() => {
                        setShowMatchOverlay(false)
                        setIsChatOpen(true)
                      }}
                      className="py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {tt("result.chatNow")}
                    </button>
                  </div>
                </div>
              </div>

              {/* 결과 공유하기 */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{locale === 'ko' ? '결과 공유하기' : 'Share Results'}</p>

                {/* Card Type Toggle */}
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    onClick={() => setShareCardType('story')}
                    className={`flex-1 max-w-[170px] min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      shareCardType === 'story'
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground'
                    }`}
                  >
                    <span>📱</span>
                    <span>{locale === 'ko' ? '스토리형 (9:16)' : 'Story (9:16)'}</span>
                  </button>
                  <button
                    onClick={() => setShareCardType('square')}
                    className={`flex-1 max-w-[170px] min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      shareCardType === 'square'
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground'
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
                    className="w-full max-w-[340px] aspect-[9/16] relative overflow-hidden mx-auto rounded-3xl border border-amber-500/30 bg-[#020617] shadow-2xl"
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
                          <h1 style={{ color: '#FEF3C7', fontSize: '54px', fontWeight: '800', fontFamily: 'Georgia, serif', lineHeight: '1.2', margin: '10px 0' }}>
                            {dna ? archetypes[dna]?.name[activeLocale] : ''}
                          </h1>
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
                          <span style={{ color: '#475569', fontSize: '24px', marginTop: '4px' }}>
                            giantswisdom.com/test
                          </span>
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
                    <p style={{ color: '#F59E0B', fontSize: '10px', letterSpacing: '0.2em', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>{locale === 'ko' ? '나의 유산 DNA' : locale === 'de' ? 'MEINE HERITAGE DNA' : locale === 'pt' ? 'MEU DNA DE HERANÇA' : 'My Heritage DNA'}</p>
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
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-foreground transition-all active:scale-95 min-h-[48px]"
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
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-foreground'
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
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black hover:bg-[#1a1a1a] border border-[#222222] text-sm font-bold text-white transition-all active:scale-95 min-h-[48px] cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      {locale === 'ko' ? 'X 공유' : 'Share on X'}
                    </button>

                    <button
                      onClick={handleFacebookShare}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white text-sm font-bold transition-all active:scale-95 min-h-[48px] cursor-pointer"
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
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-sm font-bold text-amber-400 transition-all active:scale-95 min-h-[48px] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    {locale === 'ko' ? '공유하기' : 'Share'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy-link toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full bg-amber-500 text-black font-bold text-sm shadow-xl shadow-amber-500/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {locale === 'ko' ? '복사 완료!' : 'Copied!'}
        </div>
      )}
    </main>
  )
}
