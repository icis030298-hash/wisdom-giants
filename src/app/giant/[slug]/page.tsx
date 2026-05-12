"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { giantsData } from "@/data/giants"
import { giants, type Giant } from "@/lib/giants-data"
import { 
  ArrowLeft, 
  MessageCircle, 
  Sparkles, 
  History, 
  HeartPulse, 
  Lightbulb,
  Quote
} from "lucide-react"

export default function GiantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  const slug = params.slug as string
  const rawGiant = giantsData.find(g => g.slug === slug)
  const giant = giants.find(g => g.slug === slug)
  
  if (!rawGiant || !giant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">거인을 찾을 수 없습니다.</h1>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-xl bg-amber-500 text-black font-bold"
        >
          홈으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image 
          src={giant.imageUrl} 
          alt={giant.name}
          fill
          className="object-cover"
          unoptimized={true}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-amber-400 mb-6 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>거인들의 광장으로</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-widest border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {giant.field}
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
                {giant.name}
              </h1>
              <p className="text-xl md:text-2xl text-amber-400/90 font-medium">
                {rawGiant.headline}
              </p>
            </div>
            
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{giant.name.split(" ")[0]}와 대화하기</span>
              <Sparkles className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: The Epic (Pain & Recovery) */}
        <div className="lg:col-span-2 space-y-16">
          {/* Pain Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <History className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-bold uppercase tracking-wide">지독한 시련 (The Pain)</h2>
            </div>
            <div className="glass-card p-8 rounded-3xl border-rose-500/10 bg-rose-500/5">
              <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {rawGiant.pain}
              </p>
            </div>
          </section>

          {/* Recovery Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400">
              <HeartPulse className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-bold uppercase tracking-wide">위대한 극복 (The Recovery)</h2>
            </div>
            <div className="glass-card p-8 rounded-3xl border-emerald-500/10 bg-emerald-500/5">
              <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {rawGiant.recovery}
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: Lessons & Quote */}
        <div className="space-y-12">
          {/* Quote */}
          <div className="relative p-8 rounded-3xl glass-card border-amber-500/20 bg-amber-500/5 overflow-hidden">
            <Quote className="absolute -top-4 -left-4 w-24 h-24 text-amber-500/10 -rotate-12" />
            <p className="relative text-xl italic text-amber-100 leading-relaxed font-serif">
              &ldquo;{giant.quote}&rdquo;
            </p>
            <div className="mt-4 text-right">
              <span className="text-sm font-bold text-amber-500">— {giant.name}</span>
            </div>
          </div>

          {/* Lessons */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Lightbulb className="w-6 h-6" />
              <h2 className="text-xl font-serif font-bold uppercase tracking-wide">삶의 지혜 (Lessons)</h2>
            </div>
            <div className="space-y-4">
              {rawGiant.lessons.map((lesson, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl border-white/5 hover:border-amber-500/30 transition-all group">
                  <h3 className="font-bold text-amber-200 mb-2 group-hover:text-amber-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lesson.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Sticky CTA for mobile */}
          <div className="lg:hidden h-20" />
        </div>
      </div>

      {/* Chat Interface Modal */}
      {isChatOpen && (
        <ChatInterface 
          giant={giant} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </main>
  )
}
