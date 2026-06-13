"use client"

import { Sparkles, ArrowRight, Clock, Quote } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"
import type { Giant } from "@/lib/giants-data"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

interface FeaturedGiantsProps {
  giants: Giant[]
}

export function FeaturedGiants({ giants }: FeaturedGiantsProps) {
  const t = useTranslations("Featured")
  const tg = useTranslations("Giants")
  const tc = useTranslations("GiantsGrid")
  const tgSec = useTranslations("GiantsSection")
  const mostConsultedLabel = tgSec("mostConsulted")

  // Helper to get translated text with fallback
  const getT = (giant: Giant, key: string, fallback: string) => {
    if (!giant || !giant.id) {
      console.error(`[FeaturedGiants] MISSING ID for giant:`, giant);
      return fallback;
    }
    try {
      const translated = tg(`${giant.slug}.${key}`)
      if (translated.includes(`${giant.slug}.`) || translated === `Giants.${giant.slug}.${key}`) {
        return fallback
      }
      return translated
    } catch (e) {
      return fallback;
    }
  }
  
  // Daily rotating logic
  const featured = useMemo(() => {
    // Defense: filter out invalid giants
    const validGiants = giants.filter(g => g && g.id && g.slug);
    if (validGiants.length === 0) return [];

    const today = new Date()
    // Create a stable seed for the current day
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    
    // Select 4 giants based on the daily seed
    const shuffled = [...validGiants].sort((a, b) => {
      const hashA = (a.slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * dateSeed) % validGiants.length
      const hashB = (b.slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * dateSeed) % validGiants.length
      return hashA - hashB
    })
    
    return shuffled.slice(0, 4)
  }, [giants])

  if (!featured || featured.length === 0) return null;
  
  return (
    <section id="featured-giants" className="relative py-24 px-6">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                {t("title")}
              </span>
            </h2>
            <p className="text-muted-foreground/80 max-w-[850px] text-lg font-light leading-relaxed tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              {t("description")}
            </p>
          </div>
          
          <Link href="#giants" className="flex items-center gap-2 text-amber-400/80 hover:text-amber-400 transition-all group text-sm font-medium tracking-wide uppercase">
            <span>{t("viewAll")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Redesigned Bento Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          {/* Main Featured Card (2x2) */}
          <Link 
            href={`/giant/${featured[0].slug}`}
            className="md:col-span-2 md:row-span-2 group relative glass-card rounded-[2rem] p-10 cursor-pointer overflow-hidden hover:border-amber-500/40 transition-all duration-500 block shadow-2xl shadow-amber-500/5"
          >
            <div className="absolute inset-0 z-0 bg-muted">
              <Image 
                src={featured[0].imageUrl} 
                alt={getT(featured[0], "name", featured[0].name)}
                fill
                className="object-cover object-top opacity-20 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-105"
                priority
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${featured[0].color} mix-blend-soft-light opacity-30`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-6">
                  <Sparkles className="w-3 h-3" />
                  {t("bestPick")}
                </span>
                <h3 className="font-serif text-4xl md:text-5xl font-bold text-foreground group-hover:text-amber-200 transition-colors mb-3 leading-tight">
                  {getT(featured[0], "name", featured[0].name)}
                </h3>
                <p className="text-amber-400/90 text-xl font-medium tracking-tight italic">{getT(featured[0], "headline", featured[0].title)}</p>
              </div>
              
              <div className="max-w-md">
                <div className="flex items-center gap-4 text-xs text-muted-foreground/60 mb-6 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {tc("era")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="uppercase tracking-wider">
                    {tc(`categories.${featured[0].category}`)}
                  </span>
                </div>
                
                <div className="flex items-start gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Quote className="w-5 h-5 text-amber-400/40 shrink-0 mt-1" />
                  <p className="text-base leading-relaxed text-foreground/90 font-light italic">
                    &ldquo;{getT(featured[0], "quote", featured[0].quote)}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Secondary Wide Card (2x1) */}
          <Link
            href={`/giant/${featured[1].slug}`}
            className="lg:col-span-2 group relative glass-card rounded-[1.5rem] p-8 cursor-pointer overflow-hidden hover:border-amber-500/40 transition-all duration-500 block"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${featured[1].color} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            
            <div className="relative z-10 h-full flex items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-amber-400/60 uppercase tracking-[0.2em]">{t("todaysPick")}</span>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {mostConsultedLabel}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-amber-200 transition-colors mb-2">
                  {getT(featured[1], "name", featured[1].name)}
                </h3>
                <p className="text-sm text-muted-foreground/80 line-clamp-2 font-light leading-relaxed">
                  {getT(featured[1], "shortDescription", featured[1].description)}
                </p>
              </div>
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 ring-4 ring-amber-500/5 group-hover:ring-amber-500/20 transition-all duration-500 bg-muted">
                <Image 
                  src={featured[1].imageUrl} 
                  alt={getT(featured[1], "name", featured[1].name)}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </Link>
          
          {/* Small Cards (1x1 each) */}
          {featured.slice(2, 4).map((giant) => (
            <Link
              key={giant.id}
              href={`/giant/${giant.slug}`}
              className="group relative glass-card rounded-[1.5rem] p-8 cursor-pointer overflow-hidden hover:border-amber-500/40 transition-all duration-500 block"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${giant.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
              
              <div className="relative z-10 h-full flex flex-col items-center text-center">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden mb-6 ring-2 ring-amber-500/10 group-hover:ring-amber-500/30 transition-all duration-500 bg-muted">
                  <Image 
                    src={giant.imageUrl} 
                    alt={getT(giant, "name", giant.name)}
                    fill
                    className="object-cover object-top"
                    unoptimized={true}
                  />
                </div>
                
                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-amber-200 transition-colors mb-1">
                  {getT(giant, "name", giant.name)}
                </h3>
                <p className="text-xs text-muted-foreground/60 font-medium tracking-tight">{tc("era")}</p>
                
                <div className="mt-auto pt-4 flex items-center gap-1.5 text-amber-400/70 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span>{t("chatNow")}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

