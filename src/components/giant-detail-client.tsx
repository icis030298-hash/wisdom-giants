"use client"

import { useState } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { useRouter } from "@/i18n/routing"
import { 
  ArrowLeft, 
  MessageCircle, 
  Sparkles, 
  History, 
  HeartPulse, 
  Lightbulb,
  Quote
} from "lucide-react"

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
  const router = useRouter()
  
  const { giantDetail: t, giants: tg, giantsGrid: tc } = translations;

  // Get lessons as raw array from translations
  const lessons = tg.lessons;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image 
          src={giant.imageUrl} 
          alt={tg.name}
          fill
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
                {tc.categories[giant.category]}
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
              <span>{t.chatWith.replace("{name}", tg.name.split(" ")[0])}</span>
              <Sparkles className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Sagas */}
        <div className="lg:col-span-2 space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <History className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">{t.thePain}</h2>
            </div>
            <div className="glass-card p-8 rounded-3xl border-l-4 border-l-red-500/50">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
                {tg.pain}
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <HeartPulse className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">{t.theRecovery}</h2>
            </div>
            <div className="glass-card p-8 rounded-3xl border-l-4 border-l-emerald-500/50">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {tg.recovery}
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3 text-amber-400">
              <Lightbulb className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">{t.wisdomLessons}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessons.map((lesson: any, index: number) => (
                <div key={index} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                    <span className="text-amber-400 font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lesson.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Profile & Quote */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl sticky top-24">
            <div className="flex items-center gap-3 text-amber-400 mb-6">
              <Quote className="w-6 h-6" />
              <h2 className="text-xl font-serif font-bold uppercase tracking-widest">{t.famousQuote}</h2>
            </div>
            <blockquote className="text-2xl font-serif italic text-foreground leading-snug mb-8">
              &ldquo;{tg.quote}&rdquo;
            </blockquote>
            
            <div className="space-y-6 pt-8 border-t border-white/10">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t.era}</h4>
                <p className="text-foreground">{tg.era}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t.field}</h4>
                <p className="text-foreground">{giant.field}</p>
              </div>
            </div>

            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full mt-10 py-4 rounded-xl bg-white/5 border border-white/10 text-foreground font-bold hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t.askForAdvice}
            </button>
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
    </main>
  )
}
