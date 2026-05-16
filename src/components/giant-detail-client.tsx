"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/routing"
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
  Dna
} from "lucide-react"
import { archetypes } from "@/data/heritage-test"

interface GiantDetailClientProps {
  giant: any;
  translations: {
    giantDetail: any;
    giants: any;
    giantsGrid: any;
  }
}

export function GiantDetailClient({ giant, translations }: GiantDetailClientProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showMatchOverlay, setShowMatchOverlay] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const tt = useTranslations("Test")
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const dna = searchParams.get('dna')

  useEffect(() => {
    if (mode === 'match') {
      setShowMatchOverlay(true)
    }
  }, [mode])
  
  const { giantDetail: t, giants: tg, giantsGrid: tc, narrative } = translations;

  // Use standardized narrative if available, otherwise fallback to basic translations
  const epicContent = narrative?.epic;
  const trialsContent = narrative?.trials || tg.pain;
  const overcomingContent = narrative?.overcoming || tg.recovery;
  const wisdomList = narrative?.wisdom || (giant.lessons || []).map((l: any) => ({ quote: l.title, meaning: l.content }));
  
  const eraContent = narrative?.era || narrative?.era_ko || giant.era || tg.era;

  // Helper to render text (simplified, as we'll use CSS pre-wrap)
  const formatContent = (text: string) => {
    if (!text) return null;
    return text.replace(/\\n/g, '\n');
  };

  const categoryLabel = tc.categories?.[giant.category] || 
    (typeof giant.category === 'string' ? 
      ({
        'achievement': '성취',
        'adversity': '역경',
        'wisdom': '지혜',
        'creativity': '창의'
      } as any)[giant.category.toLowerCase()] : null) || giant.category;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image 
          src={giant.imageUrl} 
          alt={tg.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
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
              <span>{t.chatWith.replace("{name}", (tg.name || "").split(" ")[0])}</span>
              <Sparkles className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
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
              
              <div className="glass-card p-12 md:p-16 rounded-[3rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-[100px]" />
                
                <div className="relative z-10 space-y-10">
                  {(epicContent || "").split(/\n\n|\\n\\n/).map((paragraph, idx) => (
                    paragraph ? (
                      <p 
                        key={idx} 
                        className={`text-lg md:text-xl text-slate-200 leading-relaxed tracking-tight font-normal text-justify
                          ${idx === 0 ? 'first-letter:text-6xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-amber-400 first-letter:font-black first-letter:leading-none first-letter:mt-2' : ''}`}
                      >
                        {paragraph}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 2. Trials & Overcoming Combined into a sophisticated layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trials */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-red-400/80">
                <History className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-widest">{t.thePain}</h2>
              </div>
              <div className="glass-card p-8 rounded-[2rem] border border-red-500/10 bg-red-500/[0.02] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-4">
                  {(trialsContent || "").split(/\n\n|\\n\\n/).map((p, i) => (
                    p ? (
                      <p key={i} className="text-slate-200 leading-relaxed font-normal">
                        {p}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </section>

            {/* Overcoming */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-emerald-400/80">
                <HeartPulse className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-widest">{t.theRecovery}</h2>
              </div>
              <div className="glass-card p-8 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/[0.02] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-4">
                  {(overcomingContent || "").split(/\n\n|\\n\\n/).map((p, i) => (
                    p ? (
                      <p key={i} className="text-slate-200 leading-relaxed font-normal">
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

            <div className="grid grid-cols-1 gap-10">
              {wisdomList.length > 0 ? (
                wisdomList.map((item: any, index: number) => (
                  <div key={index} className="glass-card p-12 rounded-[3rem] border border-white/[0.05] hover:border-amber-500/30 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/[0.03] rounded-full blur-3xl group-hover:bg-amber-500/[0.07] transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-6 mb-10">
                        <span className="text-5xl font-black text-amber-500/10 select-none">
                          0{index + 1}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
                      </div>
                      
                      <blockquote className="text-2xl md:text-3xl font-serif italic text-amber-400/90 mb-10 leading-[1.4] tracking-tight whitespace-pre-wrap">
                        &ldquo;{formatContent(item.quote)}&rdquo;
                      </blockquote>
                      
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/40 to-transparent rounded-full" />
                        <p className="text-lg text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                          {formatContent(item.meaning)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                tg.lessons.map((lesson: any, index: number) => (
                  <div key={index} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
                    <h3 className="text-xl font-bold text-foreground mb-2">{lesson.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {lesson.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Profile & Quote */}
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent sticky top-24 space-y-10">
            {/* Header with Quote Icon */}
            <div className="relative">
              <Quote className="w-12 h-12 text-amber-500/20 absolute -top-6 -left-6" />
              <blockquote className="text-2xl font-serif italic text-foreground leading-tight relative z-10 whitespace-pre-wrap">
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

      {/* Chat Modal */}
      {isChatOpen && (
        <ChatInterface 
          giant={giant} 
          onClose={() => setIsChatOpen(false)} 
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
              className="relative w-full max-w-2xl glass-card rounded-[3rem] p-8 md:p-12 border border-amber-500/30 text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]"
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
                      {dna && archetypes[dna]?.name[locale as 'ko' | 'en']}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {dna && archetypes[dna]?.description[locale as 'ko' | 'en']}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
