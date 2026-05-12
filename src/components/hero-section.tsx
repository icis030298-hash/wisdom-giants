"use client"

import { useEffect, useState, useMemo } from "react"
import { Sparkles, ChevronDown } from "lucide-react"

// Generate stable particle positions
const generateParticles = (count: number) => {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: seededRandom(i * 1) * 100,
    top: seededRandom(i * 2) * 100,
    delay: seededRandom(i * 3) * 5,
    duration: 4 + seededRandom(i * 4) * 4,
  }))
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const particles = useMemo(() => generateParticles(20), [])

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central mystical glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-amber-500/20 via-amber-500/5 to-transparent blur-3xl animate-pulse-glow" />
        
        {/* Secondary glow rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-amber-500/10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-amber-500/5 animate-[spin_90s_linear_infinite_reverse]" />
        
        {/* Floating particles */}
        {isMounted && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-amber-500/20">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-200/80 font-medium tracking-wide">위대한 지성들의 전당</span>
        </div>

        {/* Main title */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tight">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
            Shoulders of
          </span>
          <span className="block mt-2 italic">Giants</span>
        </h1>

        {/* Quote */}
        <div className="relative max-w-3xl mx-auto mt-8 mb-12">
          <div className="absolute -left-4 -top-4 text-6xl text-amber-500/20 font-serif">&ldquo;</div>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed font-light italic px-8">
            내가 더 멀리 보았다면, 그것은 거인들의 어깨 위에 올라섰기 때문이다.
          </p>
          <p className="text-amber-400/80 mt-4 text-sm tracking-widest uppercase">— 아이작 뉴턴</p>
          <div className="absolute -right-4 -bottom-4 text-6xl text-amber-500/20 font-serif">&rdquo;</div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a href="#giants" className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground rounded-xl font-medium text-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              여정 시작하기
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          
          <a href="#giants" className="px-8 py-4 glass-card rounded-xl font-medium text-lg text-foreground border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all">
            전당 둘러보기
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16">
          {[
            { value: "40+", label: "위대한 지성" },
            { value: "2500+", label: "지혜의 역사" },
            { value: "∞", label: "영감" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground tracking-widest uppercase font-medium">Discover</span>
        <ChevronDown className="w-5 h-5 text-amber-400/60" />
      </div>
    </section>
  )
}
