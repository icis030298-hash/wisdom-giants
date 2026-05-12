"use client"

import { Sparkles, ArrowRight, Clock, Quote } from "lucide-react"
import { GiantImage } from "./ui/giant-image"
import type { Giant } from "@/lib/giants-data"

interface FeaturedGiantsProps {
  giants: Giant[]
  onSelectGiant: (giant: Giant) => void
}

export function FeaturedGiants({ giants, onSelectGiant }: FeaturedGiantsProps) {
  // Take first 6 for featured section
  const featured = giants.slice(0, 6)
  
  return (
    <section className="relative py-20 px-4">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                오늘의 위인
              </span>
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg">
              인류 지식의 토대를 닦은 위대한 선구자들과의 대화를 시작해보세요.
            </p>
          </div>
          
          <a href="#giants" className="hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group">
            <span>전체 위인 보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
      
      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Large featured card - Newton */}
          <div 
            className="md:col-span-2 md:row-span-2 group relative glass-card rounded-3xl p-8 cursor-pointer overflow-hidden hover:border-amber-500/30 transition-all"
            onClick={() => onSelectGiant(featured[0])}
          >
            {/* Image background layer */}
            <div className="absolute inset-0 z-0 bg-muted">
              <GiantImage 
                src={featured[0].imageUrl} 
                alt={featured[0].name}
                fill
                className="object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-110"
                priority
                fallbackText={featured[0].name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                containerClassName="absolute inset-0 text-6xl opacity-20"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${featured[0].color} mix-blend-multiply opacity-40`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
                  추천
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground group-hover:text-amber-200 transition-colors mb-2">
                  {featured[0].name}
                </h3>
                <p className="text-amber-400/80 text-lg">{featured[0].title}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featured[0].era}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/80 text-xs">
                    {featured[0].field}
                  </span>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {featured[0].description}
                </p>
                
                <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <Quote className="w-4 h-4 text-amber-400/60 shrink-0 mt-0.5" />
                  <p className="text-sm italic text-foreground/80">&ldquo;{featured[0].quote}&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Medium cards */}
          {featured.slice(1, 3).map((giant) => (
            <div
              key={giant.id}
              className="group relative glass-card rounded-2xl p-6 cursor-pointer overflow-hidden hover:border-amber-500/30 transition-all"
              onClick={() => onSelectGiant(giant)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${giant.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden mb-4 ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all bg-muted flex items-center justify-center">
                  <GiantImage 
                    src={giant.imageUrl} 
                    alt={giant.name}
                    fill
                    className="object-cover"
                    fallbackText={giant.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    containerClassName="absolute inset-0 text-sm"
                  />
                </div>
                
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-amber-200 transition-colors">
                    {giant.name}
                  </h3>
                  <p className="text-sm text-amber-400/80 mt-1">{giant.title}</p>
                  <p className="text-xs text-muted-foreground mt-2">{giant.era}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Small cards */}
          {featured.slice(3, 6).map((giant) => (
            <div
              key={giant.id}
              className="group relative glass-card rounded-2xl p-5 cursor-pointer overflow-hidden hover:border-amber-500/30 transition-all"
              onClick={() => onSelectGiant(giant)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${giant.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-amber-500/20 bg-muted flex items-center justify-center">
                    <GiantImage 
                      src={giant.imageUrl} 
                      alt={giant.name}
                      fill
                      className="object-cover"
                      fallbackText={giant.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      containerClassName="absolute inset-0 text-xs"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-amber-200 transition-colors leading-tight">
                      {giant.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{giant.era}</p>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                  {giant.description}
                </p>
                
                <span className="inline-block mt-3 px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-300/80 w-fit">
                  {giant.field.split("&")[0].trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile view all link */}
      <div className="md:hidden text-center mt-8">
        <a href="#giants" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
          <span>전체 위인 보기</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  )
}
